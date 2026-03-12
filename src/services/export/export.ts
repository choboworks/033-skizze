// src/services/export/export.ts
// PDF/A-1b Export mit pdf-lib - OHNE pdfmake, einfache positive Transformationen
// für maximale Kompatibilität mit schwachen PDF-Readern (z.B. EAS Niedersachsen)

import type { Canvas } from 'fabric'
import { getSrgbIcc } from './srgb-icc'
import {
  PDFDocument,
  PDFName,
  PDFArray,
  PDFString,
  PDFHexString,
  PDFNumber,
  PDFDict,
  PDFRef,
} from 'pdf-lib'

// ===== Public Types =====
export type Orientation = 'portrait' | 'landscape'

export interface SavePdfOptions {
  canvas: Canvas
  orientation: Orientation
  filename: string // ohne .pdf
  dpi?: number // optional, default 300 (Snapshot-Qualität)
  jpegQuality?: number // 0..1, default 0.95
}

// ===== A4 Maße (pt und mm) =====
const A4_PT = {
  portrait: { w: 595.28, h: 841.89 },
  landscape: { w: 841.89, h: 595.28 },
} as const

const A4_MM = {
  portrait: { w: 210 as const, h: 297 as const },
  landscape: { w: 297 as const, h: 210 as const },
} as const

const MM_PER_INCH = 25.4
const mmToPixels = (mm: number, dpi: number) =>
  Math.round((mm / MM_PER_INCH) * dpi)

// ===== Fabric → JPEG Snapshot (OPAQUE) =====
type ToDataURLOpts = NonNullable<Parameters<Canvas['toDataURL']>[0]> & {
  enableRetinaScaling?: boolean
  quality?: number
}

function snapshotCanvasAsJpeg(
  canvas: Canvas,
  targetPxW: number,
  targetPxH: number,
  quality = 0.95
): string {
  const baseW = canvas.getWidth()
  const baseH = canvas.getHeight()

  const retina =
    typeof (canvas as Canvas & { getRetinaScaling?: () => number }).getRetinaScaling ===
      'function'
      ? (canvas as Canvas & { getRetinaScaling: () => number }).getRetinaScaling()
      : 1

  const baseOutW = Math.max(1, Math.round(baseW * retina))
  const baseOutH = Math.max(1, Math.round(baseH * retina))

  const multW = targetPxW / baseOutW
  const multH = targetPxH / baseOutH
  const multiplier = Math.min(multW, multH)

  const opts: ToDataURLOpts = {
    format: 'jpeg',
    quality,
    multiplier,
    enableRetinaScaling: true,
  }
  return canvas.toDataURL(opts)
}

// ===== Metadaten-Typen =====
type InfoForXmp = {
  title: string
  subject: string
  author: string
  keywords: string
  producer: string
  creatorTool: string
  creationDate: string  // ISO 8601 Format für XMP
  modDate: string       // ISO 8601 Format für XMP
}

// ===== Helfer: Date → PDF-String-Format =====
function dateToPdfString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  
  const year = date.getUTCFullYear()
  const month = pad(date.getUTCMonth() + 1)
  const day = pad(date.getUTCDate())
  const hour = pad(date.getUTCHours())
  const minute = pad(date.getUTCMinutes())
  const second = pad(date.getUTCSeconds())
  
  // PDF-Format: D:YYYYMMDDHHmmSSZ (Z für UTC)
  return `D:${year}${month}${day}${hour}${minute}${second}Z`
}

// ===== Helfer: Date → ISO 8601 (ohne Millisekunden) =====
function dateToISO(date: Date): string {
  const iso = date.toISOString()
  return iso.replace(/\.\d{3}Z$/, 'Z')
}

// ===== XMP Packet für PDF/A-1b =====
function buildXmpPacket(info: InfoForXmp): string {
  const esc = (s?: string) =>
    (s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  return `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
          xmlns:pdf="http://ns.adobe.com/pdf/1.3/"
          xmlns:xmp="http://ns.adobe.com/xap/1.0/"
          xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
  <rdf:Description rdf:about="">
    <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${esc(info.title)}</rdf:li></rdf:Alt></dc:title>
    <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${esc(info.subject)}</rdf:li></rdf:Alt></dc:description>
    <dc:creator><rdf:Seq><rdf:li>${esc(info.author)}</rdf:li></rdf:Seq></dc:creator>
    <pdf:Producer>${esc(info.producer)}</pdf:Producer>
    <pdf:Keywords>${esc(info.keywords)}</pdf:Keywords>
    <xmp:CreatorTool>${esc(info.creatorTool)}</xmp:CreatorTool>
    <xmp:CreateDate>${esc(info.creationDate)}</xmp:CreateDate>
    <xmp:ModifyDate>${esc(info.modDate)}</xmp:ModifyDate>
    <pdfaid:part>1</pdfaid:part>
    <pdfaid:conformance>B</pdfaid:conformance>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`
}

// ===== ICC Helper =====
function normalizeICC(src: unknown): Uint8Array | null {
  if (!src) return null
  if (src instanceof Uint8Array) return src
  try {
    return new Uint8Array(src as ArrayBufferLike)
  } catch {
    return null
  }
}

// ===== Data URL → Uint8Array =====
function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1]
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

