// src/canvas/core/useGrouping.ts
import { Group, util, type Canvas, type FabricObject } from 'fabric'
import { getId, getData, setData } from './canvasCore'

/** Einfache Gruppierung für Plain Objects (nicht Roads) */
export function createPlainGroup(
  canvas: Canvas,
  objects: FabricObject[],
  groupId: string,
  groupName: string,
  chainId: string
): Group {
  if (objects.length < 2) {
    throw new Error('Need at least 2 objects to group')
  }

  // Objekte vom Canvas entfernen (werden in Gruppe verschoben)
  objects.forEach((o) => canvas.remove(o))

  const group = new Group(objects, {
    subTargetCheck: true,
  })

  setData(group, {
    id: groupId,
    name: groupName,
    kind: 'chain',
    chain: {
      id: chainId,
      parts: objects.map(o => getId(o)).filter((id): id is string => !!id),
      joints: [],
      name: groupName,
    },
  })

  // chainId auf Children setzen
  objects.forEach((o) => {
    setData(o, { ...(getData(o) ?? {}), chainId })
  })

  canvas.add(group)
  group.setCoords()

  return group
}

/** Einfaches Auflösen für Plain Objects - OHNE KLONEN! */
export function dissolvePlainGroup(
  canvas: Canvas,
  group: Group
): FabricObject[] {
  const children = group.getObjects().slice()
  const baseIndex = canvas.getObjects().indexOf(group)

  // 🔥 WICHTIG: Positionen VOR dem Entfernen aus der Gruppe berechnen!
  const childStates = children.map((child) => {
    const m = child.calcTransformMatrix()
    const d = util.qrDecompose(m)
    
    return {
      child: child as FabricObject, // ← ORIGINAL behalten!
      left: d.translateX,
      top: d.translateY,
      angle: d.angle,
      scaleX: d.scaleX,
      scaleY: d.scaleY,
    }
  })

  // Gruppe entfernen (Children werden automatisch frei)
  canvas.renderOnAddRemove = false
  
  // 🔥 Kinder AUS der Gruppe entfernen (macht sie zu normalen Objekten)
  children.forEach(child => {
    group.remove(child)
  })
  
  canvas.remove(group)

  const result: FabricObject[] = []

  // Jetzt die ORIGINALEN Kinder wieder auf Canvas setzen
  for (let i = 0; i < childStates.length; i++) {
    const s = childStates[i]
    const obj = s.child

    // chainId aus data entfernen
    const data = getData(obj)
    if (data) {
      delete data.chainId
      setData(obj, data)
    }

    // Absolute Position setzen
    obj.set({
      left: s.left,
      top: s.top,
      angle: s.angle,
      scaleX: s.scaleX,
      scaleY: s.scaleY,
      originX: 'center',
      originY: 'center',
    })
    obj.setCoords()

    canvas.add(obj)

    // Z-Order
    const targetZ = baseIndex >= 0 ? baseIndex + i : canvas.getObjects().length - 1
    const list = canvas.getObjects()
    const cur = list.indexOf(obj)
    if (cur !== -1 && cur !== targetZ) {
      list.splice(cur, 1)
      list.splice(targetZ, 0, obj)
    }

    result.push(obj)
  }

  canvas.renderOnAddRemove = true
  canvas.requestRenderAll()

  return result
}