// ===== PDF Context Type Extensions =====
type ContextWithTrailerInfo = PDFDocument['context'] & {
  trailerInfo?: { 
    Info?: PDFRef
    ID?: PDFArray
  }
}

// ===== Trailer ID Generator (PDF/A-1b Pflicht) =====
function generateFileId(): string {
  // 16 Bytes (32 Hex-Zeichen) wie bei MD5
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

function setTrailerId(pdfDoc: PDFDocument): void {
  const ctx = pdfDoc.context as ContextWithTrailerInfo
  const fileId = generateFileId()
  const id1 = PDFHexString.of(fileId)
  const id2 = PDFHexString.of(fileId) // Bei Neuerstellung identisch
  
  if (ctx.trailerInfo) {
    ctx.trailerInfo.ID = pdfDoc.context.obj([id1, id2]) as PDFArray
  }
}

// ===== Metadaten ins Info-Dictionary schreiben =====
function setInfoKeywords(pdfDoc: PDFDocument, keywordsStr: string): void {
  const ctx = pdfDoc.context as ContextWithTrailerInfo
  const infoRef = ctx.trailerInfo?.Info

  if (infoRef) {
    const infoDict = ctx.lookup(infoRef, PDFDict)
    infoDict.set(PDFName.of('Keywords'), PDFString.of(keywordsStr))
    return
  }

  pdfDoc.setKeywords([keywordsStr])

  const ctx2 = pdfDoc.context as ContextWithTrailerInfo
  const infoRef2 = ctx2.trailerInfo?.Info
  if (infoRef2) {
    const infoDict2 = ctx2.lookup(infoRef2, PDFDict)
    infoDict2.set(PDFName.of('Keywords'), PDFString.of(keywordsStr))
  }
}

function setInfoDates(pdfDoc: PDFDocument, creationDate: string, modDate: string): void {
  const ctx = pdfDoc.context as ContextWithTrailerInfo
  let infoRef = ctx.trailerInfo?.Info

  if (!infoRef) {
    pdfDoc.setTitle('')
    infoRef = (pdfDoc.context as ContextWithTrailerInfo).trailerInfo?.Info
  }

  if (infoRef) {
    const infoDict = ctx.lookup(infoRef, PDFDict)
    infoDict.set(PDFName.of('CreationDate'), PDFString.of(creationDate))
    infoDict.set(PDFName.of('ModDate'), PDFString.of(modDate))
  }
}

// ===== Hauptfunktion: PDF/A-1b mit pdf-lib erstellen =====
// WICHTIG: Manueller Content Stream für maximale Kompatibilität mit schwachen Readern
async function createPdfA1bWithPdfLib(
  jpegBytes: Uint8Array,
  orientation: Orientation,
  params: { icc?: Uint8Array; info: Omit<InfoForXmp, 'creationDate' | 'modDate'> }
): Promise<Uint8Array> {
  // 1) Neues PDF-Dokument erstellen
  const pdfDoc = await PDFDocument.create()

  // 2) Seitenmaße
  const pageSize = A4_PT[orientation]
  const page = pdfDoc.addPage([pageSize.w, pageSize.h])

  // 3) JPEG einbetten
  const jpegImage = await pdfDoc.embedJpg(jpegBytes)
  const imgWidth = jpegImage.width
  const imgHeight = jpegImage.height

  // 4) Bild skalieren um die Seite auszufüllen (Aspect Ratio beibehalten)
  const scaleX = pageSize.w / imgWidth
  const scaleY = pageSize.h / imgHeight
  const scale = Math.min(scaleX, scaleY)
  
  const drawWidth = imgWidth * scale
  const drawHeight = imgHeight * scale
  
  // 5) Bild zentrieren
  const x = (pageSize.w - drawWidth) / 2
  const y = (pageSize.h - drawHeight) / 2

  // 6) MANUELLER Content Stream - wie PDF24 es macht
  // Format: q <scaleX> 0 0 <scaleY> <x> <y> cm /<imageName> Do Q
  // KEINE redundanten Identity-Matrizen!
  const imageKey = 'Im1'
  
  // Content Stream als einfacher String - minimale Struktur wie PDF24
  const contentStream = `q ${drawWidth} 0 0 ${drawHeight} ${x} ${y} cm /${imageKey} Do Q`
  const contentBytes = new TextEncoder().encode(contentStream)
  
  // Content Stream registrieren
  const contentStreamObj = pdfDoc.context.stream(contentBytes)
  const contentRef = pdfDoc.context.register(contentStreamObj)
  
  // XObject (Bild) in Page Resources eintragen
  const xObjectDict = pdfDoc.context.obj({
    [imageKey]: jpegImage.ref,
  })
  
  // Page Resources setzen
  page.node.set(PDFName.of('Resources'), pdfDoc.context.obj({
    XObject: xObjectDict,
  }))
  
  // Content Stream der Seite zuweisen
  page.node.set(PDFName.of('Contents'), contentRef)

  // 7) Datum generieren
  const now = new Date()
  const pdfDateStr = dateToPdfString(now)
  const isoDateStr = dateToISO(now)

  // 8) Metadaten setzen
  pdfDoc.setTitle(params.info.title, { showInWindowTitleBar: false })
  pdfDoc.setSubject(params.info.subject)
  pdfDoc.setAuthor(params.info.author)
  pdfDoc.setProducer(params.info.producer)
  pdfDoc.setCreator(params.info.creatorTool)

  const keywordsStr = (params.info.keywords ?? '').trim()
  setInfoKeywords(pdfDoc, keywordsStr)
  setInfoDates(pdfDoc, pdfDateStr, pdfDateStr)

  // 9) XMP Metadata für PDF/A-1b
  const fullInfo: InfoForXmp = {
    ...params.info,
    keywords: keywordsStr,
    creationDate: isoDateStr,
    modDate: isoDateStr,
  }
  
  const xmpXml = buildXmpPacket(fullInfo)
  const xmpBytes = new TextEncoder().encode(xmpXml)

  const xmpStream = pdfDoc.context.stream(xmpBytes, {
    Type: PDFName.of('Metadata'),
    Subtype: PDFName.of('XML'),
  })
  const xmpRef = pdfDoc.context.register(xmpStream)
  pdfDoc.catalog.set(PDFName.of('Metadata'), xmpRef)

  // 10) OutputIntent mit ICC-Profil für PDF/A-1b
  if (params.icc) {
    const iccStream = pdfDoc.context.flateStream(params.icc, {
      N: PDFNumber.of(3), // RGB -> 3 Komponenten
    })
    const iccRef = pdfDoc.context.register(iccStream)

    const outIntent = pdfDoc.context.obj({
      Type: PDFName.of('OutputIntent'),
      S: PDFName.of('GTS_PDFA1'),
      OutputConditionIdentifier: PDFString.of('sRGB IEC61966-2.1'),
      Info: PDFString.of('sRGB IEC61966-2.1'),
      DestOutputProfile: iccRef,
    })
    const outRef = pdfDoc.context.register(outIntent)

    const existing = pdfDoc.catalog.get(PDFName.of('OutputIntents'))
    if (existing instanceof PDFArray) {
      existing.push(outRef)
    } else {
      const arr = pdfDoc.context.obj([outRef]) as PDFArray
      pdfDoc.catalog.set(PDFName.of('OutputIntents'), arr)
    }
  }

  // 11) Trailer ID setzen (PDF/A-1b Pflicht nach ISO 19005-1:2005 6.1.3)
  setTrailerId(pdfDoc)

  // 12) Speichern mit konservativen Optionen
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false })
  
  // 13) PDF Version von 1.7 auf 1.4 patchen (PDF/A-1b Pflicht)
  // pdf-lib setzt immer 1.7, aber PDF/A-1b basiert auf PDF 1.4
  // Der EAS-Reader akzeptiert nur PDF 1.4
  return patchPdfVersion(pdfBytes, '1.4')
}

// ===== PDF Version im Header patchen =====
function patchPdfVersion(pdfBytes: Uint8Array, version: string): Uint8Array {
  // PDF Header ist "%PDF-X.Y" in den ersten 8 Bytes
  // Wir ersetzen nur die Versionsnummer
  const header = new TextDecoder().decode(pdfBytes.slice(0, 8))
  
  if (header.startsWith('%PDF-')) {
    const result = new Uint8Array(pdfBytes.length)
    result.set(pdfBytes)
    
    // Version bytes überschreiben (Position 5-7: "1.7" -> "1.4")
    const versionBytes = new TextEncoder().encode(version)
    result[5] = versionBytes[0] // '1'
    result[6] = versionBytes[1] // '.'
    result[7] = versionBytes[2] // '4'
    
    return result
  }
  
  return pdfBytes
}

// ===== kleine Browser-Helfer =====
function toPdfBlob(bytes: Uint8Array): Blob {
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
  return new Blob([buffer], { type: 'application/pdf' })
}

function openBytesInNewTab(bytes: Uint8Array): void {
  const blob = toPdfBlob(bytes)
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

function printBytesViaIframe(bytes: Uint8Array): void {
  const blob = toPdfBlob(bytes)
  const url = URL.createObjectURL(blob)
  const iframe = document.createElement('iframe')
  Object.assign(iframe.style, {
    position: 'fixed',
    right: '0',
    bottom: '0',
    width: '0',
    height: '0',
    border: '0',
  } as CSSStyleDeclaration)
  iframe.src = url
  document.body.appendChild(iframe)
  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    } finally {
      setTimeout(() => {
        URL.revokeObjectURL(url)
        iframe.remove()
      }, 2000)
    }
  }
}

// ===== Shared Helper für alle Export-Funktionen =====
function getDefaultInfo(filename: string): Omit<InfoForXmp, 'creationDate' | 'modDate'> {
  const title = (filename || '').trim() || 'Verkehrsunfallskizze'
  return {
    title,
    subject: 'Verkehrsunfallskizze',
    author: '033-Skizze',
    keywords: 'Unfallskizze, Polizei, 033-Skizze',
    producer: 'pdf-lib',
    creatorTool: '033-Skizze (Web-App)',
  }
}

// ===== Export: PDF/A-1b SPEICHERN =====
export async function saveCanvasAsPdf(opts: SavePdfOptions): Promise<void> {
  const { canvas, orientation, filename, dpi = 300, jpegQuality = 0.95 } = opts

  const page = A4_MM[orientation]
  const pxW = mmToPixels(page.w, dpi)
  const pxH = mmToPixels(page.h, dpi)
  const jpgUrl = snapshotCanvasAsJpeg(canvas, pxW, pxH, jpegQuality)
  const jpegBytes = dataUrlToBytes(jpgUrl)

  const iccNow = normalizeICC(getSrgbIcc())
  const params: { info: Omit<InfoForXmp, 'creationDate' | 'modDate'>; icc?: Uint8Array } = {
    info: getDefaultInfo(filename),
  }
  if (iccNow) params.icc = iccNow

  const pdfBytes = await createPdfA1bWithPdfLib(jpegBytes, orientation, params)
  
  const finalBlob = toPdfBlob(pdfBytes)
  const url = URL.createObjectURL(finalBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ===== Export: PDF/A-1b DRUCKEN =====
export async function printCanvasPdf(opts: SavePdfOptions): Promise<void> {
  const { canvas, orientation, dpi = 300, jpegQuality = 0.95 } = opts

  const page = A4_MM[orientation]
  const pxW = mmToPixels(page.w, dpi)
  const pxH = mmToPixels(page.h, dpi)
  const jpgUrl = snapshotCanvasAsJpeg(canvas, pxW, pxH, jpegQuality)
  const jpegBytes = dataUrlToBytes(jpgUrl)

  const iccNow = normalizeICC(getSrgbIcc())
  const params: { info: Omit<InfoForXmp, 'creationDate' | 'modDate'>; icc?: Uint8Array } = {
    info: getDefaultInfo('Verkehrsunfallskizze'),
  }
  if (iccNow) params.icc = iccNow

  const pdfBytes = await createPdfA1bWithPdfLib(jpegBytes, orientation, params)
  printBytesViaIframe(pdfBytes)
}

// ===== DEV: PDF/A-1b in neuem Tab =====
export async function openPdfaInNewTab(opts: SavePdfOptions): Promise<void> {
  const { canvas, orientation, dpi = 300, jpegQuality = 0.95 } = opts

  const page = A4_MM[orientation]
  const pxW = mmToPixels(page.w, dpi)
  const pxH = mmToPixels(page.h, dpi)
  const jpgUrl = snapshotCanvasAsJpeg(canvas, pxW, pxH, jpegQuality)
  const jpegBytes = dataUrlToBytes(jpgUrl)

  const iccNow = normalizeICC(getSrgbIcc())
  const params: { info: Omit<InfoForXmp, 'creationDate' | 'modDate'>; icc?: Uint8Array } = {
    info: getDefaultInfo('Verkehrsunfallskizze'),
  }
  if (iccNow) params.icc = iccNow

  const pdfBytes = await createPdfA1bWithPdfLib(jpegBytes, orientation, params)
  openBytesInNewTab(pdfBytes)
}

// ===== Preload entfernt (pdfmake nicht mehr benötigt) =====
// Falls andere Module preloadPdfMake() aufrufen, hier ein No-Op:
export async function preloadPdfMake(): Promise<void> {
  // Keine Vorladung mehr nötig - pdf-lib wird direkt verwendet
}