// src/modules/library/infrastructure.ts

export const infrastructure = {

  // ---------------------------------------------------------------------------
  // Straßen
  // ---------------------------------------------------------------------------

  infra_gerade_strasse_kurz: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <rect width="100" height="100" style="fill: #525252;"/>
  <rect x="2" width="3" height="100" style="fill: #e7e6e6;"/>
  <rect x="95" width="3" height="100" style="fill: #e7e6e6;"/>
  <rect x="48" y="62.1" width="4" height="25" style="fill: #fff;"/>
  <rect x="48" y="13" width="4" height="25" style="fill: #fff;"/>
  <rect id="conn-bottom" x="48" y="96" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
  <rect id="conn-top" x="48" width="4" height="4" style="fill: #e52320; fill-opacity: 0;"/>
</svg>
`,

  infra_gerade_strasse_lang: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,300h100V0H0v300Z" style="fill: #525252; fill-rule: evenodd;"/>
  <path d="M95,300h3V0h-3v300h0ZM5,0h-3v300h3V0Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <rect x="48" y="213" width="4" height="25" style="fill: #fff;"/>
  <rect x="48" y="262" width="4" height="25" style="fill: #fff;"/>
  <rect x="48" y="113" width="4" height="25" style="fill: #fff;"/>
  <rect x="48" y="162" width="4" height="25" style="fill: #fff;"/>
  <rect x="48" y="13" width="4" height="25" style="fill: #fff;"/>
  <rect x="48" y="62.1" width="4" height="25" style="fill: #fff;"/>
  <rect id="conn-top" x="48" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
  <rect id="conn-botom" x="48" y="296" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
</svg>
`,

  infra_kurve_links: `
<svg id="infra_kurve_links" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 200 200">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M100,200h100C200,89.5,110.5,0,0,0v100c55.2,0,100,44.8,100,100Z" style="fill: #525252; fill-rule: evenodd;"/>
  <path d="M18.7,53.1c13.1,1.6,25.6,5,37.4,9.8l1.5-3.7c-12.1-5-25-8.4-38.4-10.1l-.5,4Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M89.7,82.1c10.3,7.8,19.5,17,27.5,27.3l3.2-2.4c-8.1-10.5-17.6-19.9-28.2-28l-2.4,3.2h0Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M136.7,142.8c4.9,11.8,8.4,24.3,10.1,37.4l4-.5c-1.8-13.4-5.3-26.3-10.4-38.4l-3.7,1.5h0Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M0,98c56.3,0,102,45.7,102,102h3c0-58-47-105-105-105v3h0Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <path d="M0,5c107.7,0,195,87.3,195,195h3C198,90.6,109.4,2,0,2v3Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <rect id="conn-left" y="48" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
  <rect id="conn-bottom" x="148" y="196" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
</svg>
`,

  infra_kurve_rechts: `
<svg id="infra_kurve_rechts" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 200 200">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M200,100V0C89.5,0,0,89.5,0,200h100c0-55.2,44.8-100,100-100Z" style="fill: #525252; fill-rule: evenodd;"/>
  <path d="M180.8,49.1c-13.4,1.7-26.3,5.1-38.4,10.1l1.5,3.7c11.8-4.8,24.3-8.2,37.4-9.8,0,0-.5-4-.5-4Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M107.9,78.9c-10.6,8.1-20.1,17.5-28.2,28l3.2,2.4c7.9-10.2,17.2-19.4,27.5-27.3,0,0-2.4-3.2-2.4-3.2Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M63.3,142.8l-3.7-1.5c-5.1,12.1-8.6,24.9-10.4,38.4l4,.5c1.7-13.1,5.2-25.6,10.1-37.4h0Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M200,98v-3c-58,0-105,47-105,105h3c0-56.3,45.7-102,102-102h0Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <path d="M200,2c-109.4,0-198,88.6-198,198h3c0-107.7,87.3-195,195-195v-3Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <rect id="conn-top" x="196" y="48" width="4" height="4" transform="translate(396 100) rotate(-180)" style="fill: #fff; fill-opacity: 0;"/>
  <rect id="conn-bottom" x="48" y="196" width="4" height="4" transform="translate(100 396) rotate(-180)" style="fill: #fff; fill-opacity: 0;"/>
</svg>
`,

  infra_s_kurve: `
<svg id="infra_s_kurve" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 300 399.2">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,299.2v100c110.5,0,200-89.5,200-200h-100c0,55.2-44.8,100-100,100Z" style="fill: #525252; fill-rule: evenodd;"/>
  <path d="M146.9,217.9c-1.6,13.1-5,25.6-9.8,37.4l3.7,1.5c5-12.1,8.4-25,10.1-38.4l-4-.5Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M117.9,288.9c-7.8,10.3-17,19.5-27.3,27.5l2.4,3.2c10.5-8.1,19.9-17.6,28-28.2l-3.2-2.4h0Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M57.2,335.9c-11.8,4.9-24.3,8.4-37.4,10.1l.5,4c13.4-1.8,26.3-5.3,38.4-10.4l-1.5-3.7h0Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M102,199.2c0,56.3-45.7,102-102,102v3c58,0,105-47,105-105h-3Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <path d="M195,199.2c0,107.7-87.3,195-195,195v3c109.4,0,198-88.6,198-198h-3Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <rect id="conn" y="347.2" width="4" height="4" transform="translate(351.2 347.2) rotate(90)" style="fill: #fff; fill-opacity: 0;"/>
  <path d="M300,100V0C189.5,0,100,89.5,100,200h100c0-55.2,44.8-100,100-100Z" style="fill: #525252; fill-rule: evenodd;"/>
  <path d="M153.1,181.3c1.6-13.1,5-25.6,9.8-37.4l-3.7-1.5c-5,12.1-8.4,25-10.1,38.4l4,.5Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M182.1,110.3c7.8-10.3,17-19.5,27.3-27.5l-2.4-3.2c-10.5,8.1-19.9,17.6-28,28.2l3.2,2.4h0Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M242.8,63.3c11.8-4.9,24.3-8.4,37.4-10.1l-.5-4c-13.4,1.8-26.3,5.3-38.4,10.4l1.5,3.7h0Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M198,200c0-56.3,45.7-102,102-102v-3c-58,0-105,47-105,105h3Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <path d="M105,200C105,92.3,192.3,5,300,5v-3c-109.4,0-198,88.6-198,198h3Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <rect id="conn1" x="296" y="48" width="4" height="4" transform="translate(248 348) rotate(-90)" style="fill: #fff; fill-opacity: 0;"/>
</svg>
`,

  infra_brueckenfahrbahn: `
<svg id="infra_brueckenfahrbahn" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 300 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <circle cx="204.1" cy="238.4" r="13" style="fill: #808181;"/>
  <circle cx="204.1" cy="61.5" r="13" style="fill: #808181;"/>
  <rect x="200" y="100" width="100" height="100" style="fill: #525252;"/>
  <rect x="200" y="100" width="14.8" height="100" style="fill: #010101;"/>
  <rect x="200" y="195" width="100" height="3" style="fill: #e7e6e6;"/>
  <rect x="200" y="102" width="100" height="3" style="fill: #e7e6e6;"/>
  <rect x="214.8" y="148.1" width="25" height="4" style="fill: #fff;"/>
  <rect x="263.9" y="148.1" width="25" height="4" style="fill: #fff;"/>
  <rect x="200" y="102" width="14.8" height="3" style="fill: #9a9999;"/>
  <rect x="200" y="195" width="14.8" height="3" style="fill: #9a9999;"/>
  <rect x="200" y="195" width="14.8" height="3" style="fill: #9a9999;"/>
  <polygon points="200 269.2 204.1 257.1 204.1 150 204.1 42.9 200 30.8 200 150 200 269.2" style="fill: #b4b4b4; fill-rule: evenodd;"/>
  <rect x="201.3" y="231.5" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="201.3" y="202.6" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="201.3" y="173.7" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <polygon points="206.9 155.1 201.3 155.1 201.3 150 201.3 144.9 206.9 144.9 206.9 150 206.9 155.1" style="fill: #9a9999; fill-rule: evenodd;"/>
  <circle cx="95.9" cy="238.4" r="13" style="fill: #808181;"/>
  <circle cx="95.9" cy="61.6" r="13" style="fill: #808181;"/>
  <rect y="100" width="100" height="100" style="fill: #525252;"/>
  <rect x="85.2" y="100" width="14.8" height="100" style="fill: #010101;"/>
  <path d="M200,300h-100V0h100v300Z" style="fill: #525252; fill-rule: evenodd;"/>
  <path d="M105,300h-3V0h3v300Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <path d="M198,300h-3V0h3v300Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <rect x="147.9" y="214.8" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="263.9" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="114.8" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="163.9" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="14.8" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="63.9" width="4" height="25" style="fill: #fff;"/>
  <rect y="195" width="100" height="3" style="fill: #e7e6e6;"/>
  <rect y="102" width="100" height="3" style="fill: #e7e6e6;"/>
  <rect x="60.2" y="148.1" width="25" height="4" style="fill: #fff;"/>
  <rect x="11.1" y="148.1" width="25" height="4" style="fill: #fff;"/>
  <rect x="85.2" y="102" width="14.8" height="3" style="fill: #9a9999;"/>
  <rect x="85.2" y="195" width="14.8" height="3" style="fill: #9a9999;"/>
  <rect x="85.2" y="195" width="14.8" height="3" style="fill: #9a9999;"/>
  <polygon points="100 269.2 95.9 257.1 95.9 150 95.9 42.9 100 30.8 100 150 100 269.2" style="fill: #b4b4b4; fill-rule: evenodd;"/>
  <rect x="93.1" y="231.5" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="93.1" y="202.6" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="93.1" y="173.7" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <polygon points="93.1 155.1 98.7 155.1 98.7 150 98.7 144.9 93.1 144.9 93.1 150 93.1 155.1" style="fill: #9a9999; fill-rule: evenodd;"/>
  <rect x="201.3" y="58.3" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="201.3" y="87.2" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="201.3" y="116" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="93.1" y="58.3" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="93.1" y="87.2" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="93.1" y="116" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <circle id="conn" cx="150" cy="2" r="2" style="fill: #fff; fill-opacity: 0;"/>
  <circle id="conn1" cx="150" cy="298" r="2" style="fill: #fff; fill-opacity: 0;"/>
  <circle id="conn2" cx="298" cy="150" r="2" style="fill: #fff; fill-opacity: 0;"/>
  <circle id="conn3" cx="2" cy="150" r="2" style="fill: #fff; fill-opacity: 0;"/>
</svg>
`,

  infra_brueckenfahrbahn_fluss: `
<svg id="infra_brueckenfahrbahn_fluss" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 300 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <circle cx="204.1" cy="61.6" r="13" transform="translate(16.2 162.3) rotate(-45)" style="fill: #808181;"/>
  <circle cx="204.1" cy="238.4" r="13" style="fill: #808181;"/>
  <polygon points="200 30.8 204.1 42.9 204.1 150 204.1 257.1 200 269.2 200 150 200 30.8" style="fill: #b4b4b4; fill-rule: evenodd;"/>
  <rect x="201.3" y="58.3" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="201.3" y="87.2" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="201.3" y="231.5" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <circle cx="95.9" cy="238.4" r="13" style="fill: #808181;"/>
  <circle cx="95.9" cy="61.6" r="13" style="fill: #808181;"/>
  <path d="M200,300h-100V0h100v300Z" style="fill: #525252; fill-rule: evenodd;"/>
  <path d="M105,300h-3V0h3v300Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <path d="M198,300h-3V0h3v300Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <rect x="147.9" y="214.8" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="263.9" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="14.8" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="63.9" width="4" height="25" style="fill: #fff;"/>
  <polygon points="100 269.2 95.9 257.1 95.9 150 95.9 42.9 100 30.8 100 150 100 269.2" style="fill: #b4b4b4; fill-rule: evenodd;"/>
  <rect x="93.1" y="231.5" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="93.1" y="58.3" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="93.1" y="87.2" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <path d="M257.5,116.7c5.1-.2,12.3-.3,17.7.4,9.8,1.4,12.6,2.5,23.6,3.5.7,0,1.1,0,1.2.1h0c0,0-.1,0,0,0v-13.9c-2.6,0-3.9-1-6.2-1s-2.6.2-4.1.4c-1.5.2-3.2.3-5.7.5-2.4.2-5.5.6-8.6.8-3.1.2-6.2.2-8.8,0-2.6-.1-4.7-.3-7.2-.5-2.4-.1-5.2-.2-7.8-.1-2.6,0-5.2.3-7.4.4-2.2,0-4,0-6-.2-1.9-.1-4-.3-6.1-.5-2.2-.2-4.5-.5-6.7-.5-2.3,0-4.5.1-6.6.3-2.1.1-3.9.2-5.5.2s-2.9-.5-4.4-.5c-1.5,0-2.4.7-4.9.7v13.9c7,.2,28.3-3.2,39.2-3.5,5.9-.2,9-.3,14.1-.5h0Z" style="fill: #54bbde; fill-rule: evenodd;"/>
  <path d="M244.4,107.3c2.2,0,4.7-.3,7.4-.4,2.6,0,5.4,0,7.8.1,2.4.1,4.6.4,7.2.5,2.6.1,5.7.1,8.8,0,3.1-.2,6.2-.6,8.6-.8,2.4-.3,4.2-.4,5.7-.5,1.5-.2,2.8-.4,4.1-.4,2.2,0,3.5,1,6.2,1v-3c-3,0-7.4-.4-9.6-.5-3.3-.2-8-.9-12.2-.8s-7.9.7-11.2,1.2c-3.3.5-6.2.8-9.6,1.1-3.5.3-7.6.6-11.4.6-3.9,0-7.5-.2-10.3-.6-2.9-.4-4.9-1-7.1-1.2s-4.4.2-6.4,0c-2-.2-3.8-1-5.5-1.3-5-.8-8.8,1.5-12.6,1.5v3c2.6,0,3.4-.7,4.9-.7,1.5,0,2.9.5,4.4.5s3.4,0,5.5-.2c2.1-.1,4.3-.3,6.6-.3,2.3,0,4.6.3,6.7.5,2.2.2,4.2.4,6.1.5,1.9.1,3.8.3,6,.2h0Z" style="fill: #a05b1b; fill-rule: evenodd;"/>
  <path d="M267,103.6c3.3-.5,7-1.1,11.2-1.2s8.9.6,12.2.8c2.2.2,6.6.5,9.6.5v-4.1c-3,.2-5.9.5-8.2.6-2.2.2-3.8.2-6.3.1-2.5-.1-6-.4-9.9-.6-3.9-.2-8.4-.2-11.8,0-3.4.2-5.8.7-8.4.5-2.5-.1-5.2-.8-7.9-1.3-2.7-.4-5.5-.5-8.9-.4-3.4.1-7.4.5-10.4.4-3-.2-4.9-.9-7.9-1.2-3-.3-7.3-.3-10,.3s-4,1.5-6.3,1.5v4c3.8,0,7.6-2.3,12.6-1.5,1.7.3,3.5,1.1,5.5,1.3,2,.2,4.2-.2,6.4,0s4.2.7,7.1,1.2c2.9.4,6.5.6,10.3.6,3.9,0,7.9-.3,11.4-.6,3.5-.3,6.4-.6,9.6-1.1Z" style="fill: #59882f; fill-rule: evenodd;"/>
  <path d="M204.1,150v29.3c.1,0,.5,0,1.2.1,11.1,1,13.8,2.1,23.6,3.5,5.4.7,12.5.6,17.7.4,5.1-.2,8.2-.3,14.1-.5,10.9-.3,32.3-3.7,39.2-3.5v-58.7c-.1,0-.5,0-1.2-.1-11.1-1-13.8-2.1-23.6-3.5-5.4-.7-12.5-.6-17.7-.4-5.1.2-8.2.3-14.1.5-10.9.3-32.3,3.7-39.2,3.5v29.3h0Z" style="fill: #45aed6; fill-rule: evenodd;"/>
  <path d="M246.6,183.3c-5.1.2-12.3.3-17.7-.4-9.8-1.4-12.6-2.5-23.6-3.5-.7,0-1.1,0-1.2-.1h0c0,0,.1,0,0,0v13.9c2.6,0,3.9,1,6.2,1s2.6-.2,4.1-.4c1.5-.2,3.3-.3,5.7-.5,2.4-.2,5.5-.6,8.6-.8,3.1-.2,6.2-.2,8.8,0,2.6.1,4.7.3,7.2.5,2.4.1,5.2.2,7.8.1,2.6,0,5.2-.3,7.4-.4,2.2,0,4,0,6,.2s4,.3,6.1.5c2.2.2,4.5.5,6.7.5,2.3,0,4.5-.1,6.6-.3,2.1-.1,3.9-.2,5.5-.2s2.9.5,4.4.5c1.5,0,2.4-.7,4.9-.7v-13.9c-7-.2-28.3,3.2-39.2,3.5-5.9.2-9,.3-14.1.5h0Z" style="fill: #54bbde; fill-rule: evenodd;"/>
  <path d="M259.7,192.7c-2.2,0-4.7.3-7.4.4-2.6,0-5.4,0-7.8-.1-2.4-.1-4.6-.4-7.2-.5-2.6-.1-5.7-.1-8.8,0-3.1.2-6.2.6-8.6.8-2.4.3-4.2.4-5.7.5-1.5.2-2.8.4-4.1.4-2.2,0-3.5-1-6.2-1v3c3,0,7.4.4,9.6.5,3.3.2,8,.9,12.2.8,4.2,0,7.9-.7,11.2-1.2,3.3-.5,6.2-.8,9.6-1.1,3.5-.3,7.6-.6,11.4-.6,3.9,0,7.5.2,10.3.6,2.9.4,4.9,1,7.1,1.2,2.1.1,4.4-.2,6.4,0s3.8,1,5.5,1.3c5,.8,8.8-1.5,12.6-1.5v-3c-2.6,0-3.4.7-4.9.7-1.5,0-2.9-.5-4.4-.5s-3.4,0-5.5.2c-2.1.1-4.3.3-6.6.3-2.3,0-4.6-.3-6.7-.5-2.2-.2-4.2-.4-6.1-.5s-3.8-.3-6-.2h0Z" style="fill: #a05b1b; fill-rule: evenodd;"/>
  <path d="M237,196.4c-3.3.5-7,1.1-11.2,1.2-4.2,0-8.9-.6-12.2-.8-2.2-.2-6.6-.5-9.6-.5v4.1c3-.2,5.9-.5,8.2-.6,2.2-.2,3.8-.2,6.3-.1,2.5.1,6,.4,9.9.6,3.9.2,8.4.2,11.8,0,3.4-.2,5.8-.7,8.4-.5,2.5.1,5.2.8,7.9,1.3,2.7.4,5.5.5,8.9.4,3.4-.1,7.4-.5,10.4-.4,3,.2,4.9.9,7.9,1.2,3,.3,7.3.3,10-.3,2.6-.6,4-1.5,6.3-1.5v-4c-3.8,0-7.6,2.3-12.6,1.5-1.7-.3-3.5-1.1-5.5-1.3s-4.2.2-6.4,0c-2.1-.1-4.2-.7-7.1-1.2-2.9-.4-6.5-.6-10.3-.6-3.9,0-7.9.3-11.4.6-3.5.3-6.4.6-9.6,1.1h0Z" style="fill: #59882f; fill-rule: evenodd;"/>
  <path d="M275.7,169.1c.7.3,1.8.3,3.2.2,1.5-.1,3.3-.4,3.5-1,.2-.6-1.1-1.6-2.7-1.8-1.6-.2-3.5.4-4.3,1-.8.6-.5,1.3.2,1.6Z" style="fill: #78cae1; fill-rule: evenodd;"/>
  <path d="M272.2,156c5.6-.3,14.9-1.1,17.3-2.4,2.4-1.3-2-3-11-3.1-9,0-22.6,1.6-31.4,2.6-8.8,1-12.9,1.2-15.2,1.8-2.3.6-2.8,1.6.6,1.8,3.4.2,10.7-.4,16.4-.7,5.7-.3,9.7-.3,12.7-.2,3,.1,5,.4,10.6,0h0Z" style="fill: #78cae1; fill-rule: evenodd;"/>
  <path d="M226,138.5c3.3.7,7.1.8,10.4.3,3.3-.5,6.2-1.6,6.2-2.4s-2.8-1.3-7.5-1.5-11.2-.1-13.1.6c-1.9.8.7,2.2,4,2.9h0Z" style="fill: #78cae1; fill-rule: evenodd;"/>
  <path d="M223.1,178c10.8-.1,16.5-.2,18.8-1,2.4-.8-1.1-2.2-5.5-2.8-4.3-.6-9.5-.3-15.1-.2-14.5.3-9,4.2,1.7,4h0Z" style="fill: #78cae1; fill-rule: evenodd;"/>
  <path d="M248.5,122.3c8.7,0,17.6,5.2,24.5,4.5,6.9-.8,12.1-2.1,13-3.3,1-1.2-2.3-2.2-9-2.1s-17-3.1-26-3.9c-8.1-.7-42.6,4.4-2.6,4.8h0Z" style="fill: #78cae1; fill-rule: evenodd;"/>
  <path d="M53.4,116.7c5.1-.2,12.3-.3,17.7.4,9.8,1.4,12.6,2.5,23.6,3.5.7,0,1.1,0,1.2.1h0c0,0-.1,0,0,0v-13.9c-2.6,0-3.9-1-6.2-1s-2.6.2-4.1.4c-1.5.2-3.3.3-5.7.5-2.4.2-5.5.6-8.6.8-3.1.2-6.2.2-8.8,0-2.6-.1-4.7-.3-7.2-.5-2.4-.1-5.2-.2-7.8-.1-2.6,0-5.2.3-7.4.4-2.2,0-4,0-6-.2-1.9-.1-4-.3-6.1-.5-2.2-.2-4.5-.5-6.7-.5-2.3,0-4.5.1-6.6.3-2.1.1-3.9.2-5.5.2s-2.9-.5-4.4-.5c-1.5,0-2.4.7-4.9.7v13.9c7,.2,28.3-3.2,39.2-3.5,5.9-.2,9-.3,14.1-.5h0Z" style="fill: #54bbde; fill-rule: evenodd;"/>
  <path d="M40.3,107.3c2.2,0,4.7-.3,7.4-.4,2.6,0,5.4,0,7.8.1,2.4.1,4.6.4,7.2.5,2.6.1,5.7.1,8.8,0,3.1-.2,6.2-.6,8.6-.8,2.4-.3,4.2-.4,5.7-.5,1.5-.2,2.8-.4,4.1-.4,2.2,0,3.5,1,6.2,1v-3c-3,0-7.4-.4-9.6-.5-3.3-.2-8-.9-12.2-.8-4.2,0-7.9.7-11.2,1.2-3.3.5-6.2.8-9.6,1.1s-7.6.6-11.4.6c-3.9,0-7.5-.2-10.3-.6-2.9-.4-4.9-1-7.1-1.2-2.1-.1-4.4.2-6.4,0s-3.8-1-5.5-1.3C7.6,101.5,3.8,103.8,0,103.8v3c2.6,0,3.4-.7,4.9-.7,1.5,0,2.9.5,4.4.5s3.4,0,5.5-.2c2.1-.1,4.3-.3,6.6-.3,2.3,0,4.6.3,6.7.5,2.2.2,4.2.4,6.1.5,1.9.1,3.8.3,6,.2h0Z" style="fill: #a05b1b; fill-rule: evenodd;"/>
  <path d="M63,103.6c3.3-.5,7-1.1,11.2-1.2,4.2,0,8.9.6,12.2.8,2.2.2,6.6.5,9.6.5v-4.1c-3,.2-5.9.5-8.2.6-2.2.2-3.8.2-6.3.1-2.5-.1-6-.4-9.9-.6-3.9-.2-8.4-.2-11.8,0-3.4.2-5.8.7-8.4.5-2.5-.1-5.2-.8-7.9-1.3-2.7-.4-5.5-.5-8.9-.4-3.4.1-7.4.5-10.4.4-3-.2-4.9-.9-7.9-1.2-3-.3-7.3-.3-10,.3S2.3,99.8,0,99.8v4c3.8,0,7.6-2.3,12.6-1.5,1.7.3,3.5,1.1,5.5,1.3s4.2-.2,6.4,0c2.1.1,4.2.7,7.1,1.2,2.9.4,6.5.6,10.3.6,3.9,0,7.9-.3,11.4-.6s6.4-.6,9.6-1.1h0Z" style="fill: #59882f; fill-rule: evenodd;"/>
  <path d="M0,150v29.3c.1,0,.5,0,1.2.1,11.1,1,13.8,2.1,23.6,3.5,5.4.7,12.5.6,17.7.4,5.1-.2,8.2-.3,14.1-.5,10.9-.3,32.3-3.7,39.2-3.5v-58.7c-.1,0-.5,0-1.2-.1-11.1-1-13.8-2.1-23.6-3.5-5.4-.7-12.5-.6-17.7-.4-5.1.2-8.2.3-14.1.5C28.3,117.5,7,120.9,0,120.7v29.3h0Z" style="fill: #45aed6; fill-rule: evenodd;"/>
  <path d="M42.5,183.3c-5.1.2-12.3.3-17.7-.4-9.8-1.4-12.6-2.5-23.6-3.5-.7,0-1.1,0-1.2-.1H0c0,0,.1,0,0,0v13.9c2.6,0,3.9,1,6.2,1s2.6-.2,4.1-.4c1.5-.2,3.2-.3,5.7-.5,2.4-.2,5.5-.6,8.6-.8,3.1-.2,6.2-.2,8.8,0,2.6.1,4.7.3,7.2.5,2.4.1,5.2.2,7.8.1,2.6,0,5.2-.3,7.4-.4s4,0,6,.2c1.9.1,4,.3,6.1.5,2.2.2,4.5.5,6.7.5s4.5-.1,6.6-.3c2.1-.1,3.9-.2,5.5-.2s2.9.5,4.4.5c1.5,0,2.4-.7,4.9-.7v-13.9c-7-.2-28.3,3.2-39.2,3.5-5.9.2-9,.3-14.1.5h0Z" style="fill: #54bbde; fill-rule: evenodd;"/>
  <path d="M55.6,192.7c-2.2,0-4.7.3-7.4.4-2.6,0-5.4,0-7.8-.1-2.4-.1-4.6-.4-7.2-.5-2.6-.1-5.7-.1-8.8,0-3.1.2-6.2.6-8.6.8-2.4.3-4.2.4-5.7.5-1.5.2-2.8.4-4.1.4-2.2,0-3.5-1-6.2-1v3c3,0,7.4.4,9.6.5,3.3.2,8,.9,12.2.8,4.2,0,7.9-.7,11.2-1.2,3.3-.5,6.2-.8,9.6-1.1,3.5-.3,7.6-.6,11.4-.6,3.9,0,7.5.2,10.3.6,2.9.4,4.9,1,7.1,1.2,2.1.1,4.4-.2,6.4,0,2,.2,3.8,1,5.5,1.3,5,.8,8.8-1.5,12.6-1.5v-3c-2.6,0-3.4.7-4.9.7-1.5,0-2.9-.5-4.4-.5s-3.4,0-5.5.2c-2.1.1-4.3.3-6.6.3s-4.6-.3-6.7-.5c-2.2-.2-4.2-.4-6.1-.5-1.9-.1-3.8-.3-6-.2h0Z" style="fill: #a05b1b; fill-rule: evenodd;"/>
  <path d="M33,196.4c-3.3.5-7,1.1-11.2,1.2-4.2,0-8.9-.6-12.2-.8-2.2-.2-6.6-.5-9.6-.5v4.1c3-.2,5.9-.5,8.2-.6,2.2-.2,3.8-.2,6.3-.1,2.5.1,6,.4,9.9.6,3.9.2,8.4.2,11.8,0,3.4-.2,5.8-.7,8.4-.5,2.5.1,5.2.8,7.9,1.3,2.7.4,5.5.5,8.9.4,3.4-.1,7.4-.5,10.4-.4s4.9.9,7.9,1.2c3,.3,7.3.3,10-.3,2.6-.6,4-1.5,6.3-1.5v-4c-3.8,0-7.6,2.3-12.6,1.5-1.7-.3-3.5-1.1-5.5-1.3-2-.2-4.2.2-6.4,0-2.1-.1-4.2-.7-7.1-1.2s-6.5-.6-10.3-.6c-3.9,0-7.9.3-11.4.6-3.5.3-6.4.6-9.6,1.1h0Z" style="fill: #59882f; fill-rule: evenodd;"/>
  <path d="M71.6,169.1c.7.3,1.8.3,3.3.2,1.5-.1,3.3-.4,3.5-1s-1.1-1.6-2.7-1.8c-1.6-.2-3.5.4-4.3,1s-.5,1.3.2,1.6Z" style="fill: #78cae1; fill-rule: evenodd;"/>
  <path d="M68.1,156c5.6-.3,14.9-1.1,17.3-2.4,2.4-1.3-2-3-11-3.1-9,0-22.6,1.6-31.4,2.6-8.8,1-12.9,1.2-15.2,1.8s-2.8,1.6.6,1.8c3.4.2,10.8-.4,16.4-.7,5.7-.3,9.7-.3,12.7-.2,3,.1,5,.4,10.6,0h0Z" style="fill: #78cae1; fill-rule: evenodd;"/>
  <path d="M21.9,138.5c3.3.7,7.1.8,10.4.3,3.3-.5,6.2-1.6,6.2-2.4s-2.8-1.3-7.5-1.5c-4.7-.2-11.2-.1-13.1.6-1.9.8.7,2.2,4,2.9Z" style="fill: #78cae1; fill-rule: evenodd;"/>
  <path d="M19,178c10.8-.1,16.5-.2,18.8-1,2.4-.8-1.1-2.2-5.5-2.8-4.3-.6-9.5-.3-15.1-.2-14.5.3-9,4.2,1.7,4Z" style="fill: #78cae1; fill-rule: evenodd;"/>
  <path d="M44.4,122.3c8.7,0,17.6,5.2,24.5,4.5,6.9-.8,12.1-2.1,13-3.3,1-1.2-2.3-2.2-9-2.1-6.7,0-17-3.1-26-3.9-8.1-.7-42.6,4.4-2.6,4.8Z" style="fill: #78cae1; fill-rule: evenodd;"/>
  <rect x="201.3" y="202.6" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <polygon points="206.9 144.9 201.3 144.9 201.3 150 201.3 155.1 206.9 155.1 206.9 150 206.9 144.9" style="fill: #9a9999; fill-rule: evenodd;"/>
  <rect x="201.3" y="173.7" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="201.3" y="116" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="147.9" y="114.8" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="163.9" width="4" height="25" style="fill: #fff;"/>
  <rect x="93.1" y="202.6" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <polygon points="93.1 155.1 98.7 155.1 98.7 150 98.7 144.9 93.1 144.9 93.1 150 93.1 155.1" style="fill: #9a9999; fill-rule: evenodd;"/>
  <rect x="93.1" y="116" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <rect x="93.1" y="173.7" width="5.6" height="10.2" style="fill: #9a9999;"/>
  <circle id="conn" cx="150" cy="2" r="2" style="fill: #fff; fill-opacity: 0;"/>
  <circle id="conn-2" cx="150" cy="298" r="2" style="fill: #fff; fill-opacity: 0;"/>
</svg>
`,

  infra_brueckenfahrbahn_bab: `
<svg id="infra_brueckenfahrbahn_bab" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 300 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M300,50H0v200h300V50" style="fill: #515151; fill-rule: evenodd;"/>
  <path d="M0,245v3h300v-3H0Z" style="fill: #e6e6e6; fill-rule: evenodd;"/>
  <path d="M300,52H0v3h300" style="fill: #e6e6e6; fill-rule: evenodd;"/>
  <rect x="29.2" y="149.9" width="8.3" height="7.5" style="fill: #e6e6e6;"/>
  <g>
    <rect y="151.7" width="29.2" height="1.3" style="fill: #ccc;"/>
    <rect y="154.2" width="29.2" height="1.3" style="fill: #ccc;"/>
  </g>
  <rect x="66.7" y="149.9" width="8.3" height="7.5" style="fill: #e6e6e6;"/>
  <g>
    <rect x="37.5" y="151.7" width="29.2" height="1.3" style="fill: #ccc;"/>
    <rect x="37.5" y="154.2" width="29.2" height="1.3" style="fill: #ccc;"/>
  </g>
  <rect x="104.2" y="149.9" width="8.3" height="7.5" style="fill: #e6e6e6;"/>
  <g>
    <rect x="75" y="151.7" width="29.2" height="1.3" style="fill: #ccc;"/>
    <rect x="75" y="154.2" width="29.2" height="1.3" style="fill: #ccc;"/>
  </g>
  <rect x="141.7" y="149.9" width="8.3" height="7.5" style="fill: #e6e6e6;"/>
  <g>
    <rect x="112.5" y="151.7" width="29.2" height="1.3" style="fill: #ccc;"/>
    <rect x="112.5" y="154.2" width="29.2" height="1.3" style="fill: #ccc;"/>
  </g>
  <rect x="179.2" y="149.9" width="8.3" height="7.5" style="fill: #e6e6e6;"/>
  <g>
    <rect x="150" y="151.7" width="29.2" height="1.3" style="fill: #ccc;"/>
    <rect x="150" y="154.2" width="29.2" height="1.3" style="fill: #ccc;"/>
  </g>
  <rect x="216.7" y="149.9" width="8.3" height="7.5" style="fill: #e6e6e6;"/>
  <g>
    <rect x="187.5" y="151.7" width="29.2" height="1.3" style="fill: #ccc;"/>
    <rect x="187.5" y="154.2" width="29.2" height="1.3" style="fill: #ccc;"/>
  </g>
  <rect x="254.2" y="149.9" width="8.3" height="7.5" style="fill: #e6e6e6;"/>
  <g>
    <rect x="225" y="151.7" width="29.2" height="1.3" style="fill: #ccc;"/>
    <rect x="225" y="154.2" width="29.2" height="1.3" style="fill: #ccc;"/>
  </g>
  <rect x="291.7" y="149.9" width="8.3" height="7.5" style="fill: #e6e6e6;"/>
  <g>
    <rect x="262.5" y="151.7" width="29.2" height="1.3" style="fill: #ccc;"/>
    <rect x="262.5" y="154.2" width="29.2" height="1.3" style="fill: #ccc;"/>
  </g>
  <g>
    <rect x="60.2" y="98.1" width="25" height="4" style="fill: #fff;"/>
    <rect x="11.1" y="98.1" width="25" height="4" style="fill: #fff;"/>
    <rect x="160.2" y="98.1" width="25" height="4" style="fill: #fff;"/>
    <rect x="111.1" y="98.1" width="25" height="4" style="fill: #fff;"/>
    <rect x="260.2" y="98.1" width="25" height="4" style="fill: #fff;"/>
    <rect x="211.1" y="98.1" width="25" height="4" style="fill: #fff;"/>
  </g>
  <g>
    <rect x="60.2" y="198.1" width="25" height="4" style="fill: #fff;"/>
    <rect x="11.1" y="198.1" width="25" height="4" style="fill: #fff;"/>
    <rect x="160.2" y="198.1" width="25" height="4" style="fill: #fff;"/>
    <rect x="111.1" y="198.1" width="25" height="4" style="fill: #fff;"/>
    <rect x="260.2" y="198.1" width="25" height="4" style="fill: #fff;"/>
    <rect x="211.1" y="198.1" width="25" height="4" style="fill: #fff;"/>
  </g>
  <circle cx="204.1" cy="31.6" r="13" transform="translate(47.3 165.9) rotate(-49.4)" style="fill: gray;"/>
  <circle cx="204.1" cy="268.4" r="13" transform="translate(-106.3 400.3) rotate(-75.8)" style="fill: gray;"/>
  <polygon points="200 10.8 204.1 22.9 204.1 150 204.1 277.1 200 289.2 200 150 200 10.8" style="fill: #b3b3b3; fill-rule: evenodd;"/>
  <rect x="201.3" y="58.3" width="5.6" height="10.2" style="fill: #999;"/>
  <rect x="201.3" y="87.2" width="5.6" height="10.2" style="fill: #999;"/>
  <rect x="201.3" y="231.5" width="5.6" height="10.2" style="fill: #999;"/>
  <circle cx="95.9" cy="268.4" r="13" style="fill: gray;"/>
  <circle cx="95.9" cy="31.6" r="13" style="fill: gray;"/>
  <path d="M200,300h-100V0h100v300Z" style="fill: #515151; fill-rule: evenodd;"/>
  <path d="M105,300h-3V0h3v300Z" style="fill: #e6e6e6; fill-rule: evenodd;"/>
  <path d="M198,300h-3V0h3v300Z" style="fill: #e6e6e6; fill-rule: evenodd;"/>
  <rect x="147.9" y="214.8" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="263.9" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="14.8" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="63.9" width="4" height="25" style="fill: #fff;"/>
  <polygon points="100 289.2 95.9 277.1 95.9 150 95.9 22.9 100 10.8 100 150 100 289.2" style="fill: #b3b3b3; fill-rule: evenodd;"/>
  <rect x="93.1" y="231.5" width="5.6" height="10.2" style="fill: #999;"/>
  <rect x="93.1" y="58.3" width="5.6" height="10.2" style="fill: #999;"/>
  <rect x="93.1" y="87.2" width="5.6" height="10.2" style="fill: #999;"/>
  <rect x="201.3" y="202.6" width="5.6" height="10.2" style="fill: #999;"/>
  <polygon points="206.9 144.9 201.3 144.9 201.3 150 201.3 155.1 206.9 155.1 206.9 150 206.9 144.9" style="fill: #999; fill-rule: evenodd;"/>
  <rect x="201.3" y="173.7" width="5.6" height="10.2" style="fill: #999;"/>
  <rect x="201.3" y="116" width="5.6" height="10.2" style="fill: #999;"/>
  <rect x="147.9" y="114.8" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="163.9" width="4" height="25" style="fill: #fff;"/>
  <rect x="93.1" y="202.6" width="5.6" height="10.2" style="fill: #999;"/>
  <polygon points="93.1 155.1 98.7 155.1 98.7 150 98.7 144.9 93.1 144.9 93.1 150 93.1 155.1" style="fill: #999; fill-rule: evenodd;"/>
  <rect x="93.1" y="116" width="5.6" height="10.2" style="fill: #999;"/>
  <rect x="93.1" y="173.7" width="5.6" height="10.2" style="fill: #999;"/>
  <rect x="201.3" y="26.5" width="5.6" height="10.2" style="fill: #999;"/>
  <rect x="93.1" y="26.5" width="5.6" height="10.2" style="fill: #999;"/>
  <rect x="201.3" y="263.3" width="5.6" height="10.2" style="fill: #999;"/>
  <rect x="93.1" y="263.3" width="5.6" height="10.2" style="fill: #999;"/>
  <rect id="conn" x="148" width="4" height="4" style="fill: #fff; opacity: 0;"/>
  <rect id="conn1" data-name="conn" x="148" y="296" width="4" height="4" style="fill: #fff; opacity: 0;"/>
</svg>
`,

// Mehrspurige Straßen

  infra_mehrspurig_kurz: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 200 100">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <rect width="100" height="100" style="fill: #525252;"/>
  <rect x="2" width="3" height="100" style="fill: #e7e6e6;"/>
  <rect x="95" width="3" height="100" style="fill: #e7e6e6;"/>
  <rect x="48" y="62.1" width="4" height="25" style="fill: #fff;"/>
  <rect x="48" y="13" width="4" height="25" style="fill: #fff;"/>
  <rect id="conn-bottom" x="98" y="96" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
  <rect id="conn-top" x="98" width="4" height="4" style="fill: #e52320; fill-opacity: 0;"/>
  <rect x="100" width="100" height="100" style="fill: #525252;"/>
  <rect x="102" width="3" height="100" style="fill: #e7e6e6;"/>
  <rect x="195" width="3" height="100" style="fill: #e7e6e6;"/>
  <rect x="148" y="62.1" width="4" height="25" style="fill: #fff;"/>
  <rect x="148" y="13" width="4" height="25" style="fill: #fff;"/>
</svg>
`,

  infra_mehrspurig_lang: `
<svg id="infra_mehrspurig_lang" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 200 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,300h100V0H0v300Z" style="fill: #525252; fill-rule: evenodd;"/>
  <path d="M95,300h3V0h-3v300h0ZM5,0h-3v300h3V0Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <rect x="48" y="213" width="4" height="25" style="fill: #fff;"/>
  <rect x="48" y="262" width="4" height="25" style="fill: #fff;"/>
  <rect x="48" y="113" width="4" height="25" style="fill: #fff;"/>
  <rect x="48" y="162" width="4" height="25" style="fill: #fff;"/>
  <rect x="48" y="13" width="4" height="25" style="fill: #fff;"/>
  <rect x="48" y="62.1" width="4" height="25" style="fill: #fff;"/>
  <rect id="conn-top" x="98" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
  <rect id="conn-botom" x="98" y="296" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
  <path d="M100,300h100V0h-100v300Z" style="fill: #525252; fill-rule: evenodd;"/>
  <path d="M195,300h3V0h-3v300h0ZM105,0h-3v300h3V0Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <rect x="148" y="213" width="4" height="25" style="fill: #fff;"/>
  <rect x="148" y="262" width="4" height="25" style="fill: #fff;"/>
  <rect x="148" y="113" width="4" height="25" style="fill: #fff;"/>
  <rect x="148" y="162" width="4" height="25" style="fill: #fff;"/>
  <rect x="148" y="13" width="4" height="25" style="fill: #fff;"/>
  <rect x="148" y="62.1" width="4" height="25" style="fill: #fff;"/>
</svg>
`,

  infra_mehrspurig_lang_3: `
<svg id="infra_mehrspurig_lang_3" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 275 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,0h2c0,100,0,200,0,300H0V0Z" style="fill: #525252;"/>
  <path d="M2,0h3c0,100,0,200,0,300h-3c0-100,0-200,0-300Z" style="fill: #f4f4f4;"/>
  <path d="M5,0h127.6c0,100,0,200,0,300H5c0-100,0-200,0-300Z" style="fill: #525252;"/>
  <path d="M132.6,0h2.8c0,.8,0,1.7,0,2.5v297.5h-2.7c0-100,0-200,0-300Z" style="fill: #f4f4f4;"/>
  <path d="M135.4,0h4c0,100,0,200,0,300h-4.1V2.5c0-.8,0-1.7,0-2.5Z" style="fill: #525252;"/>
  <path d="M139.4,0h3c0,100,0,200,0,300h-3c0-100,0-200,0-300Z" style="fill: #f4f4f4;"/>
  <path d="M142.4,0h127.6c0,100,0,200,0,300h-127.6c0-100,0-200,0-300Z" style="fill: #525252;"/>
  <path d="M270,0h3c0,100,0,200,0,300h-3c0-100,0-200,0-300Z" style="fill: #f4f4f4;"/>
  <path d="M273,0h2v300h-2c0-100,0-200,0-300Z" style="fill: #525252;"/>
  <path d="M42.8,12.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M85.7,12.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M185.2,12.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M228.1,12.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M42.8,62c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M89.8,62v25.1c-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1,1.4,0,2.7,0,4.1,0Z" style="fill: #f4f4f4;"/>
  <path d="M185.2,62.1c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M228.1,62.1c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M42.8,113c1.4,0,2.7,0,4.1,0,0,8.4,0,16.8,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M85.7,113c1.4,0,2.7,0,4.1,0,0,8.4,0,16.8,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M185.2,113c1.4,0,2.7,0,4.1,0,0,8.4,0,16.8,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M228.1,113c1.4,0,2.7,0,4.1,0,0,8.4,0,16.8,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M42.8,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.8,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M85.7,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.8,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M185.3,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.8,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M228.1,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.8,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M42.8,212.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M85.7,212.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M185.2,212.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0v-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M228.1,212.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M42.8,261.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M85.7,261.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M185.2,261.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M228.1,261.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f4f4f4;"/>
</svg>
`,

  infra_mehrspurig_lang_4: `
<svg id="infra_mehrspurig_lang_4" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 350 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,0h2v300H0V0Z" style="fill: #525252;"/>
  <path d="M2,0h3c0,100,0,200,0,300h-3V0Z" style="fill: #f6f6f6;"/>
  <path d="M5.1,0h165c0,1.4,0,2.7,0,4.1v295.9H5.1c0-100,0-200,0-300Z" style="fill: #525252;"/>
  <path d="M170.1,0h2.6c-.3.8-.1,1.7-.1,2.5v297.5h-2.5V4.1c0-1.4,0-2.7,0-4.1Z" style="fill: #f6f6f6;"/>
  <path d="M172.7,0h3.9c0,100,0,200,0,300h-4.1V2.5c0-.8-.1-1.7.1-2.5Z" style="fill: #525252;"/>
  <path d="M176.6,0h3.1c0,100,0,200,0,300h-3.1c0-100,0-200,0-300Z" style="fill: #f6f6f6;"/>
  <path d="M179.7,0h165.2c0,100,0,200,0,300h-165.2c0-100,0-200,0-300Z" style="fill: #525252;"/>
  <path d="M344.9,0h3v300h-3c0-100,0-200,0-300Z" style="fill: #f6f6f6;"/>
  <path d="M348,0h2v300h-2V0Z" style="fill: #525252;"/>
  <path d="M41.4,13c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.3,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M79.4,12.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M122.8,13c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.3,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M223.1,12.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M266.4,13c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.3,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M304.5,12.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M41.4,62c1.4,0,2.8,0,4.1,0,0,8.4,0,16.8,0,25.1-1.4,0-2.8,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M79.4,62c1.4,0,2.7,0,4.1,0,0,8.4,0,16.8,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M122.8,61.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.8,0,25.1-1.2,0-3,.1-4.1-.1,0-7.6,0-15.4,0-23,0-.7,0-1.4,0-2Z" style="fill: #f6f6f6;"/>
  <path d="M223.1,62.1c1.4,0,2.7,0,4.1,0,0,8.3,0,16.7,0,25-1.4,0-2.8,0-4.1,0,0-8.3,0-16.7,0-25Z" style="fill: #f6f6f6;"/>
  <path d="M266.4,62.1c1.4,0,2.7,0,4.1,0,0,8.3,0,16.7,0,25-1.4,0-2.8,0-4.1,0,0-8.3,0-16.7,0-25Z" style="fill: #f6f6f6;"/>
  <path d="M304.5,62.1c1.4,0,2.7,0,4.1,0,0,8.3,0,16.7,0,25-1.4,0-2.8,0-4.1,0,0-8.3,0-16.7,0-25Z" style="fill: #f6f6f6;"/>
  <path d="M41.4,113c1.4,0,2.8,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M79.4,113c1.4,0,2.8,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M122.8,113c1.4,0,2.8,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M223.1,113c1.4,0,2.8,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M266.4,113c1.4,0,2.8,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M304.5,113c1.4,0,2.8,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M41.4,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.8,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M79.4,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.8,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M122.8,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.8,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M223.1,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.8,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M266.4,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.8,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M304.5,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.8,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M41.4,212.9c1.4,0,2.8,0,4.1,0,0,8.3,0,16.7,0,25-1.4,0-2.7,0-4.1,0,0-8.3,0-16.7,0-25Z" style="fill: #f6f6f6;"/>
  <path d="M79.4,212.9c1.4,0,2.8,0,4.1,0,0,8.3,0,16.7,0,25-1.4,0-2.7,0-4.1,0,0-8.3,0-16.7,0-25Z" style="fill: #f6f6f6;"/>
  <path d="M122.8,212.9c1.4,0,2.8,0,4.1,0,0,8.3,0,16.7,0,25-1.4,0-2.7,0-4.1,0,0-8.3,0-16.7,0-25Z" style="fill: #f6f6f6;"/>
  <path d="M223.1,212.9c1.2,0,3-.1,4.1.1,0,7.6,0,15.4,0,23,0,.7,0,1.4,0,2-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M266.4,212.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.8,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M304.5,212.9c1.4,0,2.8,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.8,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M41.4,262c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.3,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M79.5,262c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M122.8,262c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.3,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M223.1,262c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M266.4,262c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.3,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M304.5,262c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
</svg>
`,

  infra_mehrspurig_lang_3_eine_richtung: `
<svg id="infra_mehrspurig_lang_3_eine_richtung" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 139.7 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M.1,0h4v300H0V0h.1Z" style="fill: #525252;"/>
  <path d="M4.1,0h3v300h-3V0Z" style="fill: #f4f4f4;"/>
  <path d="M7.1,0h127.6v300H7.1V0Z" style="fill: #525252;"/>
  <path d="M134.7,0h3v300h-3V0Z" style="fill: #f4f4f4;"/>
  <path d="M137.7,0h2v300h-2V0Z" style="fill: #525252;"/>
  <path d="M49.9,12.9h4.1v25.1h-4.1V12.9Z" style="fill: #f4f4f4;"/>
  <path d="M92.8,12.9h4.1v25.1h-4.1V12.9Z" style="fill: #f4f4f4;"/>
  <path d="M49.9,62.1h4.1v25.1h-4.1v-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M92.8,62.1h4.1v25.1h-4.1v-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M49.9,113h4.1v25.1h-4.1v-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M92.8,113h4.1v25.1h-4.1v-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M50,161.9h4.1v25.1h-4.1v-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M92.8,161.9h4.1v25.1h-4.1v-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M49.9,212.9h4.1v25.1h-4.1v-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M92.8,212.9h4.1v25.1h-4.1v-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M49.9,261.9h4.1v25.1h-4.1v-25.1Z" style="fill: #f4f4f4;"/>
  <path d="M92.8,261.9h4.1v25.1h-4.1v-25.1Z" style="fill: #f4f4f4;"/>
</svg>
`,

  infra_mehrspurig_lang_4_eine_richtung: `
<svg id="infra_mehrspurig_lang_4_eine_richtung" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 177.5 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M.2,0h3.9c0,100,0,200,0,300H0V2.5C0,1.7-.1.8.2,0Z" style="fill: #525252;"/>
  <path d="M4.1,0h3.1c0,100,0,200,0,300h-3.1c0-100,0-200,0-300Z" style="fill: #f6f6f6;"/>
  <path d="M7.2,0h165.2c0,100,0,200,0,300H7.2c0-100,0-200,0-300Z" style="fill: #525252;"/>
  <path d="M172.4,0h3v300h-3c0-100,0-200,0-300Z" style="fill: #f6f6f6;"/>
  <path d="M175.4,0h2v300h-2V0Z" style="fill: #525252;"/>
  <path d="M50.5,12.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M93.9,13c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.3,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M131.9,12.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M50.5,62.1c1.4,0,2.7,0,4.1,0,0,8.3,0,16.7,0,25-1.4,0-2.8,0-4.1,0,0-8.3,0-16.7,0-25Z" style="fill: #f6f6f6;"/>
  <path d="M93.9,62.1c1.4,0,2.7,0,4.1,0,0,8.3,0,16.7,0,25-1.4,0-2.8,0-4.1,0,0-8.3,0-16.7,0-25Z" style="fill: #f6f6f6;"/>
  <path d="M131.9,62.1c1.4,0,2.7,0,4.1,0,0,8.3,0,16.7,0,25-1.4,0-2.8,0-4.1,0,0-8.3,0-16.7,0-25Z" style="fill: #f6f6f6;"/>
  <path d="M50.5,113c1.4,0,2.8,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M93.9,113c1.4,0,2.8,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M131.9,113c1.4,0,2.8,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M50.5,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.8,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M93.9,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.8,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M131.9,161.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.8,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M50.5,212.9c1.2,0,3-.1,4.1.1,0,7.6,0,15.4,0,23,0,.7,0,1.4,0,2-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M93.9,212.9c1.4,0,2.7,0,4.1,0,0,8.4,0,16.8,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M131.9,212.9c1.4,0,2.8,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.8,0-4.1,0,0-8.4,0-16.8,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M50.6,262c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M93.9,262c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.3,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
  <path d="M131.9,262c1.4,0,2.7,0,4.1,0,0,8.4,0,16.7,0,25.1-1.4,0-2.7,0-4.1,0,0-8.4,0-16.7,0-25.1Z" style="fill: #f6f6f6;"/>
</svg>
`,

  infra_mehrspurig_kurve: `
<svg id="infra_mehrspurig_kurve" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 400 400">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M400,400C400,179.1,220.9,0,0,0v264.5c74.9,0,135.5,60.7,135.5,135.5h264.5Z" style="fill: #515151; fill-rule: evenodd;"/>
  <path d="M15,201.7c8.7.6,17.2,1.9,25.6,3.6l1.1-5.2c-8.6-1.8-17.4-3-26.3-3.7l-.4,5.3Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M67.6,207.3l-1.8,5c8.2,2.9,16.1,6.3,23.8,10.2l2.4-4.7c-7.9-4-16-7.5-24.4-10.4Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M112.2,235.8c7.1,4.9,13.9,10.2,20.4,16l3.5-3.9c-6.6-5.9-13.6-11.4-20.9-16.4l-3,4.4Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M150.8,270.4c5.6,6.5,10.8,13.4,15.6,20.7l4.4-2.9c-4.9-7.4-10.2-14.5-16-21.2l-4,3.4Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M179.3,313.8c3.7,7.7,7,15.7,9.7,24l5-1.7c-2.8-8.5-6.1-16.7-9.9-24.6l-4.8,2.3Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M200.6,362.2l-5.2,1c1.6,8.4,2.6,16.9,3.1,25.7l5.3-.3c-.5-9-1.6-17.8-3.2-26.4Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M34.7,70.7l.6-5.3c-6.4-.7-12.9-1.2-19.5-1.5l-.2,5.3c6.4.3,12.8.8,19.2,1.4Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M77.1,77.9l1.2-5.1c-6.2-1.5-12.4-2.8-18.6-3.9l-.9,5.2c6.2,1.1,12.3,2.4,18.3,3.8Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M120.6,85.9c-6.1-2.3-12.2-4.5-18.4-6.5l-1.6,5c6.1,2,12.2,4.1,18.2,6.4l1.9-4.9Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M160.4,104.2c-5.6-3-11.2-5.9-17-8.6l-2.3,4.8c5.7,2.7,11.2,5.5,16.7,8.5l2.5-4.7Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M197.8,127.9c-5.3-3.8-10.6-7.5-16.1-11l-2.9,4.5c5.4,3.5,10.7,7.1,15.9,10.9l3.1-4.3Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M231.4,155.9c-4.6-4.4-9.3-8.6-14.2-12.7l-3.4,4c4.8,4,9.4,8.2,14,12.5l3.6-3.8Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M261.5,188.3c-4.1-5.1-8.4-10-12.7-14.8l-3.9,3.6c4.3,4.7,8.5,9.6,12.5,14.6l4.1-3.3Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M286.8,224c-3.3-5.4-6.8-10.7-10.4-15.9l-4.3,3c3.6,5.1,7,10.4,10.3,15.7l4.5-2.8Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M307.4,263.2c-2.7-6-5.5-11.8-8.5-17.6l-4.7,2.4c2.9,5.7,5.7,11.5,8.3,17.3l4.8-2.2Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M322.6,304.2c-1.8-6.1-3.8-12.1-5.9-18.1l-5,1.8c2.1,5.9,4.1,11.8,5.8,17.8l5.1-1.5Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M332.3,347.4c-1-6.5-2.2-12.9-3.6-19.2l-5.2,1.1c1.4,6.2,2.5,12.5,3.5,18.9l5.2-.8Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M336.3,391c-.2-6.4-.5-12.7-1-19l-5.3.4c.5,6.2.9,12.4,1,18.7h5.3Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M142.1,400c0-78.5-63.6-142.1-142.1-142.1v4c76.3,0,138.2,61.9,138.2,138.2h4Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M0,6.6c217.3,0,393.4,176.1,393.4,393.4h4C397.4,180.5,219.5,2.6,0,2.6v4Z" style="fill: #fff; fill-rule: evenodd;"/>
  <path d="M0,139.5c21.6,0,42.6,2.6,62.6,7.6l.4-1.6c-20.2-5-41.3-7.6-63.1-7.6v1.7h0ZM265.4,395c-.4-20.3-3-40-7.7-59l-1.6.4c4.6,18.8,7.3,38.4,7.6,58.5h1.7ZM262.1,395h-1.7c-.4-19.8-3-39.2-7.5-57.7l1.6-.4c4.6,18.7,7.2,38.1,7.6,58.1h0ZM255.2,326.5c-5.6-19.3-13.2-37.7-22.8-54.9l-1.4.8c9.5,17.1,17.1,35.4,22.6,54.5l1.6-.4h0ZM252,327.3l-1.6.4c-5.4-18.9-13-36.9-22.3-53.7l1.4-.8c9.4,17,17,35.1,22.4,54.1h0ZM227.4,263c-10.3-17.1-22.5-32.9-36.2-47.2l-1.2,1.2c13.7,14.2,25.7,29.9,36,46.8l1.4-.8h0ZM224.6,264.6l-1.4.8c-10.1-16.7-22-32.2-35.4-46.1l1.2-1.2c13.6,14.1,25.5,29.7,35.7,46.5h0ZM184.2,208.8c-14.3-13.8-30.1-25.9-47.2-36.2l-.8,1.4c16.9,10.2,32.6,22.3,46.8,36l1.2-1.2h0ZM181.8,211.1l-1.2,1.2c-14-13.4-29.4-25.4-46.1-35.4l.8-1.4c16.8,10.2,32.4,22.2,46.5,35.7h0ZM128.4,167.6c-17.2-9.5-35.6-17.2-54.9-22.8l-.4,1.6c19.2,5.5,37.4,13.1,54.5,22.6l.8-1.4h0ZM126.8,170.5l-.8,1.4c-16.9-9.3-34.9-16.8-53.7-22.3l.4-1.6c19,5.5,37.2,13,54.1,22.4h0ZM63.9,142.3l-.4,1.6c-20.3-5-41.6-7.7-63.5-7.7v-1.7c22,0,43.5,2.7,63.9,7.7Z" style="fill: #ccc; fill-rule: evenodd;"/>
  <rect id="conn" x="0" y="134.5" width="1" height="5" style="fill: #ccc; opacity: 0;"/>
  <rect id="conn1" data-name="conn" x="262.4" y="397" width="1" height="5" transform="translate(662.4 136.6) rotate(90)" style="fill: #ccc; opacity: 0;"/>
</svg>
`,

infra_mehrspurig_2: `
<svg id="infra_mehrspurig_2" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 400 650">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,0h4.1c0,216.7,0,433.3,0,650H0V0Z" style="fill: #4a4b4d;"/>
  <path d="M4.1,0h7.4c-.1,2.3,0,4.6,0,6.9v643.1h-7.3c0-216.7,0-433.3,0-650Z" style="fill: #fff;"/>
  <path d="M11.5,0h158.9c0,216.7,0,433.3,0,650H11.4V6.9c0-2.3,0-4.6,0-6.9Z" style="fill: #4a4b4d;"/>
  <path d="M170.3,0h6.5c0,84.7,0,169.5,0,254.3,0,131.9,0,263.8,0,395.7h-6.5c0-216.7,0-433.3,0-650Z" style="fill: #fff;"/>
  <path d="M176.9,0h4c0,1.2-.1,2.3-.1,3.5,0,119.4,0,238.8,0,358.1,0,96.1,0,192.3,0,288.4h-3.9c0-131.9,0-263.8,0-395.7,0-84.8,0-169.5,0-254.3Z" style="fill: #4a4b4d;"/>
  <path d="M180.9,0h37.6c0,213,0,426.1,0,639.1,0,3.6,0,7.3,0,10.9h-37.7c0-96.1,0-192.3,0-288.4,0-119.4,0-238.8,0-358.1,0-1.2,0-2.3.1-3.5Z" style="fill: #56a039;"/>
  <path d="M218.5,0h3.9c0,216.7,0,433.3,0,650h-3.9c0-3.6,0-7.3,0-10.9,0-213,0-426.1,0-639.1Z" style="fill: #4a4b4d;"/>
  <path d="M222.4,0h6.8c0,216.7,0,433.3,0,650h-6.8c0-216.7,0-433.3,0-650Z" style="fill: #fff;"/>
  <path d="M229.2,0h158.3c.1,2.1,0,4.3,0,6.4,0,214.5,0,429,0,643.6h-158.4c0-216.7,0-433.3,0-650Z" style="fill: #4a4b4d;"/>
  <path d="M387.5,0h8.1c-.3,3.4-.1,6.9-.2,10.4v639.6h-7.9c0-214.5,0-429,0-643.6,0-2.1,0-4.3,0-6.4Z" style="fill: #fff;"/>
  <path d="M395.6,0h4.4v650h-4.6V10.4c0-3.5-.1-6.9.2-10.4Z" style="fill: #4a4b4d;"/>
  <path d="M88.5,34.8c2.1-.4,4.4-.1,6.6,0,.1,2.4.2,4.8.2,7.2-.1,12.3,0,24.7,0,37.1-2.4.2-4.7.2-7.1,0,0-13.5,0-27,0-40.6,0-1.2,0-2.5.5-3.7Z" style="fill: #fff;"/>
  <path d="M304.2,34.8c2.2-.4,4.5-.1,6.7,0,.3,5,0,10,.1,15.1,0,9.8,0,19.6,0,29.4-2.3,0-4.6,0-6.9,0-.3-4.4-.1-8.7-.2-13.1,0-9.1,0-18.1,0-27.2,0-1.4,0-2.9.3-4.2Z" style="fill: #fff;"/>
  <path d="M88.4,124.4c2.1-.5,4.6-.2,6.8,0,.3,9.7,0,19.3.1,29,0,5.1.1,10.1-.1,15.2-2.3.2-4.6.3-6.9,0-.3-4.6,0-9.2-.1-13.8,0-8.6,0-17.2,0-25.7,0-1.6,0-3.2.3-4.8Z" style="fill: #fff;"/>
  <path d="M304,124.1c2.4-.1,4.7-.1,7.1,0,.3,4.2.2,8.3.2,12.5,0,7.6,0,15.2,0,22.8,0,3.2,0,6.3-.2,9.5-2.4,0-4.7,0-7.1,0-.2-9.1,0-18.2,0-27.3,0-5.8-.1-11.6,0-17.4Z" style="fill: #fff;"/>
  <path d="M88.3,214c2.3-.2,4.6-.2,6.9.1,0,2.3,0,4.6,0,7,0,12.1,0,24.3-.1,36.4-2.3.3-4.5.4-6.8.1-.3-4.3-.2-8.5-.2-12.8,0-6.9,0-13.9,0-20.8,0-3.4,0-6.7.1-10.1Z" style="fill: #fff;"/>
  <path d="M304.3,214.1c2.1-.5,4.5-.2,6.7,0,.1,6.1,0,12.3,0,18.4,0,8.4.1,16.7,0,25.1-2.2,0-4.5,0-6.7,0-.2-4.6,0-9.1-.1-13.7,0-8.6,0-17.2,0-25.7,0-1.3,0-2.7.2-4Z" style="fill: #fff;"/>
  <path d="M88.2,302.5c2.1-.7,4.8-.4,7-.2.3,4.4.2,8.8.2,13.3,0,8.4,0,16.8,0,25.2,0,1.9,0,3.9-.2,5.8-2.4,0-4.8,0-7.2,0,0-12.6,0-25.3,0-37.9,0-2-.1-4.2.2-6.2Z" style="fill: #fff;"/>
  <path d="M304.4,302.6c2.1-.3,4.4-.1,6.5,0,.1,5.8,0,11.7,0,17.5,0,8.8,0,17.7,0,26.5-2.2,0-4.5,0-6.7,0-.2-4.6,0-9.1-.1-13.7,0-8.7,0-17.5,0-26.2,0-1.4,0-2.8.3-4.1Z" style="fill: #fff;"/>
  <path d="M88.5,391.9c2.1-.5,4.6-.2,6.7,0,.2,5.9,0,11.8,0,17.7,0,8.7.1,17.5,0,26.2-2.4.2-4.7.2-7.1,0-.1-13.2,0-26.4,0-39.6,0-1.4,0-3,.5-4.3Z" style="fill: #fff;"/>
  <path d="M304.2,391.9c2.1-.5,4.6-.2,6.8,0,0,2.6,0,5.2,0,7.8,0,12,.1,24.1,0,36.1-2.3.3-4.6.3-6.9.2-.2-4.5,0-9-.1-13.5,0-8.9,0-17.8,0-26.7,0-1.3,0-2.6.3-3.8Z" style="fill: #fff;"/>
  <path d="M88.5,482.4c2.1-.6,4.5-.3,6.7,0,.2,4.6,0,9.1,0,13.7.1,6.8,0,13.5,0,20.3,0,3.1,0,6.2-.3,9.4-2.2,0-4.4,0-6.6,0-.4-4.4-.2-8.8-.2-13.2,0-8.1,0-16.2,0-24.2,0-1.9,0-3.9.4-5.8Z" style="fill: #fff;"/>
  <path d="M303.9,482.4c2.3-.5,5-.2,7.3-.1.3,9.6,0,19.2.1,28.8,0,5,.2,10-.1,15-2.5.2-4.9.2-7.4,0-.1-13.4,0-26.8,0-40.2,0-1.1,0-2.3.2-3.4Z" style="fill: #fff;"/>
  <path d="M304.2,571.6c2.2-.3,4.5-.1,6.8,0,.1,5.9,0,11.7,0,17.6,0,8.8,0,17.6,0,26.3-2.3.2-4.7.2-7,0-.2-12.8,0-25.5-.1-38.3,0-1.8,0-3.8.3-5.6Z" style="fill: #fff;"/>
  <path d="M88.2,571.8c2.3-.1,4.7-.1,7,0,.1,4.6,0,9.2,0,13.9,0,9.9.1,19.8,0,29.7-2.3.2-4.6.2-7,0-.3-8.8,0-17.6-.1-26.4,0-5.8-.2-11.6,0-17.4Z" style="fill: #fff;"/>
  <rect id="conn" x="198" width="4" height="4" style="fill: #fff; opacity: 0;"/>
  <rect id="conn1" data-name="conn" x="198" y="646" width="4" height="4" style="fill: #fff; opacity: 0;"/>
</svg>
`,

  infra_mehrspurig_3: `
<svg id="infra_mehrspurig_3" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 900 1400">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,0h15.4c.2,15,0,30.1,0,45.1-.2,7-.5,13.9-.2,20.9.7,15.4,0,30.8.2,46.2-.5,15.4.2,30.8.1,46.2,0,10.6-.3,21.3,0,31.9-.6,27.1-.2,54.3-.3,81.4-.1,11.4.4,22.7.3,34.1.4,15.4-.9,30.8,0,46.2.6,11-.4,22,0,33,.4,10.3-.4,20.5-.2,30.8,0,8.8.4,17.6.3,26.4-.8,23.4,0,47,0,70.4-.3,11,.1,22-.2,33,.5,17.6,0,35.2.3,52.8,0,12.5-.6,25-.1,37.4.4,21.3-.3,42.6.3,63.8.2,8.8-.6,17.6-.5,26.4,0,8.8.6,17.6.2,26.4-.3,7.7.4,15.4.3,23.1-.5,26.4-.1,52.8-.3,79.2.2,16.9-.5,33.7.1,50.6-.3,13.9,0,27.9-.3,41.8.2,11.6.8,23.5.2,35.2-.8,19.1.6,38.1-.1,57.2-.4,15.4.6,30.8,0,46.2.4,12.1,0,24.2.3,36.3.2,26.8-.6,53.6-.3,80.3.5,8.8-.2,17.6,0,26.4.6,13.6-.6,27.1,0,40.7.6,13.6-.5,27.1,0,40.7.3,7.7-.2,15.4-.2,23.1-.1,10.7.6,21.3.3,31.9.1,11.4-.4,22.7-.3,34.1H0V0Z" style="fill: #4a4b4d;"/>
  <path d="M15.4,0h15.5c0,466.7,0,933.3,0,1400h-15.7c-.2-11.4.4-22.7.3-34.1.3-10.7-.4-21.3-.3-31.9,0-7.7.5-15.4.2-23.1-.6-13.6.6-27.1,0-40.7-.6-13.6.5-27.1,0-40.7-.2-8.8.5-17.6,0-26.4-.4-26.8.5-53.6.3-80.3-.3-12.1.1-24.2-.3-36.3.6-15.4-.4-30.8,0-46.2.7-19.1-.6-38.1.1-57.2.6-11.7,0-23.6-.2-35.2.2-13.9,0-27.9.3-41.8-.7-16.9,0-33.8-.1-50.6.2-26.4-.2-52.8.3-79.2.2-7.7-.6-15.4-.3-23.1.4-8.8-.3-17.6-.2-26.4-.1-8.8.7-17.6.5-26.4-.5-21.3.1-42.6-.3-63.8-.4-12.5.1-25,.1-37.4-.2-17.6.3-35.2-.3-52.8.3-11,0-22,.2-33,0-23.4-.7-47,0-70.4,0-8.8-.4-17.6-.3-26.4-.2-10.3.6-20.5.2-30.8-.4-11,.7-22,0-33-.8-15.4.5-30.8,0-46.2,0-11.4-.4-22.7-.3-34.1.1-27.1-.3-54.3.3-81.4-.2-10.6,0-21.3,0-31.9.1-15.4-.7-30.8-.1-46.2-.2-15.4.5-30.8-.2-46.2-.3-7,0-13.9.2-20.9,0-15,.1-30.1,0-45.1Z" style="fill: #fff;"/>
  <path d="M30.9,0h378.1c0,466.6,0,933.4,0,1400H30.9c0-466.7,0-933.3,0-1400Z" style="fill: #4a4b4d;"/>
  <path d="M409,0h15.1c0,466.7,0,933.3,0,1400h-15.1c0-466.6,0-933.4,0-1400Z" style="fill: #fff;"/>
  <path d="M424.1,0h53.9c-.1,466.7,0,933.3,0,1400h-53.8c0-466.7,0-933.3,0-1400Z" style="fill: #689936;"/>
  <path d="M478,0h15c0,466.7,0,933.3,0,1400h-15c0-466.7,0-933.3,0-1400Z" style="fill: #fff;"/>
  <path d="M493,0h378.8c.3,4.8.1,9.6.1,14.3,0,461.9,0,923.8,0,1385.7h-378.9c0-466.7,0-933.3,0-1400Z" style="fill: #4a4b4d;"/>
  <path d="M871.8,0h14.7c0,466.7,0,933.3,0,1400h-14.6c0-461.9,0-923.8,0-1385.7,0-4.8.1-9.6-.1-14.3Z" style="fill: #fff;"/>
  <path d="M886.5,0h13.5v1400h-13.5c0-466.7,0-933.3,0-1400Z" style="fill: #4a4b4d;"/>
  <path d="M140.5,40.7c5-.8,10.4-.4,15.4-.1,0,25.8,0,51.5,0,77.3-5.3.4-10.6.6-16,.2.5-8.9.9-17.8,1-26.7,0-16.9.3-33.8-.5-50.7Z" style="fill: #fff;"/>
  <path d="M280.2,40.9c4.6-1.1,9.9-.6,14.6-.5.3,12.2,0,24.4.1,36.6,0,13.7.2,27.3-.2,41-4.9.2-9.9.2-14.8,0-.1-23.5.1-47.1-.1-70.6,0-2.1,0-4.3.3-6.4Z" style="fill: #fff;"/>
  <path d="M607.5,40.8c4.9-1,10.3-.5,15.3-.3-.8,25.8-.8,51.7,0,77.6-5.2.2-10.4.2-15.6,0-.3-21.7,0-43.5-.2-65.2,0-4-.2-8.1.5-12Z" style="fill: #fff;"/>
  <path d="M745.3,40.8c5-1,10.5-.5,15.6-.4-.6,25.8,0,51.7-.2,77.5-5.2.2-10.4.2-15.6,0-.2-22.8,0-45.6-.2-68.5,0-2.9,0-5.8.4-8.7Z" style="fill: #fff;"/>
  <path d="M140.3,196c5-.9,10.5-.4,15.6-.3,0,25.7,0,51.5,0,77.2-5.3.2-10.6.2-15.9,0,1.5-19.9.8-39.5,1-59.4.1-5.8-.7-11.7-.7-17.5Z" style="fill: #fff;"/>
  <path d="M280.2,196.2c4.6-1.1,9.9-.6,14.6-.5.3,11.1,0,22.1.1,33.2,0,14.7.2,29.4-.1,44.1-4.9.1-9.9.1-14.8-.1-.1-23.5.1-47-.1-70.5,0-2.1,0-4.2.3-6.3Z" style="fill: #fff;"/>
  <path d="M607.5,196.1c5-.9,10.4-.5,15.4-.3,0,8.1-.6,16.3-.6,24.4.1,17.6-.3,35.3.4,52.9-5.2.2-10.4.2-15.6,0-.4-21.7,0-43.3-.2-65,0-3.9-.2-8.1.5-12Z" style="fill: #fff;"/>
  <path d="M745.6,196.2c4.8-1.1,10.1-.6,15-.5.2,12.5,0,25.1,0,37.6,0,13.2.2,26.5-.2,39.7-5.1.1-10.1.1-15.1,0,0-23.5.1-47,0-70.5,0-2.1,0-4.2.3-6.3Z" style="fill: #fff;"/>
  <path d="M140.3,351.3c5-1,10.5-.5,15.6-.3,0,25.7,0,51.5,0,77.2-5.3.2-10.6.2-15.9,0,1.3-20.2.9-40.3,1-60.5,0-5.5-.7-10.9-.7-16.4Z" style="fill: #fff;"/>
  <path d="M280.2,351.3c4.7-1,9.9-.5,14.6-.4.3,12.5,0,25.1.1,37.6,0,13.2.2,26.5-.1,39.7-4.9.1-9.9,0-14.8-.1-.1-23.5.1-47-.1-70.4,0-2.1,0-4.3.3-6.3Z" style="fill: #fff;"/>
  <path d="M607.5,351.2c5-.9,10.3-.4,15.4-.3-.8,25.8-.7,51.6,0,77.3-5.2.2-10.4.2-15.7,0-.3-22.4.1-44.8-.2-67.2,0-3.2,0-6.6.5-9.8Z" style="fill: #fff;"/>
  <path d="M745.3,351.3c5-1,10.4-.5,15.4-.4.3,15.9-.2,31.7,0,47.5,0,9.9.2,19.9,0,29.8-5.2.1-10.4.1-15.6,0-.2-22.8,0-45.5-.2-68.3,0-2.9,0-5.8.4-8.6Z" style="fill: #fff;"/>
  <path d="M140.4,507.4c5-.9,10.5-.4,15.6-.2,0,25.3.2,50.7,0,76.1-5.3.3-10.4.3-15.6,0,.2-5.3,0-10.6.3-15.9.9-13.7.3-27.5.5-41.2.2-6.2-.7-12.4-.6-18.7Z" style="fill: #fff;"/>
  <path d="M280.2,507.6c4.7-1.1,9.9-.6,14.6-.4.3,13.3,0,26.6.1,39.9,0,12.1.2,24.2-.2,36.3-4.9.2-9.8.2-14.8,0-.1-23.1.1-46.2-.1-69.4,0-2.1,0-4.3.3-6.4Z" style="fill: #fff;"/>
  <path d="M607.5,507.4c4.9-1,10.3-.5,15.3-.3-.6,25.4-.6,50.8,0,76.2-5.2.2-10.3.2-15.5,0-.4-20.9,0-41.8-.2-62.7,0-4.3-.2-8.9.5-13.2Z" style="fill: #fff;"/>
  <path d="M745.3,507.5c5-1,10.6-.5,15.7-.3-.2,25.3,0,50.7-.1,76-5.3.3-10.4.4-15.7,0-.4-22.3,0-44.7-.2-67.1,0-2.9,0-5.8.3-8.7Z" style="fill: #fff;"/>
  <path d="M140.3,661.7c5-1,10.5-.5,15.7-.3,0,25.6.1,51.2,0,76.7-5.3.2-10.5.4-15.8.4,1-19.8,1-39.6.8-59.5,0-5.8-.8-11.6-.6-17.4Z" style="fill: #fff;"/>
  <path d="M280.2,661.8c4.7-1,9.8-.6,14.6-.4.3,14.3,0,28.7.1,43,0,11.3.3,22.6-.2,34-4.9,0-9.8,0-14.7-.2-.2-23,.1-46-.2-69,0-2.4,0-4.9.4-7.4Z" style="fill: #fff;"/>
  <path d="M607.5,661.7c4.9-.9,10.2-.4,15.1-.3-.6,25.6-.1,51.2-.4,76.8-5,0-10,0-15,0-.5-20.8,0-41.6-.3-62.4,0-4.6-.3-9.5.5-14.1Z" style="fill: #fff;"/>
  <path d="M745.3,661.7c4.9-.9,10.2-.4,15.2-.3.3,9.9.3,19.9.3,29.8-.1,15.7.4,31.5-.3,47.2-5.1,0-10.3-.2-15.4-.3-.4-21.5,0-43.1-.2-64.6,0-3.9-.2-8,.4-11.9Z" style="fill: #fff;"/>
  <path d="M140.3,816.9c5-.9,10.5-.5,15.6-.3,0,26.1,0,52.2,0,78.3-5.4.2-10.7.2-16,0,1.8-18.6.8-37.3,1.1-56.1.2-7.3-.7-14.6-.7-21.8Z" style="fill: #fff;"/>
  <path d="M280.2,817c4.7-1,9.9-.6,14.6-.4.3,12.5,0,25,.1,37.5,0,13.6.2,27.2-.1,40.8-4.9.1-9.9,0-14.8-.1-.1-23.9.1-47.7-.1-71.6,0-2.1,0-4.2.3-6.2Z" style="fill: #fff;"/>
  <path d="M607.5,816.9c5-.9,10.4-.5,15.4-.4-.3,11.8-.8,23.6-.6,35.4-.3,14.4.7,28.7,0,43-5,.2-10.1.2-15.1,0-.4-22,0-44.1-.2-66.1,0-3.9-.2-8,.5-11.9Z" style="fill: #fff;"/>
  <path d="M745.3,816.9c5-1,10.6-.5,15.7-.2-.9,26,0,52.1-.5,78.2-5.2.2-10.3.1-15.4,0-.2-23.1,0-46.3-.2-69.4,0-2.8,0-5.8.4-8.6Z" style="fill: #fff;"/>
  <path d="M140.4,971.1c5-.9,10.5-.5,15.6-.3,0,25.6.2,51.2,0,76.7-5.3.4-10.5.5-15.8.2,1.5-16.2.3-32.2.8-48.4.2-9.4-.6-18.8-.6-28.3Z" style="fill: #fff;"/>
  <path d="M280.2,971.1c4.7-.9,9.8-.5,14.6-.4.3,13.2,0,26.4.1,39.6,0,12.3.3,24.7-.2,37-4.9,0-9.8,0-14.7,0-.2-22.6.1-45.2-.2-67.9,0-2.8,0-5.6.3-8.4Z" style="fill: #fff;"/>
  <path d="M607.5,971c4.9-.8,10.3-.4,15.3-.2-.7,25.5-.5,51.1-.3,76.6-5.1,0-10.1,0-15.2,0-.6-19.7,0-39.4-.3-59,0-5.7-.5-11.7.4-17.3Z" style="fill: #fff;"/>
  <path d="M745.3,971.1c5.1-.9,10.5-.4,15.7-.2-.3,25.6.2,51.1-.2,76.7-5.2,0-10.4-.1-15.6-.2-.4-21.5,0-43-.2-64.5,0-3.9-.2-7.9.4-11.8Z" style="fill: #fff;"/>
  <path d="M140.3,1126.3c5-.9,10.5-.4,15.6-.1.2,25.8.2,51.6,0,77.4-5.3.1-10.6.2-15.8,0,.7-11.2,1.2-22.5.8-33.8-.4-10.7.5-21.3-.2-32-.2-3.9-.7-7.8-.4-11.7Z" style="fill: #fff;"/>
  <path d="M280.3,1126.6c4.7-.9,9.7-.6,14.5-.6.5,12.4.1,24.9.2,37.3-.1,13.4.3,26.9-.2,40.3-4.9,0-9.8,0-14.7,0-.2-23,.1-46-.2-68.9,0-2.7,0-5.4.4-8.1Z" style="fill: #fff;"/>
  <path d="M607.6,1126.6c5-.7,10.2-.3,15.2-.4-.8,25.8-.5,51.7-.3,77.5-5.1,0-10.1,0-15.2,0-.7-20.4,0-40.8-.3-61.2,0-5.2-.4-10.8.6-15.9Z" style="fill: #fff;"/>
  <path d="M761,1126c0,25.9-.2,51.7-.1,77.6-5.2.1-10.5.1-15.7,0-.4-17.1,0-34.2-.1-51.3,0-8.6-.4-17.3.3-25.9,5.2-.6,10.4-.6,15.6-.5Z" style="fill: #fff;"/>
  <path d="M140.4,1282.5c5-.8,10.5-.4,15.6-.2,0,25.7,0,51.5,0,77.2-5.3.2-10.6.2-15.9,0,.3-7.4.5-14.8.8-22.2.4-11-.7-22-.2-33,.3-7.3-.4-14.5-.3-21.8Z" style="fill: #fff;"/>
  <path d="M280.2,1282.6c4.7-1,9.8-.5,14.6-.4.3,12.5,0,25,.1,37.5,0,13.3.2,26.6-.1,39.9-5,.1-9.9.1-14.8-.1-.1-23.5.1-47.1-.1-70.6,0-2.1,0-4.1.3-6.2Z" style="fill: #fff;"/>
  <path d="M607.5,1282.5c5.1-.9,10.5-.4,15.6-.3-.3,7.4-.8,14.7-.8,22.1,0,18.4-.2,36.8.5,55.2-5.2.2-10.4.2-15.6,0-.3-22.1.1-44.2-.2-66.3,0-3.5-.1-7.3.5-10.7Z" style="fill: #fff;"/>
  <path d="M745.3,1282.5c5-.9,10.5-.5,15.6-.3-.4,25.8,0,51.6-.3,77.3-5.2.2-10.3.1-15.5-.1-.3-22.4,0-44.9-.2-67.3,0-3.2,0-6.5.4-9.6Z" style="fill: #fff;"/>
  <rect id="conn" x="448" width="4" height="4" style="fill: #fff; opacity: 0;"/>
  <rect id="conn1" data-name="conn" x="448" y="1396" width="4" height="4" style="fill: #fff; opacity: 0;"/>
</svg>
`,

  infra_mehrspurig_4: `
<svg id="infra_mehrspurig_4" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1000 1500">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,0h13.3c0,500,0,1000,0,1500H0V0Z" style="fill: #4a4b4d;"/>
  <path d="M13.3,0h12.7c0,500,0,1000,0,1500h-12.7c0-500,0-1000,0-1500Z" style="fill: #fff;"/>
  <path d="M26,0h436.6c0,500,0,1000,0,1500H26c0-500,0-1000,0-1500Z" style="fill: #4a4b4d;"/>
  <path d="M462.7,0h14.5c0,500,0,1000,0,1500h-14.5c0-500,0-1000,0-1500Z" style="fill: #fff;"/>
  <path d="M477.2,0h46.6c0,500,0,1000,0,1500h-46.6c0-500,0-1000,0-1500Z" style="fill: #689936;"/>
  <path d="M523.8,0h12.6c0,500,0,1000,0,1500h-12.6c0-500,0-1000,0-1500Z" style="fill: #fff;"/>
  <path d="M536.4,0h436.7c0,500,0,1000,0,1500h-436.7c0-500,0-1000,0-1500Z" style="fill: #4a4b4d;"/>
  <path d="M973.2,0h12.7c0,500,0,1000,0,1500h-12.7c0-500,0-1000,0-1500Z" style="fill: #fff;"/>
  <path d="M985.8,0h13.2c.7,20.9.2,41.9.2,62.8.4,33.4-.2,66.8.2,100.3-.1,53.9-.3,107.8,0,161.8.3,18.7-.4,37.4,0,56.1-.1,77-.2,154.3,0,231.3,0,48.1-.2,96.3,0,144.4-.6,28.5.1,57.1-.2,85.6,0,66.8-.2,133.7,0,200.5-.5,24.5,0,49-.2,73.5,0,24.1,0,48.1,0,72.2.3,35.6-.3,71.3,0,107,0,36.5,0,73.1,0,109.6-.1,31.6.2,63.3,0,94.9h-13.3c0-500,0-1000,0-1500Z" style="fill: #4a4b4d;"/>
  <path d="M999,0h1v1500h-.8c.3-31.6,0-63.3,0-94.9,0-36.5,0-73.1,0-109.6-.3-35.7.3-71.3,0-107,0-24.1,0-48.1,0-72.2.3-24.5-.3-49,.2-73.5-.3-66.8,0-133.7,0-200.5.3-28.5-.4-57.1.2-85.6-.3-48.1-.2-96.3,0-144.4-.2-77-.1-154.3,0-231.3-.5-18.7.2-37.4,0-56.1-.2-53.9,0-107.8,0-161.8-.4-33.4.3-66.8-.2-100.3,0-20.9.5-41.9-.2-62.8Z" style="fill: #fff;"/>
  <path d="M121.8,43.5c4.3-.8,8.7-.4,13-.3.5,13.6.1,27.3.2,41,0,14.1.2,28.1-.2,42.2-4.5,0-9,0-13.5,0,.5-23,.2-45.9.2-68.9,0-4.6-.3-9.4.2-14Z" style="fill: #fff;"/>
  <path d="M864.4,43.5c4.3-.8,8.9-.4,13.2-.3-.5,27.7-.2,55.5,0,83.3-4.5,0-8.9,0-13.4,0-.4-22.5,0-45.1-.2-67.6,0-5.1-.2-10.3.4-15.3Z" style="fill: #fff;"/>
  <path d="M231.1,43.7c4.2,0,8.3,0,12.5,0,.4,13.5.2,27,.2,40.5,0,13.9.2,27.8-.2,41.7-4.2,0-8.4,0-12.6,0,0-27.4-.1-54.9,0-82.3Z" style="fill: #fff;"/>
  <path d="M350.7,44.1c4-.9,8.3-.5,12.4-.3,0,27.4.1,54.7,0,82.1-4.3.1-8.6.2-12.8,0,.3-21,.6-42,.3-63.1,0-6.2-.5-12.6.2-18.7Z" style="fill: #fff;"/>
  <path d="M636.2,44.2c4-1.1,8.5-.6,12.6-.5-.3,27.5-.2,55,0,82.5-4.3.1-8.5,0-12.8-.2-.2-23.3.1-46.6-.1-69.9,0-3.9,0-8,.3-11.9Z" style="fill: #fff;"/>
  <path d="M755.5,43.7c4.2,0,8.5,0,12.8,0-.3,27.5,0,55.1-.1,82.6-4.1,0-8.2,0-12.4,0-.9-12.6-.3-25.3-.5-38.1,0-14.8-.2-29.7.2-44.5Z" style="fill: #fff;"/>
  <path d="M121.7,210.8c4.3-.8,8.8-.4,13.2-.3.4,27.5.2,55,.1,82.5-4.5.6-9.1.8-13.6.9-.2-22.6,0-45.3,0-67.9,0-5-.2-10.2.3-15.2Z" style="fill: #fff;"/>
  <path d="M636.2,210.4c4.1-1.2,8.6-.6,12.8-.2-.4,11-.5,22-.4,33.1,0,16.3-.2,32.7.2,49-4.3,0-8.6,0-12.9,0-.2-23,0-46-.1-69,0-4.2-.1-8.6.4-12.8Z" style="fill: #fff;"/>
  <path d="M756.1,210.4c3.9-1.1,8-.6,12-.3,0,27.4,0,54.7,0,82.1-4,0-8.1,0-12.1,0-.9-18.1-.2-36.2-.4-54.3.2-9.1-.6-18.6.6-27.6Z" style="fill: #fff;"/>
  <path d="M864.7,209.6c4.3,0,8.5,0,12.7,0-.3,27.6,0,55.3-.2,82.9-4.2,0-8.4.1-12.6.1-.3-13.4-.1-26.7-.2-40,.1-14.4-.2-28.7.2-43.1Z" style="fill: #fff;"/>
  <path d="M231.1,211.4c3.9-1.4,8.5-.8,12.5-.7.4,13.5.1,27,.2,40.6,0,13.9.3,27.6-.3,41.5-4.2.4-8.5.6-12.7.8-.2-17.2,0-34.4,0-51.6.3-10.2-.4-20.4.3-30.5Z" style="fill: #fff;"/>
  <path d="M350.8,211.2c3.9-1.1,8.3-.6,12.3-.3.1,27.3.1,54.6,0,81.9-4.3.2-8.5.2-12.8.2.3-20.5.5-41.1.3-61.6,0-6.6-.6-13.6.2-20.1Z" style="fill: #fff;"/>
  <path d="M636.2,376.6c4.2-.7,8.5-.4,12.7-.3-.5,15.9-.3,31.6-.3,47.5,0,11.5,0,23,.4,34.5-4.3.3-8.7.4-13,.1-.2-23.1.1-46.3-.1-69.4,0-4.1-.1-8.4.4-12.5Z" style="fill: #fff;"/>
  <path d="M755.9,376.5c4-.7,8.2-.4,12.2-.3,0,27.4-.2,54.8,0,82.2-4.3.2-8.5.2-12.7,0-.6-20.9,0-41.8-.3-62.7,0-6.3-.4-13.1.7-19.2Z" style="fill: #fff;"/>
  <path d="M864.4,376.2c4.3-1,9-.5,13.3-.4,0,27.7-.5,55.3,0,83-4.5.1-9.1.1-13.6,0-.2-23.2,0-46.5-.1-69.7,0-4.3-.1-8.6.4-12.8Z" style="fill: #fff;"/>
  <path d="M135,378.1c.2,27.2.2,54.5,0,81.8-4.6.1-9.1.1-13.7,0-.1-8,0-16,.1-24.1,0-19.4-.6-38.9.3-58.2,4.4-.2,8.9.2,13.3.5Z" style="fill: #fff;"/>
  <path d="M231.1,378.5c4-1.1,8.4-.5,12.5-.2.5,13.9.1,27.6.2,41.5,0,13.3.3,26.5-.2,39.8-4.3,0-8.5,0-12.8,0,0-22.2,0-44.3,0-66.5,0-4.8-.1-9.8.4-14.6Z" style="fill: #fff;"/>
  <path d="M350.8,378.6c3.9-1,8.3-.6,12.2-.4,0,27.1.1,54.3,0,81.4-4.2,0-8.4,0-12.5,0-.2-21.7.5-43.4,0-65.1,0-5.2-.3-10.7.4-15.8Z" style="fill: #fff;"/>
  <path d="M121.8,541.1c4.4,0,8.7,0,13.1,0,.2,28,.2,56.1,0,84.1-4.5,0-9.1,0-13.6,0,.9-28,0-56.1.5-84.1Z" style="fill: #fff;"/>
  <path d="M231.6,541.9c3.9-.9,8.1-.6,12-.3.5,13.8.1,27.5.2,41.4,0,14,.2,27.9-.2,41.9-4.2,0-8.4,0-12.6,0,0-23.3.2-46.7,0-70,0-4.3,0-8.8.6-12.9Z" style="fill: #fff;"/>
  <path d="M351,541.9c3.9-1.1,8.2-.6,12.1-.3.1,27.7.1,55.4,0,83.1-4.3.1-8.6.1-12.9,0,.4-22,.7-43.9.1-66,0-5.6-.2-11.4.7-16.9Z" style="fill: #fff;"/>
  <path d="M864.4,543.5c4.3-.8,8.9-.4,13.3-.3.3,15.4-.2,30.9,0,46.4-.4,11.6,1.3,23.9-.5,35.3-4.2.9-8.7.4-12.9.2-.6-18.5,0-37-.3-55.6.2-8.6-.4-17.4.4-26Z" style="fill: #fff;"/>
  <path d="M636.2,544.2c4-1.1,8.4-.6,12.5-.5,0,27-.1,54.1,0,81.1-4.3,0-8.5,0-12.7-.2-.2-22.8.1-45.7-.1-68.5,0-3.9,0-8,.3-11.9Z" style="fill: #fff;"/>
  <path d="M755.5,543.7c4.3,0,8.5,0,12.8,0,0,27,0,53.9,0,80.9-4.2.2-8.5.2-12.7,0-.5-13.1-.1-26.1-.2-39.2,0-14-.2-27.9.2-41.9Z" style="fill: #fff;"/>
  <path d="M134.9,709.1c.4,13.2.1,26.4.2,39.6,0,14.3.2,28.5,0,42.8-4.4,0-8.9,0-13.3,0-.1-27.5-.5-55,0-82.4,4.4-.2,8.8,0,13.2.1Z" style="fill: #fff;"/>
  <path d="M231.2,709.4c4.1-.5,8.4,0,12.5,0,.3,27.2,0,54.4.1,81.6-4.3,0-8.5,0-12.8,0-.3-23.5,0-47-.2-70.5,0-3.7,0-7.5.4-11.2Z" style="fill: #fff;"/>
  <path d="M636.2,709.3c4.1-.8,8.4-.5,12.6-.5-.5,27.2.1,54.5-.4,81.7-4.2,0-8.3,0-12.5-.1-.2-23.3.1-46.6-.1-69.9,0-3.7,0-7.6.4-11.3Z" style="fill: #fff;"/>
  <path d="M755.9,709.2c4-.7,8.2-.3,12.2-.3.2,27.3.3,54.7,0,82-4.1-.1-8.3-.2-12.4-.2-.9-18-.2-36.1-.4-54.1.2-9-.7-18.5.6-27.4Z" style="fill: #fff;"/>
  <path d="M864.4,708.9c4.2-.9,8.8-.5,13.1-.3.2,27.5.4,55.1,0,82.6-4.4-.1-8.9-.2-13.3-.4-.5-21.2,0-42.4-.2-63.6,0-6.1-.3-12.3.3-18.3Z" style="fill: #fff;"/>
  <path d="M350.7,709.5c4.1,0,8.3,0,12.4,0,0,27.2.1,54.4,0,81.6-4.1,0-8.3,0-12.4,0-.4-11.9.1-23.8,0-35.7,0-15.3-.1-30.6,0-45.9Z" style="fill: #fff;"/>
  <path d="M134.8,874.8c.4,8.3.4,16.6.3,24.9-.1,19,.2,38.1-.2,57.1-4.5,0-9,0-13.6,0-.2-22.6.3-45.2-.1-67.8,0-4.5-.3-9.5.7-13.8,4.1-1.1,8.6-.6,12.8-.5Z" style="fill: #fff;"/>
  <path d="M864.4,875.1c4.3-.8,8.9-.4,13.3-.3-.6,28-.2,56-.3,84-4.4.2-8.9.2-13.3,0-.2-23.7,0-47.4-.1-71.1,0-4.2-.1-8.5.4-12.6Z" style="fill: #fff;"/>
  <path d="M231.1,875.8c4-1.2,8.5-.7,12.5-.6.4,12.6.2,25.2.2,37.9,0,14.4.1,28.8-.2,43.2-4.3,0-8.6,0-12.9-.1,0-22.4.3-44.8,0-67.2,0-4.4-.1-8.9.3-13.2Z" style="fill: #fff;"/>
  <path d="M350.8,875.7c4-.9,8.3-.5,12.3-.3.1,27,.1,53.9,0,80.9-4.2.1-8.4.1-12.6,0-.2-22,.5-44,0-65.9,0-4.8-.3-9.9.3-14.7Z" style="fill: #fff;"/>
  <path d="M636.2,875.8c4.1-1.1,8.5-.6,12.7-.5-.2,14.4-.3,28.8-.2,43.2,0,13.4.4,26.7-.3,40-4.1.2-8.3.1-12.4,0-.2-23.6,0-47.1-.1-70.7,0-3.9,0-8,.3-11.9Z" style="fill: #fff;"/>
  <path d="M755.5,875.2c4.3,0,8.5,0,12.8,0-.4,27.7,0,55.4-.2,83.1-4.2.2-8.4.3-12.5.1-.5-13.8-.1-27.5-.2-41.4,0-14-.2-27.9.2-41.9Z" style="fill: #fff;"/>
  <path d="M636.2,1040.8c4.2-.7,8.5-.4,12.7-.3-.6,27.1-.2,54.3-.3,81.4-4.2.1-8.5.1-12.7,0-.2-23.2.1-46.5-.1-69.7,0-3.7,0-7.6.4-11.3Z" style="fill: #fff;"/>
  <path d="M755.9,1040.8c4.1-.7,8.3-.4,12.4-.3,0,27.2.2,54.4-.1,81.6-4.2,0-8.4,0-12.6-.3-.6-20.1,0-40.1-.3-60.2,0-6.8-.5-14.1.6-20.7Z" style="fill: #fff;"/>
  <path d="M864.4,1040.5c4.3-1,9-.5,13.4-.4.3,9.4,0,18.7-.1,28.1.2,18.2.6,36.2-.2,54.4-4.4-.2-8.9-.4-13.3-.8-.2-22.8,0-45.6-.1-68.3,0-4.3-.1-8.7.4-13Z" style="fill: #fff;"/>
  <path d="M121.5,1041.7c4.3-1.1,9-.6,13.4-.4.2,27.6.2,55.3,0,83-4.5,0-9.1,0-13.6,0,0-24.8.7-49.5,0-74.3,0-2.8,0-5.5.2-8.2Z" style="fill: #fff;"/>
  <path d="M231,1042c4.1-1.2,8.6-.6,12.8-.2,0,27.4,0,54.7,0,82-4.3,0-8.7,0-13,0,0-23.9.4-47.8,0-71.7,0-3.3-.1-6.8.2-10.1Z" style="fill: #fff;"/>
  <path d="M350.7,1041.9c4-1,8.3-.6,12.4-.3.1,27.3,0,54.6,0,81.9-4.3.1-8.6.1-12.8,0,.3-20.3.5-40.5.3-60.8,0-6.9-.7-14.1.1-20.9Z" style="fill: #fff;"/>
  <path d="M877.7,1206.1c.4,11.1,0,22.1,0,33.2.1,16.8-.1,33.5-.1,50.3-4.5,0-8.9,0-13.4,0-.3-27.5,0-55-.1-82.4,4.5-.7,9-.9,13.6-1Z" style="fill: #fff;"/>
  <path d="M122.3,1207.6c4-.7,8.3-.4,12.3-.3,0,27.6,0,55.2,0,82.8-4.3.2-8.6.3-12.9.2.2-24.2.2-48.4,0-72.6,0-3.4,0-6.9.6-10.2Z" style="fill: #fff;"/>
  <path d="M350.9,1208c4-.7,8.1-.3,12.1-.3.2,27.4.1,54.8,0,82.2-4.3.2-8.5.2-12.8,0,.3-21.4.6-42.7.2-64,0-5.9-.4-12.1.4-17.9Z" style="fill: #fff;"/>
  <path d="M636.2,1207.7c4-1,8.5-.6,12.6-.6-.2,27.4-.2,54.8,0,82.2-4.2.1-8.5,0-12.7-.2-.2-23.3.1-46.6-.1-69.9,0-3.8,0-7.8.4-11.6Z" style="fill: #fff;"/>
  <path d="M755.8,1207.5c3.9-1.1,8.4-.8,12.4-.7,0,27.4,0,54.8,0,82.2-4.2.3-8.4.3-12.7.2-.5-20.6,0-41.3-.2-62,0-6.5-.4-13.4.6-19.7Z" style="fill: #fff;"/>
  <path d="M231.2,1207.9c4,0,8.1,0,12.1,0,.4,16.2,0,32.5.2,48.7,0,11.1.2,22.2-.3,33.3-4,.1-8,.1-12,0-.4-13.4,0-26.7-.1-40,0-14-.2-28,.2-42.1Z" style="fill: #fff;"/>
  <path d="M121.7,1373.9c4.3-.8,8.9-.4,13.2-.3.4,12.8.1,25.5.2,38.2,0,15,.2,30.1-.2,45.1-4.5,0-9,0-13.5,0,.6-19,.3-38,.3-57.1.2-8.6-.7-17.3,0-25.9Z" style="fill: #fff;"/>
  <path d="M231.1,1373.9c4.2-.1,8.3-.1,12.5,0,.4,13.6.1,27.1.2,40.6,0,14,.2,27.9-.2,41.9-4.2,0-8.4,0-12.6,0,0-27.5-.1-55,0-82.5Z" style="fill: #fff;"/>
  <path d="M350.3,1373.9c4.3-.2,8.5-.1,12.7,0,.1,27.4.1,54.9,0,82.3-4.3.1-8.5.1-12.8,0,.5-27.5.4-55,0-82.5Z" style="fill: #fff;"/>
  <path d="M636.2,1374.7c4-1.2,8.6-.7,12.6-.6-.3,27.4-.2,54.8-.1,82.3-4.3,0-8.5,0-12.8-.1-.2-23.3.1-46.6-.1-69.9,0-3.9,0-7.9.4-11.7Z" style="fill: #fff;"/>
  <path d="M755.8,1374.6c4-1,8.4-.6,12.4-.4-.1,27.3,0,54.7,0,82-4.2.1-8.4.2-12.7,0-.5-21.1,0-42.2-.3-63.2,0-6.1-.3-12.5.6-18.5Z" style="fill: #fff;"/>
  <path d="M864.3,1374.3c4.3-1.2,9-.6,13.4-.4-.5,27.6-.2,55.3-.2,83-4.4,0-8.8,0-13.3-.1-.5-21.6,0-43.3-.2-65,0-5.8-.3-11.7.3-17.4Z" style="fill: #fff;"/>
  <rect id="conn" x="498" width="4" height="4" style="fill: #fff; opacity: 0;"/>
  <rect id="conn1" data-name="conn" x="498.5" y="1496" width="4" height="4" style="fill: #fff; opacity: 0;"/>
</svg>
`,

infra_mehrspurig_2_eine_bahn: `
<svg id="infra_mehrspurig_2_eine_bahn" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 223.1 650">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,0h4c0,1.2-.1,2.3-.1,3.5v646.5H0V0h0Z" style="fill: #4a4b4d;"/>
  <path d="M4,0h37.6v650H3.9V3.5C3.9,2.3,3.9,1.2,4,0h0Z" style="fill: #56a039;"/>
  <path d="M41.6,0h3.9v650h-3.9V0Z" style="fill: #4a4b4d;"/>
  <path d="M45.5,0h6.8v650h-6.8V0Z" style="fill: #fff;"/>
  <path d="M52.3,0h158.3c.1,2.1,0,4.3,0,6.4v643.6H52.2V0h0Z" style="fill: #4a4b4d;"/>
  <path d="M210.6,0h8.1c-.3,3.4-.1,6.9-.2,10.4v639.6h-7.9V0h0Z" style="fill: #fff;"/>
  <path d="M218.7,0h4.4v650h-4.6V10.4c0-3.5-.1-6.9.2-10.4Z" style="fill: #4a4b4d;"/>
  <path d="M127.3,34.8c2.2-.4,4.5,0,6.7,0,.3,5,0,10,.1,15.1v29.4h-6.9c-.3-4.4-.1-8.7-.2-13.1v-27.2c0-1.4,0-2.9.3-4.2Z" style="fill: #fff;"/>
  <path d="M127.1,124.1c2.4,0,4.7,0,7.1,0,.3,4.2.2,8.3.2,12.5v22.8c0,3.2,0,6.3-.2,9.5h-7.1c-.2-9.1,0-18.2,0-27.3s-.1-11.6,0-17.4h0Z" style="fill: #fff;"/>
  <path d="M127.4,214.1c2.1-.5,4.5-.2,6.7,0,.1,6.1,0,12.3,0,18.4s.1,16.7,0,25.1h-6.7c-.2-4.6,0-9.1-.1-13.7v-25.7c0-1.3,0-2.7.2-4h-.1Z" style="fill: #fff;"/>
  <path d="M127.5,302.6c2.1-.3,4.4-.1,6.5,0,.1,5.8,0,11.7,0,17.5v26.5h-6.7c-.2-4.6,0-9.1-.1-13.7v-26.2c0-1.4,0-2.8.3-4.1h0Z" style="fill: #fff;"/>
  <path d="M127.3,391.9c2.1-.5,4.6-.2,6.8,0v7.8c0,12,.1,24.1,0,36.1-2.3.3-4.6.3-6.9.2-.2-4.5,0-9-.1-13.5v-26.7c0-1.3,0-2.6.3-3.8h0Z" style="fill: #fff;"/>
  <path d="M127,482.4c2.3-.5,5-.2,7.3-.1.3,9.6,0,19.2.1,28.8,0,5,.2,10-.1,15-2.5.2-4.9.2-7.4,0-.1-13.4,0-26.8,0-40.2s0-2.3.2-3.4h-.1Z" style="fill: #fff;"/>
  <path d="M127.3,571.6c2.2-.3,4.5,0,6.8,0,.1,5.9,0,11.7,0,17.6v26.3c-2.3.2-4.7.2-7,0-.2-12.8,0-25.5-.1-38.3,0-1.8,0-3.8.3-5.6h0Z" style="fill: #fff;"/>
  <rect id="conn" x="21.1" y="0" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
  <rect id="conn1" x="21.1" y="646" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
</svg>
`,

  infra_mehrspurig_3_eine_bahn: `
<svg id="infra_mehrspurig_3_eine_bahn" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 475.9 1400">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,0h53.9c-.1,466.7,0,933.3,0,1400H.1V0h-.1Z" style="fill: #689936;"/>
  <path d="M53.9,0h15v1400h-15V0Z" style="fill: #fff;"/>
  <path d="M68.9,0h378.8c.3,4.8,0,9.6,0,14.3v1385.7H68.9V0h0Z" style="fill: #4a4b4d;"/>
  <path d="M447.7,0h14.7v1400h-14.6V14.3c0-4.8,0-9.6,0-14.3h0Z" style="fill: #fff;"/>
  <path d="M462.4,0h13.5v1400h-13.5V0Z" style="fill: #4a4b4d;"/>
  <path d="M183.4,40.8c4.9-1,10.3-.5,15.3-.3-.8,25.8-.8,51.7,0,77.6-5.2.2-10.4.2-15.6,0-.3-21.7,0-43.5-.2-65.2,0-4-.2-8.1.5-12h0Z" style="fill: #fff;"/>
  <path d="M321.2,40.8c5-1,10.5-.5,15.6-.4-.6,25.8,0,51.7-.2,77.5-5.2.2-10.4.2-15.6,0-.2-22.8,0-45.6-.2-68.5,0-2.9,0-5.8.4-8.7h0Z" style="fill: #fff;"/>
  <path d="M183.4,196.1c5-.9,10.4-.5,15.4-.3,0,8.1-.6,16.3-.6,24.4,0,17.6-.3,35.3.4,52.9-5.2.2-10.4.2-15.6,0-.4-21.7,0-43.3-.2-65,0-3.9-.2-8.1.5-12h0Z" style="fill: #fff;"/>
  <path d="M321.5,196.2c4.8-1.1,10.1-.6,15-.5.2,12.5,0,25.1,0,37.6s.2,26.5-.2,39.7c-5.1.1-10.1.1-15.1,0,0-23.5,0-47,0-70.5,0-2.1,0-4.2.3-6.3Z" style="fill: #fff;"/>
  <path d="M183.4,351.2c5-.9,10.3-.4,15.4-.3-.8,25.8-.7,51.6,0,77.3-5.2.2-10.4.2-15.7,0-.3-22.4,0-44.8-.2-67.2,0-3.2,0-6.6.5-9.8Z" style="fill: #fff;"/>
  <path d="M321.2,351.3c5-1,10.4-.5,15.4-.4.3,15.9-.2,31.7,0,47.5,0,9.9.2,19.9,0,29.8-5.2.1-10.4.1-15.6,0-.2-22.8,0-45.5-.2-68.3,0-2.9,0-5.8.4-8.6h0Z" style="fill: #fff;"/>
  <path d="M183.4,507.4c4.9-1,10.3-.5,15.3-.3-.6,25.4-.6,50.8,0,76.2-5.2.2-10.3.2-15.5,0-.4-20.9,0-41.8-.2-62.7,0-4.3-.2-8.9.5-13.2h0Z" style="fill: #fff;"/>
  <path d="M321.2,507.5c5-1,10.6-.5,15.7-.3-.2,25.3,0,50.7,0,76-5.3.3-10.4.4-15.7,0-.4-22.3,0-44.7-.2-67.1,0-2.9,0-5.8.3-8.7h0Z" style="fill: #fff;"/>
  <path d="M183.4,661.7c4.9-.9,10.2-.4,15.1-.3-.6,25.6,0,51.2-.4,76.8h-15c-.5-20.8,0-41.6-.3-62.4,0-4.6-.3-9.5.5-14.1h.1Z" style="fill: #fff;"/>
  <path d="M321.2,661.7c4.9-.9,10.2-.4,15.2-.3.3,9.9.3,19.9.3,29.8,0,15.7.4,31.5-.3,47.2-5.1,0-10.3-.2-15.4-.3-.4-21.5,0-43.1-.2-64.6,0-3.9-.2-8,.4-11.9h0Z" style="fill: #fff;"/>
  <path d="M183.4,816.9c5-.9,10.4-.5,15.4-.4-.3,11.8-.8,23.6-.6,35.4-.3,14.4.7,28.7,0,43-5,.2-10.1.2-15.1,0-.4-22,0-44.1-.2-66.1,0-3.9-.2-8,.5-11.9h0Z" style="fill: #fff;"/>
  <path d="M321.2,816.9c5-1,10.6-.5,15.7-.2-.9,26,0,52.1-.5,78.2-5.2.2-10.3,0-15.4,0-.2-23.1,0-46.3-.2-69.4,0-2.8,0-5.8.4-8.6Z" style="fill: #fff;"/>
  <path d="M183.4,971c4.9-.8,10.3-.4,15.3-.2-.7,25.5-.5,51.1-.3,76.6h-15.2c-.6-19.7,0-39.4-.3-59,0-5.7-.5-11.7.4-17.3h0Z" style="fill: #fff;"/>
  <path d="M321.2,971.1c5.1-.9,10.5-.4,15.7-.2-.3,25.6.2,51.1-.2,76.7-5.2,0-10.4,0-15.6-.2-.4-21.5,0-43-.2-64.5,0-3.9-.2-7.9.4-11.8h-.1Z" style="fill: #fff;"/>
  <path d="M183.5,1126.6c5-.7,10.2-.3,15.2-.4-.8,25.8-.5,51.7-.3,77.5h-15.2c-.7-20.4,0-40.8-.3-61.2,0-5.2-.4-10.8.6-15.9Z" style="fill: #fff;"/>
  <path d="M336.9,1126c0,25.9-.2,51.7,0,77.6-5.2,0-10.5,0-15.7,0-.4-17.1,0-34.2,0-51.3,0-8.6-.4-17.3.3-25.9,5.2-.6,10.4-.6,15.6-.5h0Z" style="fill: #fff;"/>
  <path d="M183.4,1282.5c5.1-.9,10.5-.4,15.6-.3-.3,7.4-.8,14.7-.8,22.1,0,18.4-.2,36.8.5,55.2-5.2.2-10.4.2-15.6,0-.3-22.1,0-44.2-.2-66.3,0-3.5,0-7.3.5-10.7h0Z" style="fill: #fff;"/>
  <path d="M321.2,1282.5c5-.9,10.5-.5,15.6-.3-.4,25.8,0,51.6-.3,77.3-5.2.2-10.3,0-15.5,0-.3-22.4,0-44.9-.2-67.3,0-3.2,0-6.5.4-9.6Z" style="fill: #fff;"/>
  <rect id="conn" x="23.9" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
  <rect id="conn1" x="23.9" y="1396" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
</svg>
`,

  infra_mehrspurig_4_eine_bahn: `
<svg id="infra_mehrspurig_4_eine_bahn" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 537.3 1500">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,0h14.5v1500H0V0Z" style="fill: #fff;"/>
  <path d="M14.5,0h46.6v1500H14.5V0h0Z" style="fill: #689936;"/>
  <path d="M61.1,0h12.6v1500h-12.6V0Z" style="fill: #fff;"/>
  <path d="M73.7,0h436.7v1500H73.7V0Z" style="fill: #4a4b4d;"/>
  <path d="M510.5,0h12.7v1500h-12.7V0Z" style="fill: #fff;"/>
  <path d="M523.1,0h13.2c.7,20.9.2,41.9.2,62.8.4,33.4-.2,66.8.2,100.3,0,53.9-.3,107.8,0,161.8.3,18.7-.4,37.4,0,56.1,0,77-.2,154.3,0,231.3,0,48.1-.2,96.3,0,144.4-.6,28.5,0,57.1-.2,85.6,0,66.8-.2,133.7,0,200.5-.5,24.5,0,49-.2,73.5v72.2c.3,35.6-.3,71.3,0,107v109.6c0,31.6.2,63.3,0,94.9h-13.3V0h0Z" style="fill: #4a4b4d;"/>
  <path d="M536.3,0h1v1500h-.8c.3-31.6,0-63.3,0-94.9v-109.6c-.3-35.7.3-71.3,0-107v-72.2c.3-24.5-.3-49,.2-73.5-.3-66.8,0-133.7,0-200.5.3-28.5-.4-57.1.2-85.6-.3-48.1-.2-96.3,0-144.4-.2-77,0-154.3,0-231.3-.5-18.7.2-37.4,0-56.1-.2-53.9,0-107.8,0-161.8-.4-33.4.3-66.8-.2-100.3,0-20.9.5-41.9-.2-62.8h-.2Z" style="fill: #fff;"/>
  <path d="M401.7,43.5c4.3-.8,8.9-.4,13.2-.3-.5,27.7-.2,55.5,0,83.3h-13.4c-.4-22.5,0-45.1-.2-67.6,0-5.1-.2-10.3.4-15.3h0Z" style="fill: #fff;"/>
  <path d="M173.5,44.2c4-1.1,8.5-.6,12.6-.5-.3,27.5-.2,55,0,82.5-4.3,0-8.5,0-12.8-.2-.2-23.3,0-46.6,0-69.9,0-3.9,0-8,.3-11.9Z" style="fill: #fff;"/>
  <path d="M292.8,43.7h12.8c-.3,27.5,0,55.1,0,82.6h-12.4c-.9-12.6-.3-25.3-.5-38.1,0-14.8-.2-29.7.2-44.5Z" style="fill: #fff;"/>
  <path d="M173.5,210.4c4.1-1.2,8.6-.6,12.8-.2-.4,11-.5,22-.4,33.1,0,16.3-.2,32.7.2,49h-12.9c-.2-23,0-46,0-69,0-4.2,0-8.6.4-12.8h0Z" style="fill: #fff;"/>
  <path d="M293.4,210.4c3.9-1.1,8-.6,12-.3v82.1h-12.1c-.9-18.1-.2-36.2-.4-54.3.2-9.1-.6-18.6.6-27.6h0Z" style="fill: #fff;"/>
  <path d="M402,209.6h12.7c-.3,27.6,0,55.3-.2,82.9-4.2,0-8.4.1-12.6.1-.3-13.4,0-26.7-.2-40,0-14.4-.2-28.7.2-43.1h0Z" style="fill: #fff;"/>
  <path d="M173.5,376.6c4.2-.7,8.5-.4,12.7-.3-.5,15.9-.3,31.6-.3,47.5s0,23,.4,34.5c-4.3.3-8.7.4-13,.1-.2-23.1,0-46.3,0-69.4,0-4.1,0-8.4.4-12.5h-.1Z" style="fill: #fff;"/>
  <path d="M293.2,376.5c4-.7,8.2-.4,12.2-.3,0,27.4-.2,54.8,0,82.2-4.3.2-8.5.2-12.7,0-.6-20.9,0-41.8-.3-62.7,0-6.3-.4-13.1.7-19.2h0Z" style="fill: #fff;"/>
  <path d="M401.7,376.2c4.3-1,9-.5,13.3-.4,0,27.7-.5,55.3,0,83-4.5.1-9.1.1-13.6,0-.2-23.2,0-46.5,0-69.7,0-4.3,0-8.6.4-12.8h0Z" style="fill: #fff;"/>
  <path d="M401.7,543.5c4.3-.8,8.9-.4,13.3-.3.3,15.4-.2,30.9,0,46.4-.4,11.6,1.3,23.9-.5,35.3-4.2.9-8.7.4-12.9.2-.6-18.5,0-37-.3-55.6.2-8.6-.4-17.4.4-26h0Z" style="fill: #fff;"/>
  <path d="M173.5,544.2c4-1.1,8.4-.6,12.5-.5,0,27,0,54.1,0,81.1-4.3,0-8.5,0-12.7-.2-.2-22.8,0-45.7,0-68.5,0-3.9,0-8,.3-11.9h0Z" style="fill: #fff;"/>
  <path d="M292.8,543.7h12.8v80.9c-4.2.2-8.5.2-12.7,0-.5-13.1,0-26.1-.2-39.2,0-14-.2-27.9.2-41.9v.2Z" style="fill: #fff;"/>
  <path d="M173.5,709.3c4.1-.8,8.4-.5,12.6-.5-.5,27.2,0,54.5-.4,81.7-4.2,0-8.3,0-12.5,0-.2-23.3,0-46.6,0-69.9,0-3.7,0-7.6.4-11.3h0Z" style="fill: #fff;"/>
  <path d="M293.2,709.2c4-.7,8.2-.3,12.2-.3.2,27.3.3,54.7,0,82-4.1,0-8.3-.2-12.4-.2-.9-18-.2-36.1-.4-54.1.2-9-.7-18.5.6-27.4h0Z" style="fill: #fff;"/>
  <path d="M401.7,708.9c4.2-.9,8.8-.5,13.1-.3.2,27.5.4,55.1,0,82.6-4.4,0-8.9-.2-13.3-.4-.5-21.2,0-42.4-.2-63.6,0-6.1-.3-12.3.3-18.3h.1Z" style="fill: #fff;"/>
  <path d="M401.7,875.1c4.3-.8,8.9-.4,13.3-.3-.6,28-.2,56-.3,84-4.4.2-8.9.2-13.3,0-.2-23.7,0-47.4,0-71.1,0-4.2,0-8.5.4-12.6h0Z" style="fill: #fff;"/>
  <path d="M173.5,875.8c4.1-1.1,8.5-.6,12.7-.5-.2,14.4-.3,28.8-.2,43.2,0,13.4.4,26.7-.3,40-4.1.2-8.3,0-12.4,0-.2-23.6,0-47.1,0-70.7,0-3.9,0-8,.3-11.9h0Z" style="fill: #fff;"/>
  <path d="M292.8,875.2h12.8c-.4,27.7,0,55.4-.2,83.1-4.2.2-8.4.3-12.5,0-.5-13.8,0-27.5-.2-41.4,0-14-.2-27.9.2-41.9h0Z" style="fill: #fff;"/>
  <path d="M173.5,1040.8c4.2-.7,8.5-.4,12.7-.3-.6,27.1-.2,54.3-.3,81.4-4.2,0-8.5,0-12.7,0-.2-23.2,0-46.5,0-69.7,0-3.7,0-7.6.4-11.3h0Z" style="fill: #fff;"/>
  <path d="M293.2,1040.8c4.1-.7,8.3-.4,12.4-.3,0,27.2.2,54.4,0,81.6-4.2,0-8.4,0-12.6-.3-.6-20.1,0-40.1-.3-60.2,0-6.8-.5-14.1.6-20.7h0Z" style="fill: #fff;"/>
  <path d="M401.7,1040.5c4.3-1,9-.5,13.4-.4.3,9.4,0,18.7,0,28.1.2,18.2.6,36.2-.2,54.4-4.4-.2-8.9-.4-13.3-.8-.2-22.8,0-45.6,0-68.3,0-4.3,0-8.7.4-13h-.1Z" style="fill: #fff;"/>
  <path d="M415,1206.1c.4,11.1,0,22.1,0,33.2,0,16.8,0,33.5,0,50.3h-13.4c-.3-27.5,0-55,0-82.4,4.5-.7,9-.9,13.6-1h0Z" style="fill: #fff;"/>
  <path d="M173.5,1207.7c4-1,8.5-.6,12.6-.6-.2,27.4-.2,54.8,0,82.2-4.2,0-8.5,0-12.7-.2-.2-23.3,0-46.6,0-69.9,0-3.8,0-7.8.4-11.6h-.2Z" style="fill: #fff;"/>
  <path d="M293.1,1207.5c3.9-1.1,8.4-.8,12.4-.7v82.2c-4.2.3-8.4.3-12.7.2-.5-20.6,0-41.3-.2-62,0-6.5-.4-13.4.6-19.7h0Z" style="fill: #fff;"/>
  <path d="M173.5,1374.7c4-1.2,8.6-.7,12.6-.6-.3,27.4-.2,54.8,0,82.3-4.3,0-8.5,0-12.8,0-.2-23.3,0-46.6,0-69.9,0-3.9,0-7.9.4-11.7h0Z" style="fill: #fff;"/>
  <path d="M293.1,1374.6c4-1,8.4-.6,12.4-.4,0,27.3,0,54.7,0,82-4.2,0-8.4.2-12.7,0-.5-21.1,0-42.2-.3-63.2,0-6.1-.3-12.5.6-18.5h0Z" style="fill: #fff;"/>
  <path d="M401.6,1374.3c4.3-1.2,9-.6,13.4-.4-.5,27.6-.2,55.3-.2,83-4.4,0-8.8,0-13.3,0-.5-21.6,0-43.3-.2-65,0-5.8-.3-11.7.3-17.4h0Z" style="fill: #fff;"/>
  <rect id="conn" x="35.3" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
  <rect id="conn1" x="35.8" y="1496" width="4" height="4" style="fill: #fff; fill-opacity: 0;"/>
</svg>
`,

  // ---------------------------------------------------------------------------
  // Wege
  // ---------------------------------------------------------------------------

  infra_gehweg: `
<svg id="infra_gehweg" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,0h100v.5c-2.9,0-5.8,0-8.7,0,0,20.5,0,40.9,0,61.4,0,.8,0,1.6,0,2.4,2.3,0,4.6,0,6.9,0,.6,0,1.2,0,1.8,0v.9c-2.9,0-5.8,0-8.7,0,0,20.8,0,41.6,0,62.4,0,.6-.1,1.2.1,1.8,0,.1,0,.2-.1.3,2.6,0,5.3,0,7.9,0,.3,0,.6,0,.8,0v.4c-2.6,0-5.3,0-7.9,0-.3,0-.5,0-.8,0,0,5.3,0,10.5,0,15.8,0,15.9,0,31.9,0,47.8h.1c2.9.1,5.7,0,8.6.1v1c-2.9,0-5.7,0-8.6,0h0c0,21,0,42.3,0,63.2v.2c2.9,0,5.8,0,8.7,0v1c-2.9,0-5.7,0-8.6,0v.2c0,13.5,0,27,0,40.4h-1.1c0-2.4,0-4.8,0-7.2,0-.3,0-.7,0-1-13.1,0-26.7,0-39.8,0,0,2.7,0,5.5,0,8.2h-.8c0-2.7,0-5.4,0-8.2h-.1c-11.6,0-23.2,0-34.8,0-1.6,0-3.3,0-5,0,0,2.7,0,5.5,0,8.2h-1c0-5.9,0-11.7,0-17.6,0-6.6,0-13.2,0-19.7.1-1,0-2.1.1-3h.3s0,.2,0,.2c0,9.4,0,18.8,0,28.1,0,.9,0,1.7,0,2.6,0,0,.2,0,.3,0-.3-.4-.2-.8-.2-1.3,0-9.1,0-18.2,0-27.3,0-.9,0-1.8,0-2.6-.1,0-.3.1-.4.2-.4-.1-.8-.1-1.2-.1-2.5,0-5.1,0-7.6,0v.2c0,13,0,26.2,0,39.3,0,.3,0,.7,0,1h-.1v-169.6c0,.2,0,.4,0,.7,0,20.6,0,41.3,0,61.9,0,.3,0,.7,0,1h.2c2.8,0,5.5,0,8.3,0h.2c0-1.6,0-3.1,0-4.6,0-18.3,0-36.6,0-54.9,0-1.2,0-2.5,0-3.7,0-.2,0-.3,0-.5-2.4,0-4.8,0-7.2,0-.5,0-1,0-1.5,0v-.9c2.9,0,5.8,0,8.7,0,.1-.3,0-.7,0-1.1,0-20.1,0-40.1,0-60.2,0-.9,0-1.7,0-2.6h-.2c-2.4,0-4.9,0-7.3,0-.4,0-.8,0-1.2,0,0,.4,0,.9,0,1.4,0,20.3,0,40.6,0,60.9,0,.4,0,1,0,1.4V0Z" style="fill: #6d6d67;"/>
  <path d="M91.3.5c2.9,0,5.8,0,8.7,0v63.9c-.6,0-1.2,0-1.8,0-2.3,0-4.6,0-6.9,0,0-.8,0-1.6,0-2.4,0-20.5,0-41,0-61.4Z" style="fill: #b8b7b1;"/>
  <path d="M9.8.6c7.4,0,15.1,0,22.5,0,1.1,0,2.2,0,3.3,0,0,10.1,0,20.2,0,30.3,0,.4,0,.8,0,1.1-1.8,0-3.6,0-5.4,0-6.7,0-13.5,0-20.2,0h-.1c0-10,0-20.4,0-30.5,0-.3,0-.6,0-.9Z" style="fill: #b8b7b1;"/>
  <path d="M36.5.6c.5-.1,1,0,1.4,0,8.3,0,16.7,0,25,0,.3,0,.5,0,.8,0,0,10.4,0,20.8,0,31.2h-.1c-7.9.2-15.8,0-23.7.2-1.1,0-2.3,0-3.4,0,0-2.3,0-4.6,0-7,0-8.1,0-16.2,0-24.4Z" style="fill: #b8b7b1;"/>
  <path d="M64.5.6h.1c8.6,0,17.1,0,25.7,0,0,.2,0,.4,0,.6,0,7.4,0,14.8,0,22.3,0,2.8,0,5.7,0,8.4-2.1,0-4.3,0-6.5,0-6.4,0-12.9,0-19.2,0v-.2c0-10.3,0-20.7,0-31Z" style="fill: #b8b7b1;"/>
  <path d="M.1.7c.3,0,.6,0,.9,0,2.3,0,4.5,0,6.8,0,.3,0,.7,0,1,0,0,3.6,0,7.2,0,10.7,0,17.6,0,35.3,0,52.9-2.9,0-5.8,0-8.6,0-.1-.4,0-.8,0-1.2,0-20.7,0-41.6,0-62.3v-.2Z" style="fill: #b8b7b1;"/>
  <path d="M9.8,33c13.1,0,26.3,0,39.4,0,.2,0,.3,0,.4,0,0,10.3,0,21,0,31.3-.6.1-1.2,0-1.8,0-12.5,0-25.1,0-37.6,0-.2,0-.3,0-.5,0,0-10.2,0-20.6,0-30.8,0-.2,0-.4,0-.5Z" style="fill: #b8b7b1;"/>
  <path d="M50.5,33c8.1,0,16.2,0,24.3,0,5.1,0,10.3,0,15.4,0v.2c0,10.3,0,20.7,0,31.1h0c-2.4.1-4.7.2-7.1.2-6,0-12,0-18,0-2.5,0-5.1,0-7.6,0-2.3,0-4.6,0-6.9,0,0-4.8,0-9.9,0-14.8,0-5.5,0-11.1,0-16.6Z" style="fill: #b8b7b1;"/>
  <path d="M91.3,65.3c2.9,0,5.8,0,8.7,0v64c-2.7,0-5.4,0-8.1,0-.3,0-.6.3-.2.5,2.8,0,5.6,0,8.3,0h0c-.3,0-.6,0-.8,0-2.6,0-5.3,0-7.9,0,0,0,.1-.2.1-.3-.3-.6-.1-1.1-.1-1.8,0-20.8,0-41.6,0-62.4Z" style="fill: #b8b7b1;"/>
  <path d="M9.8,65.5c8.6,0,17.2-.1,25.8,0,0,10.4,0,20.9,0,31.2v.2c-8.5,0-16.9,0-25.4,0-.2,0-.3,0-.5,0,0-10.3,0-20.5,0-30.8,0-.2,0-.3,0-.5Z" style="fill: #b8b7b1;"/>
  <path d="M36.5,65.5c8.7,0,17.4,0,26.1,0,.4,0,.8,0,1.1,0,0,2.8,0,5.6,0,8.4,0,7.6,0,15.4,0,23-1.1,0-2.3,0-3.4,0-7.8,0-15.6,0-23.3,0-.2,0-.3,0-.4,0,0-8.1,0-16.1,0-24.2,0-2.4,0-4.8,0-7.2Z" style="fill: #b8b7b1;"/>
  <path d="M64.5,65.5h.1c8.6,0,17.1,0,25.7,0v.2c0,4.8,0,9.5,0,14.3,0,5.6,0,11.2,0,16.8v.2c-5.5,0-10.9,0-16.3,0-3.2,0-6.4,0-9.5,0,0-7.3,0-14.3,0-21.6,0-3.2,0-6.5,0-9.7Z" style="fill: #b8b7b1;"/>
  <path d="M.1,65.6c.4,0,.8,0,1.2,0,2.4,0,4.9,0,7.3,0h.2c0,.9,0,1.8,0,2.6,0,20.1,0,40.1,0,60.2,0,.3,0,.8,0,1.1-2.9,0-5.8,0-8.7,0h0c.2-.5,0-1,0-1.5,0-20.3,0-40.6,0-60.9,0-.5,0-1,0-1.4Z" style="fill: #b8b7b1;"/>
  <path d="M9.8,97.9c3.3,0,6.6,0,9.9,0,6.2,0,12.4-.1,18.5,0,3.5,0,7.1,0,10.6,0,.2,0,.5,0,.8,0,0,10.4,0,20.9,0,31.4-1.8,0-3.7,0-5.6,0-6.3,0-12.6,0-18.9,0-4.9,0-9.7,0-14.6,0-.3,0-.6,0-.8,0,0-10.2,0-20.3,0-30.5,0-.3,0-.6,0-.9Z" style="fill: #b8b7b1;"/>
  <path d="M50.5,97.9c13.2,0,26.5,0,39.7,0,0,.4,0,.9,0,1.4,0,10,0,19.9,0,29.9v.2c-13.2,0-26.6,0-39.8,0,0-8.9,0-17.7,0-26.6,0-1.6,0-3.3,0-4.9Z" style="fill: #b8b7b1;"/>
  <path d="M91.9,129.3c2.7,0,5.4,0,8.1,0v.5c-2.7,0-5.6,0-8.3,0-.4-.2-.1-.5.2-.5Z" style="fill: #6d6d67;"/>
  <path d="M0,130.3c.5,0,1,0,1.5,0,2.4,0,4.8,0,7.2,0,0,.1,0,.3,0,.5,0,1.2,0,2.5,0,3.7,0,18.3,0,36.6,0,54.9,0,1.5,0,3,0,4.5h-.2c-2.8,0-5.5,0-8.3,0h-.2c0-.4,0-.8,0-1.1,0-20.6,0-41.3,0-61.9,0-.2,0-.4,0-.7h0Z" style="fill: #b8b7b1;"/>
  <path d="M35.6,130.3c0,1.5,0,3.1,0,4.7,0,8.9,0,17.7,0,26.6v.2c-5.5,0-11,0-16.4,0-3.1,0-6.2,0-9.3,0h-.1c0-10.5,0-20.9,0-31.3,1.6,0,3.3,0,5,0,7,0,13.8-.1,20.8-.1Z" style="fill: #b8b7b1;"/>
  <path d="M36.5,130.4c6.7,0,13.3,0,20,0,2.4,0,4.7,0,7.1,0h.1c0,5.6,0,11.2,0,16.8,0,4.9,0,9.7,0,14.6-.1,0-.3,0-.4,0-9,0-17.7,0-26.7,0-.1-.4,0-.9,0-1.4,0-6.9,0-13.8,0-20.7,0-3.1,0-6.2,0-9.3Z" style="fill: #b8b7b1;"/>
  <path d="M64.5,130.3c1.2-.1,2.4,0,3.6,0,7.4,0,14.8,0,22.2,0,0,.2,0,.4,0,.6,0,10.2,0,20.4,0,30.7v.2c-8.6,0-17.2,0-25.7,0v-.2c0-8.8,0-17.6,0-26.4,0-1.6,0-3.2,0-4.8Z" style="fill: #b8b7b1;"/>
  <path d="M91.3,130.3c.2,0,.5,0,.8,0,2.6,0,5.3,0,7.9,0v63.7c-2.9,0-5.7,0-8.6,0h-.1c0-16,0-31.9,0-47.9,0-5.3,0-10.5,0-15.8Z" style="fill: #b8b7b1;"/>
  <path d="M28,162.8c2.9,0,5.7-.1,8.6,0,4.3,0,8.7,0,13,0,0,7,0,14,0,21,0,3.4,0,6.8,0,10.1-.3.2-.7,0-1,.1-3.9,0-7.8,0-11.8,0-4.4-.1-8.7,0-13.1,0-2.2,0-4.3,0-6.5,0-2.5,0-5.1,0-7.6,0,0-.3,0-.6,0-.9,0-10.1,0-20.2,0-30.3h.2c2.7,0,5.4,0,8.1,0,3.3,0,6.6,0,9.9,0Z" style="fill: #b8b7b1;"/>
  <path d="M50.5,162.8c1.5,0,3,0,4.4,0,6.1-.1,12.3,0,18.4,0,5.6,0,11.3,0,16.9,0v.2c0,7.2,0,14.5,0,21.7,0,3.1,0,6.3,0,9.4-13.3,0-26.3,0-39.6,0h-.2c0-10,0-19.9,0-29.8,0-.5,0-1.1,0-1.5Z" style="fill: #b8b7b1;"/>
  <path d="M63.7,195c0,10.2,0,21,0,31.3-1.8,0-3.7,0-5.6,0-7.2,0-14.4,0-21.5,0v-.2c0-2.2,0-4.4,0-6.6,0-8.1,0-16.3,0-24.4h.1c6.5,0,13,0,19.5,0,2.5,0,5,0,7.5-.1Z" style="fill: #b8b7b1;"/>
  <path d="M91.4,195c2.9,0,5.7,0,8.6,0v63.5c-2.9,0-5.7,0-8.6,0v-.2c0-20.9,0-42.2,0-63.1h0Z" style="fill: #b8b7b1;"/>
  <path d="M.1,195.1c2.9,0,5.7,0,8.6,0,0,21.1,0,42.2,0,63.3-2.9,0-5.8,0-8.6,0,0-.2,0-.4,0-.6,0-20.8,0-41.7,0-62.5v-.2Z" style="fill: #b8b7b1;"/>
  <path d="M9.8,195.1c7.9,0,15.9,0,23.8,0,.6,0,1.4-.1,2,0,0,7.8,0,15.8,0,23.7,0,2.5,0,4.9,0,7.4v.2c-8.4,0-16.6,0-24.9,0-.3,0-.7,0-1,0,0-10.4,0-20.8,0-31.2Z" style="fill: #b8b7b1;"/>
  <path d="M64.5,195.2h.1c8.3,0,16.6,0,24.8-.1.3,0,.6,0,.9,0v.2c0,10.3,0,20.6,0,30.9v.2c-8.6,0-17.2,0-25.7,0v-.2c0-8.9,0-17.7,0-26.6,0-1.5,0-3,0-4.4Z" style="fill: #b8b7b1;"/>
  <path d="M9.8,227.4c5.7,0,11.2,0,16.8,0,7.4,0,14.8,0,22.2,0,.2,0,.5,0,.8,0,0,10.3,0,20.7,0,31-.4,0-.8,0-1.1,0-9.4,0-18.8,0-28.1,0-3.5,0-6.9,0-10.4,0h-.2c0-10.1,0-20.2,0-30.2,0-.3,0-.6,0-.9Z" style="fill: #b8b7b1;"/>
  <path d="M50.5,227.4c13.2,0,26.5,0,39.7,0v.2c0,9.8,0,19.5,0,29.3,0,.5,0,1.1,0,1.6-13.2,0-26.5,0-39.7,0,0-10,0-20.1,0-30.1,0-.3,0-.6,0-1Z" style="fill: #b8b7b1;"/>
  <path d="M9.3,259.5c0,.9,0,1.8,0,2.6,0,9.1,0,18.2,0,27.3,0,.5-.1.9.2,1.3,0,0-.2,0-.3,0,0-.9,0-1.7,0-2.6,0-9.4,0-18.8,0-28.1v-.3c0,0-.3,0-.3,0-.2.9,0,2-.1,3,0,6.5,0,13.2,0,19.7,0,5.9,0,11.7,0,17.6H.1c0-.3,0-.7,0-1,0-13,0-26.2,0-39.3v-.2c2.6,0,5.1,0,7.7,0,.4,0,.8,0,1.2.1.1,0,.3-.1.4-.2Z" style="fill: #b8b7b1;"/>
  <path d="M26.8,259.4c2.9,0,5.9,0,8.8,0,0,10.3,0,20.9,0,31.2h0c-3.6,0-7.1.2-10.7.2-4.9,0-9.7,0-14.6,0-.2,0-.3,0-.5,0,0-.3,0-.6,0-.9,0-10.1,0-20.2,0-30.3.7-.1,1.4,0,2.1,0,5,0,9.9,0,14.9-.1Z" style="fill: #b8b7b1;"/>
  <path d="M36.5,259.4c4.8,0,9.6,0,14.3,0,2.9,0,5.8,0,8.8,0,1.3,0,2.8,0,4.1,0,0,10.4,0,20.8,0,31.2-.1,0-.3.1-.5,0-5.7.1-11.5,0-17.2,0-3.1,0-6.3,0-9.4,0v-.2c0-8.1,0-16.3,0-24.4,0-2.3,0-4.5,0-6.8Z" style="fill: #b8b7b1;"/>
  <path d="M64.5,259.4c.1,0,.3,0,.4,0,8.4,0,16.9,0,25.3,0v.2c0,10.3,0,20.7,0,31h0c-4.2,0-8.5.1-12.7.1-4.3,0-8.7,0-13,0,0-10.4,0-20.9,0-31.3Z" style="fill: #b8b7b1;"/>
  <path d="M91.4,259.4c2.9,0,5.7,0,8.6,0v40.6h-8.7c0-13.5,0-27,0-40.4v-.2Z" style="fill: #b8b7b1;"/>
  <path d="M9.8,291.8c1.6,0,3.3,0,5,0,11.6,0,23.2,0,34.8,0h.1c0,2.8,0,5.5,0,8.2H9.8c0-2.7,0-5.5,0-8.2Z" style="fill: #b8b7b1;"/>
  <path d="M50.5,291.8c13.1,0,26.7,0,39.8,0,0,.3,0,.7,0,1,0,2.4,0,4.8,0,7.2h-39.8c0-2.7,0-5.5,0-8.2Z" style="fill: #b8b7b1;"/>
</svg>
`,

infra_radweg: `
<svg id="infra_radweg" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,0h5.5,0c0,.2-.1.4-.2.6,0,72.7,0,145.4,0,218.2,0,25.7,0,51.4,0,77.1,0,1.2,0,2.5,0,3.7v.4c.1,0,.1,0,.1,0H0V0Z" style="fill: #b2b1ad;"/>
  <path d="M5.5,0h88.7v.3c-.1.3-.2.6-.2.9,0,4.6,0,9.1,0,13.7,0,4.4,0,8.7,0,13.1,0,1.7,0,3.4,0,5.1,0,1.8,0,3.5,0,5.3,0,9.1,0,18.3,0,27.3,0,.6,0,1.2.1,1.8h0c-.2,1.1,0,2.2-.1,3.3,0,.7,0,1.3.1,2h0c0,.3,0,.5-.1.7,0,5.4,0,10.8,0,16.2,0,1.9,0,3.8,0,5.7,0,.9,0,1.8,0,2.7,0,.7.1,1.4-.2,2,.4.8,0,1.6.3,2.3h0c-.3.7,0,1.6-.1,2.3,0,2.3,0,4.6,0,6.8,0,.6,0,1.2.1,1.8h0c-.2,1.2,0,2.5-.1,3.6,0,4.4,0,8.7,0,13.1,0,5.9,0,11.8,0,17.8,0,.6,0,1.2.1,1.8h0c0,.6-.1,1-.1,1.5,0,5.5,0,11.1,0,16.6,0,1.2,0,2.3,0,3.5,0,2.5,0,5.1,0,7.6,0,4.9,0,9.9,0,14.8,0,1.6,0,3.1,0,4.7,0,1.6,0,3.2,0,4.8,0,1.6,0,3.3,0,4.9,0,9.7,0,19.7,0,29.5,0,.6,0,1.1,0,1.7,0,3.1,0,6.1,0,9.2,0,.5,0,.9.2,1.3h0c-.2.9-.1,1.7-.1,2.5,0,1.6,0,3.1,0,4.7,0,2.3,0,4.6,0,6.8,0,3.8,0,7.5,0,11.3,0,.4-.1.8-.2,1.2,0,0,.1.2.2.2.1,1.8,0,3.6,0,5.4,0,2,0,3.9,0,5.9,0,1.1,0,2.2,0,3.3,0,1.2,0,2.5,0,3.7,0,.4,0,.8.1,1.2h0c-.2.6-.1,1.1-.1,1.7,0,.6,0,1.3,0,1.9h.1c0,0,.1.2.1.2h0c0,.1-88.9.1-88.9.1h0c0-.2.1-.4.1-.6,0-28.2,0-56.4,0-84.6,0-1.6,0-3.1,0-4.7,0-1.4,0-2.7,0-4.1,0-9.8,0-19.5,0-29.3,0-1.4,0-2.9,0-4.3,0-13.6,0-27.2,0-40.8,0-2.5,0-5.1,0-7.6,0-4.1,0-8.2,0-12.3,0-36.8,0-73.7,0-110.5,0-.4,0-.7-.1-1.1h0Z" style="fill: #9f5044;"/>
  <path d="M94.2,0h.1c0,100,0,199.9,0,299.9h-.1c0-1.3,0-2.5,0-3.6h0c0-1.2,0-2.3,0-3.5,0-12.6,0-25.3,0-37.9,0-1.6,0-3.3,0-4.9h0c0-.6,0-1,0-1.5,0-30.9,0-61.8,0-92.8,0-2,0-3.9,0-5.9h0c0-.6,0-1,0-1.5,0-7.6,0-15.1,0-22.7,0-3.5,0-7,0-10.5,0-.5,0-1.1,0-1.6h0c0-.7,0-1.3,0-1.9,0-2.5,0-5.1,0-7.6s0-.9,0-1.4h0c0-.7,0-1.3,0-1.9,0-8.7,0-17.3,0-26,0-.6,0-1.2,0-1.8h0c.1-1.3,0-2.5,0-3.7,0-.5,0-1.1,0-1.6h0c.1-1.7,0-3.4,0-5,0-19.3,0-38.9,0-58.2,0-1.3,0-2.7,0-4v-.3Z" style="fill: #905349;"/>
  <path d="M94.3,0h5.7v300h-5.6c0-.2,0-.4,0-.6,0-99.6,0-199.2,0-298.8,0-.2,0-.4-.2-.5h0Z" style="fill: #b2b1ad;"/>
  <path d="M5.5,0c0,100,0,199.9,0,299.9v-.4c-.2-1.2-.1-2.5-.1-3.7,0-25.7,0-51.4,0-77.1,0-72.7,0-145.4,0-218.2,0-.2,0-.4.2-.5Z" style="fill: #dcd2cd;"/>
  <path d="M5.5,0c.1.4.2.7.1,1.1,0,36.8,0,73.7,0,110.5,0,4.1,0,8.2,0,12.3,0,2.5,0,5.1,0,7.6,0,13.6,0,27.2,0,40.8,0,1.4,0,2.9,0,4.3,0,9.8,0,19.5,0,29.3,0,1.4,0,2.7,0,4.1,0,1.6,0,3.1,0,4.7,0,28.2,0,56.3,0,84.6,0,.2,0,.4-.1.5,0-100,0-199.9,0-299.9Z" style="fill: #793b31;"/>
  <path d="M94.3,0c.1.1.2.3.2.5,0,99.6,0,199.2,0,298.8,0,.2,0,.4,0,.6h0,0c0-100.1,0-200,0-299.9Z" style="fill: #f6efeb;"/>
  <path d="M94.2.3c0,1.3,0,2.6,0,4,0,19.3,0,38.9,0,58.2,0,1.6,0,3.3,0,4.9-.2-.6-.1-1.2-.1-1.8,0-9.1,0-18.2,0-27.3,0-1.8-.1-3.5,0-5.3,0-1.7,0-3.4,0-5.1,0-4.4,0-8.7,0-13.1,0-4.6,0-9.1,0-13.7,0-.3,0-.6.1-.9Z" style="fill: #9c3b2e;"/>
  <path d="M94.2,67.5c0,.5,0,1.1,0,1.6,0,1.2,0,2.4,0,3.6-.2-.7-.2-1.3-.1-2,0-1-.1-2.2.1-3.2Z" style="fill: #9f3d2f;"/>
  <path d="M94.2,72.8c0,.6,0,1.2,0,1.8,0,8.7,0,17.3,0,26,0,.6,0,1.2,0,1.8-.3-.8,0-1.5-.3-2.3.3-.7.1-1.3.2-2,0-.9,0-1.8,0-2.7,0-1.9,0-3.8,0-5.7,0-5.4,0-10.8,0-16.2,0-.2,0-.4.1-.6Z" style="fill: #9c3c2e;"/>
  <path d="M94.2,102.5c0,.5,0,.9,0,1.4,0,2.5,0,5.1,0,7.6,0,.6,0,1.2,0,1.8-.1-.6-.1-1.2-.1-1.8,0-2.3,0-4.6,0-6.8,0-.7-.2-1.6.1-2.2Z" style="fill: #9c3a2d;"/>
  <path d="M39.7,104.6c.3,0,.5,0,.8.2-.9,0-1.9,0-2.9,0-.3.2-.6.1-.8.3v-.2c.9-.4,1.9-.3,2.9-.3Z" style="fill: #6f2c20;"/>
  <path d="M40.8,104.7c.6-.1,1.2,0,1.8,0,.8,0,1.6-.1,2.4.1,0,1.1,0,2.2,0,3.3,0,.4,0,.9-.2,1.1-2.2,0-4.4,0-6.5,0-.4,0-.6.4-1,.3.2-.2.4-.3.6-.5.2,0,.4,0,.5,0,2.1,0,4.2-.2,6.3,0,0-.4,0-.8,0-1.3.2-.7.1-1.6.1-2.4,0-.2,0-.3-.1-.4-1.4,0-2.8,0-4.2,0l.2-.2Z" style="fill: #8a4d42;"/>
  <path d="M37.6,104.9c1,0,2,0,2.9,0h0c1.4,0,2.8,0,4.2,0,0,.9,0,1.9,0,2.8,0,.4,0,.8,0,1.3-2.1-.2-4.2,0-6.3,0,0-.4.4-.3.7-.3,1.8,0,3.7,0,5.5,0,0-1.1,0-2.3,0-3.4-2,0-3.9,0-5.9,0-.9.1-1.6,0-2.4.6-.5.3-.9,1-1.4,1,0,0,.1-.2.2-.3.2-.2.3-.4.5-.5.4-.3.7-.6,1.1-.8.3-.2.6,0,.8-.3Z" style="fill: #f3eae6;"/>
  <path d="M44.7,104.9c0,.1.1.2.1.4,0,.8.1,1.7-.1,2.4,0-.9,0-1.9,0-2.8Z" style="fill: #7a5c57;"/>
  <path d="M38.7,105.2c2,0,3.9,0,5.9,0,0,1.1,0,2.3,0,3.4-1.8,0-3.7,0-5.5,0-.3,0-.6-.1-.7.3-.2,0-.4,0-.5,0-.2.1-.4.3-.6.5h0c-.2.2-.2.4-.3.7l-.2-.2c-.6,2.5-1.1,5.1-1.7,7.6,0,0,.2-.1.3-.2v.3c1.9,0,3.8,0,5.7,0,1.4.1,2.8,0,4.3,0,1.7,0,3.2,0,4.9,0,1.1.2,2.1,0,3.2,0,.5,0,1,0,1.5,0,.9.1,1.8.1,2.8,0,.8.2,1.6,0,2.4,0,.2,0,.3,0,.4-.3,0-.1,0-.2.1-.4.2-.6.3-1.3.5-1.9.1-.6.4-1.2.5-1.7h-.5c-.5-.3-1.4-.4-2,0h0c-.3-.3-.6-.1-1-.2-.7,0-1.5-.1-1.9-1.1-.2-.6,0-1.4,0-2,.1-.2.3-.4.5-.5.3,0,.6,0,.9,0,2.6,0,5.3,0,7.9,0,.9,0,1.8,0,2.7.1,0,0,0,.1.1.2-.1.7.3,1.2.1,1.9,0,.5-.4.9-.8,1.1-.8.1-1.7.2-2.5.3-.3.3-.4,1-.6,1.4-.3,1.3-.7,2.5-1,3.8v.4c.1.5.4.8.6,1.3-.1.4,0,.4,0,.7.5,1,.8,2,1.3,3.1.3.7.5,1.5.8,2.2.4.9.7,1.9,1.1,2.7l.3.2c.2.4.3,1.2.7,1.3h.2c1-.1,2-.6,2.9-.5.1,0,.3,0,.3-.4,0,0,.2,0,.2,0,0,.1,0,.3,0,.4.9,0,1.8-.1,2.7.1.3,0,.5.2.8-.1h.3s0,.2,0,.2v.2c1.3.3,2.7,1,3.9,1.9.8.6,1.6,1.3,2.3,2.1,0,.1.2.2.4,0,.2.2.3.4.5.6h0c0,0,0,.2,0,.2.1.3.5.9.8.8,0,0,0,.1,0,.2,0,.5.2.7.4,1.1.3.5.5,1,.8,1.5h.2c.3.5.5,1.1.8,1.7-.1.2-.1.4,0,.6.7,2,1.1,4,1.3,6.2,0,2.1,0,4.1-.3,6.2-.3,1.6-.7,3.2-1.4,4.7-.1.2,0,.3,0,.5,0,.2-.1.3-.2.5-.3-.1-.3.3-.5.5-.2.4-.5.7-.5,1.2h0c0,.2-.2.3-.3.4-.3,0-.4.2-.6.4-.4.6-.9,1.1-1.2,1.7v.3s0,0,0,0c0,0-.1,0-.2.2-.2.2-.4.4-.6.6-.2.2-.4.3-.6.5-.5,0-.7.3-1.1.6-.9.7-1.9,1.2-2.9,1.6-.9.4-1.8.8-2.8.7-.4,0-.6,0-1,.4h0c0-.3-.2-.4-.3-.3-1.7.2-3.5-.3-5.1-1.1-.2,0-.3,0-.5,0h-.1s0-.1,0-.1h0c-.1-.3-.2-.3-.3,0h0c-.1-.1-.3-.2-.4-.3h.2c-.4-.4-.8-.8-1.2-1.1-.1,0-.3-.1-.5,0-.2-.2-.4-.3-.6-.5-.4-.4-.8-.8-1.2-1.2,0-.4-.2-.5-.3-.8-.3-.4-.6-.9-1-1.2h-.1s0,0,0,0c-.1-.3-.3-.5-.4-.8-.1-.3-.3-.6-.5-.8-.4-.7-.7-1.4-1-2.1.1-.6-.1-1-.3-1.5-.3-1.1-.7-2.3-.8-3.5h-.2c0,0,0,0,0-.1.2-.4.2-.8,0-1.1-.2-.2-.4-.2-.6-.2-1.7,0-3.5,0-5.2,0-.3,0-.6-.2-1-.3-.2,0-.3,0-.5,0h-.2s0,0,0,0v-.3c-.3-.4-.6-.8-.9-1.3-.2-.2-.3-.5-.6-.5h0s-.1-.1-.1-.1h0c0,0,0-.4,0-.4-.1-.3-.4-.6-.6-.9h-.1s0,0,0,0c-.6-1-1.3-1.9-1.9-3,0-.4-.3-1.1-.7-1,0-.1-.2-.3-.3-.4.1-.5,0-.7-.4-.6-.3-.3-.5-.7-.7-1v-.2c0-.4-.2-.9-.5-.7h0s0-.2,0-.2h0c.1-.4-.3-1.2-.6-1h0s0-.2,0-.2c-.1-.3-.3-.5-.5-.8,0,0,0-.2-.1-.2-.3-.4-.5-.8-.8-1.2,0,0-.1-.1-.2-.2-.1-.2-.2-.4-.3-.5h-.1c-.2-.4-.4-.7-.6-.9,0-.5-.1-.7-.4-1-.2-.2-.3-.5-.6-.4-.2-.3-.4-.5-.6-.8,0,0,0-.1,0-.2,0-.4-.3-1.1-.7-1h0s-.2-.3-.2-.3c0-.1-.1-.2-.2-.3,0-.6-.3-.9-.6-1.3h-.2c-.1-.2-.3-.4-.4-.6.1-.4-.1-1-.5-.7,0-.2-.2-.3-.3-.5,0-.5-.3-.8-.6-1.1h-.2c-.2-.2-.3-.4-.5-.6-.2-.3-.3-.5-.4-.9h-.4c-.3,1-.4,2-.6,3,0,.2,0,.5.1.7-.1.5-.2,1-.3,1.4.2.2.5.3.7.5v.3c.6.3,1.1.8,1.7,1.2h.2c0,0,0,0,0,0,.3.3.6.5.9.8h0c0,.1.2.2.3.3-.1.4.2.5.3.8.4.4.7,1,1.1,1.4h.2s0,0,0,0v.3c0,.5.4.9.6,1.3h.2s0,0,0,0v.2c0,.5.3.9.5,1.3h.2c.1.2.2.4.3.7-.2.4.1.9.2,1.3.5,1.3.8,2.7,1,4.2.3,1.1.2,2.3.3,3.5,0,1.1,0,2.3-.2,3.3,0,.2,0,.5.1.7h0c-.3.2-.3.6-.4.9-.5,2.5-1.5,4.9-2.8,7-.2.4-.5.6-.4,1.1-.2.3-.4.5-.6.8v.2c-.2,0-.3.1-.3.2-.4,0-.6.4-.9.7-.3.4-.7.6-1.1,1v.3c0,0,0,0,0,0-.3.1-.6.5-.9.7h0c-.3-.2-.6.2-1,.4-1.4,1-2.8,1.4-4.3,1.7-.7,0-1.4.3-2.1.2-.5,0-1.1-.2-1.7-.1l-.2.2c-.2,0-.3,0-.5,0,0,0,.2-.2.3-.2-1.1-.2-2.1-.5-3.1-1.1-.3-.2-.5-.5-.9-.2,0,0,0,0-.1-.1-.1-.6-.7-.7-1.1-1.1-.3-.2-.7-.7-1.1-.7h-.2c.3-.5-.3-.9-.5-.7-.1-.1-.2-.2-.3-.4v-.3c-.2-.3-.4-.7-.7-.9h-.2s0,0,0,0c-.1-.3-.4-.5-.5-.8,0-.3-.2-1-.5-.7-.1-.2-.2-.4-.4-.6,0-.2-.2-.4-.3-.6v-.3c-.1-.5-.3-1-.6-1.5h-.2c0,0-.1-.2-.2-.4.2-.4,0-.8-.1-1.2-.6-1.6-.8-3.3-1-5,0-1.4,0-2.7,0-4.1,0-.8.3-1.5.3-2.3v-.2c-.1-.1-.1-.2,0-.4h.2c.2-1.3.7-2.7,1.2-4,.3-.7.7-1.3,1-2.1v-.3c0-.2.1-.4.3-.6.4.3.6-.3.5-.7,0,0,0-.1.1-.2.3.2.5-.4.7-.6,1.8-2.6,4.2-4,6.8-5,1.5-.7,3-.5,4.6-.5.4,0,.7.2,1,.2v-.2s.1-.3.1-.3l.2.2c.3-2.1.9-4.1,1.3-6.1.3-1.1.5-2.3.8-3.5,0-.4.3-.8,0-1.2,0-.2,0-.4,0-.5v.5s.2,0,.2,0c.4-1.7.7-3.4,1.1-5,.2-.9.3-1.9.5-2.8,0-.2,0-.4,0-.7v-.2c0,0,0,0,0,0l.2.2c.1-.5.2-1.1.4-1.7.1-.4.4-.7.4-1.2,0-.1.1-.2.2-.3.5,0,.9-.7,1.4-1,.8-.6,1.5-.5,2.4-.6Z" style="fill: #d6d4d1;"/>
  <path d="M35.6,106c-.2.2-.4.3-.5.5-.2-.3.3-.9.5-.5Z" style="fill: #7e2e24;"/>
  <path d="M34.6,107.1c0,.5-.2.8-.4,1.2-.2.5-.3,1.1-.4,1.7l-.2-.2c0-.2.1-.5.2-.7,0-.4.2-.7.3-1.1.2-.3.3-.6.5-.9Z" style="fill: #f4e9e5;"/>
  <path d="M33.9,107.9h.2c-.1.4-.2.8-.3,1.2-.3-.4,0-.8,0-1.2Z" style="fill: #7f3e33;"/>
  <path d="M57,109c1.2,0,2.4,0,3.5,0-.2.2-.6.1-.8.2-.9,0-1.8,0-2.7,0h0Z" style="fill: #6c2216;"/>
  <path d="M63.1,109c1.6,0,3.2,0,4.7,0v.3c-.4-.1-.6-.1-.8,0-1.2-.2-2.3.2-3.5,0-.4.2-.7,0-1.1.1.2-.1.4-.3.6-.4Z" style="fill: #874338;"/>
  <path d="M67,109.3c.2-.1.4-.1.6,0,.2,0,.4.2.5.3-.9,0-1.8-.2-2.7-.1-2.6,0-5.3,0-7.9,0-.3,0-.6,0-.9,0,.5-.5,1.2-.1,1.8-.3.7,0,1.4,0,2.1.1.6-.1,1.2,0,1.8,0,.4-.2.7,0,1.1-.1,1.1.2,2.3-.2,3.5,0Z" style="fill: #f5eae6;"/>
  <path d="M33.5,109.5l.2.2v.2c-.2.6-.3,1.2-.4,1.8-.3-.6.2-1.6.2-2.3Z" style="fill: #742f23;"/>
  <path d="M37.3,109.5c0,.7-.2,1.4-.4,2.2-.1.4,0,.8-.4.9.2-.8.3-1.7.5-2.5,0-.2.1-.4.3-.6Z" style="fill: #894b42;"/>
  <path d="M36.8,110l.2.2c-.2.8-.3,1.6-.5,2.5v.2c-.3.9-.5,2-.7,3h0c-.1.4-.2.8-.2,1.2,0,.1,0,.2-.1.3,0,0-.2.2-.3.2.6-2.5,1.1-5.1,1.7-7.6Z" style="fill: #efe8e5;"/>
  <path d="M68.3,109.9l.2.3c0,.3.2.5.2.8,0,.8-.1,1.3-.6,1.8-.8.7-2,.4-2.9.5-.2.3-.3.7-.4,1,0,.2-.1.4-.2.7-.3,1.3-.7,2.5-1.1,3.8v-.4c.2-1.3.6-2.5.9-3.8.1-.5.2-1.1.6-1.4.8-.1,1.7-.1,2.5-.3.4-.2.8-.6.8-1.1.2-.7-.2-1.2-.1-1.9Z" style="fill: #ede5e2;"/>
  <path d="M68.7,111c0-.3-.1-.6-.2-.8.4-.4.6.6.2.8Z" style="fill: #824339;"/>
  <path d="M33.6,110c.1.2.1.4,0,.7-.2.9-.3,1.9-.5,2.8-.4,1.7-.7,3.3-1.1,5h-.1c0,0,0-.4,0-.4.1-.5.2-.9.3-1.4.1-.7.4-1.4.5-2.2,0-.4.2-.7.3-1.1.1-.5.3-1.1.3-1.6,0-.6.2-1.2.4-1.8Z" style="fill: #eee6e3;"/>
  <path d="M56.3,110c0,.6-.2,1.4,0,2,.4.9,1.2,1,1.9,1.1.4,0,.7-.1,1,.2h-.3c-.3,0-.6.1-1,0-.3,0-.5,0-.8-.1-.1,0-.3-.1-.4-.2-.2-.2-.4-.4-.6-.7-.2-.8-.3-1.5.1-2.2Z" style="fill: #eee5e3;"/>
  <path d="M56.1,112.3c.1.3.3.5.6.7-.3.3-.8-.4-.6-.7Z" style="fill: #7d3429;"/>
  <path d="M36.5,112.8c0,1-.2,2-.5,2.9h-.2c.3-.9.4-1.9.7-2.9Z" style="fill: #814034;"/>
  <path d="M68.1,112.8v.3c-.7.7-1.9.4-2.7.5-.3,0-.3.6-.4.9l-.2-.2c0-.3.2-.7.4-1,.9,0,2.2.2,2.9-.5Z" style="fill: #7b372d;"/>
  <path d="M61.1,113.3c-.7,0-1.3,0-2,0,.5-.4,1.4-.3,2,0Z" style="fill: #fbf0ec;"/>
  <path d="M32.7,113.3h.2c0,.5-.2.8-.3,1.2-.3-.4,0-.8,0-1.2Z" style="fill: #7f3e33;"/>
  <path d="M57.1,113.2c.3.1.5,0,.8.1-.1.2-.3.2-.5.2-.2,0-.6,0-.3-.3Z" style="fill: #6f2c22;"/>
  <path d="M58.9,113.3h.3s0,0,0,0c.7,0,1.3,0,2,0h.5c0,.6-.4,1.2-.5,1.7-.2.6-.3,1.3-.5,1.9-.2-.6.2-1.1.3-1.7.1-.6.4-1.1.5-1.8-.7,0-1.3,0-2,0-.2,0-.4,0-.5-.2Z" style="fill: #77342a;"/>
  <path d="M94.2,113.4c0,.5,0,1.1,0,1.6,0,3.5,0,7,0,10.5,0,7.6,0,15.1,0,22.7,0,.5,0,1,0,1.4-.2-.6-.1-1.2-.1-1.8,0-5.9,0-11.8,0-17.8,0-4.4,0-8.7,0-13.1,0-1.2,0-2.4.1-3.6Z" style="fill: #9d3c2e;"/>
  <path d="M64.6,114.9c.1.3.1.5,0,.8-.3,1-.6,2-.8,3,.1.5.4,1,.6,1.5v.3c-.2-.2-.2-.4-.3-.6-.2-.5-.4-.8-.5-1.3.4-1.2.7-2.5,1.1-3.8Z" style="fill: #76332a;"/>
  <path d="M35.8,115.9c.3.4,0,.8,0,1.3h-.2c0-.5.1-.9.2-1.3Z" style="fill: #7a3c30;"/>
  <path d="M32,116.6h.2c0,.6-.2,1.1-.3,1.5,0,.2,0,.3,0,.5-.2.8-.4,1.6-.5,2.4-.1-.4-.1-.6,0-1,.3-1.1.5-2.3.7-3.4Z" style="fill: #783025;"/>
  <path d="M60.5,117.3c0,.2-.2.3-.4.3-.8,0-1.7.1-2.4,0-.9.1-1.9,0-2.8,0-.5,0-1,0-1.5,0-1.1,0-2.1.1-3.2,0-1.7.2-3.2,0-4.9,0-1.4,0-2.9,0-4.3,0-1.9,0-3.8,0-5.6,0v-.3c7.2,0,14.5,0,21.7,0,1.1,0,2.3,0,3.4,0Z" style="fill: #672016;"/>
  <path d="M31.8,118.7c.2.4,0,.8,0,1.2-.3,1.1-.5,2.3-.8,3.5-.4,2-1,4-1.3,6.1l-.2-.2c.1-.6.2-1.2.4-1.9h0c.2-.9.4-1.7.6-2.6.1-.6.3-1.2.4-1.9.2-.4.2-.8.3-1.2,0-.2,0-.5.1-.8.2-.8.4-1.6.5-2.4Z" style="fill: #f0e8e5;"/>
  <path d="M64.1,120c0,.2.2.4.3.6,0,.1.1.2.2.3,0,.3.2.5.3.7.1.5.4,1,.6,1.5.5,1.3,1.2,3.1,1.7,4.5.1.4.3.8.5,1.3l-.3-.2c-.4-.9-.7-1.9-1.1-2.7-.3-.7-.5-1.5-.8-2.2-.4-1-.7-2.1-1.3-3.1-.2-.3-.2-.3,0-.7Z" style="fill: #efe8e5;"/>
  <path d="M59.4,121c0,.4.2.8,0,1.1-.4,1.2-.7,2.5-1.1,3.7-.4,1.6-1,3.1-1.4,4.7,0,.2-.2.3-.4.4.2-.7.4-1.5.7-2.2.2-1,.7-1.8.8-2.8.5-1.3.8-2.8,1.3-4.2-.8,0-1.6,0-2.5,0h0c-.2,0-.3,0-.4,0h0c-2.1,0-4.2,0-6.2,0-1.1,0-2.1,0-3.2,0-.7,0-1.3,0-2,0-1.2,0-2.5,0-3.7,0v-.3c.7-.1,1.4,0,2,0,1.3,0,2.7,0,4,0,1,.1,2,0,3.1,0,1.4,0,2.7,0,4.1,0,1.2,0,2.3,0,3.5,0,.6,0,1.1.3,1.5-.3Z" style="fill: #ecdfdb;"/>
  <path d="M64.5,120.9c.4-.1.4.3.3.7-.1-.2-.2-.5-.3-.7Z" style="fill: #7f4238;"/>
  <path d="M35.3,121.3c1.2,0,2.3,0,3.5,0v.2c-.2,0-.4.1-.6.2-.5,0-1,0-1.5,0-.5,0-.9,0-1.4-.2v-.2Z" style="fill: #ece4e2;"/>
  <path d="M39.3,121.4c.6,0,1.2-.1,1.8,0,0,.1-.1.3-.3.4-.5,0-1.1,0-1.6,0h-.3c.1-.2.2-.3.4-.3Z" style="fill: #eddfdb;"/>
  <path d="M30.9,121.7l.2.2c-.1.4-.1.8-.3,1.2-.2-.4,0-.9,0-1.3Z" style="fill: #78382c;"/>
  <path d="M35.2,121.6c.5,0,1,0,1.4,0,.5,0,1,0,1.5,0,.2,0,.5,0,.7,0h.2s-.2.2-.2.2c-1.1.1-2.1,0-3.2,0,.1.4.4.6.6,1v.3c-.3-.5-.8-1-1.1-1.5Z" style="fill: #6f291e;"/>
  <path d="M39.1,121.7h0c.3.2.6.2,1,.2,1.5,0,3.1,0,4.6,0,.9,0,1.7,0,2.6,0,.8,0,1.6,0,2.4,0,.7,0,1.3,0,2,0,.7,0,1.4,0,2.1,0,.7,0,1.4.1,2.1,0l.3-.2h0c0,.3.3.3.4,0h0s.3.2.3.2c.6,0,1.2,0,1.8,0-.3,1.6-.9,3.1-1.3,4.6-.7,2.1-1.4,4.3-1.9,6.5-.2.9-.5,1.7-.8,2.5v.3c.1,0,0,.3,0,.3,0-.2-.1-.2-.2-.1-.4,1-.6,2.2-1,3.2v.3c.1.1.1.2,0,.3-.2-.5-.4,0,0,.2h0c-.3.3-.4.7-.5,1.1-.3,1.3-.7,2.6-1.1,3.9,0,.4-.2.7-.3,1-.2-.1-.3-.4-.5-.6h-.2c0,0-.1,0-.2-.1h0c0,0,0-.3,0-.3-.7-1.1-1.5-2.3-2.3-3.3-.1-.1-.2-.2-.4-.2h0c0-.1,0-.5,0-.5-.4-.6-.8-1.2-1.2-1.8h-.2c0,0,0,0,0,0l-.2-.2c0-.1-.1-.3-.2-.4,0-.3,0-.5-.2-.7-.6-.9-1.2-2-1.9-2.9-.2-.2-.3-.9-.7-.7h0c0-.4,0-.5-.2-.8-1.1-1.5-2.1-3.1-3.1-4.6-1.1-1.4-1.9-3.1-3-4.4h-.2s0,0,0,0h0c0-.6-.3-1.1-.7-1.1,0,0,0-.2-.1-.2v-.3c-.2-.3-.5-.6-.6-1,1.1-.1,2.2,0,3.2,0l.2-.2Z" style="fill: #9f5045;"/>
  <path d="M39.2,121.7c.5,0,1.1,0,1.6,0,.1,0,.3,0,.4,0,1.2,0,2.5,0,3.7,0,.7,0,1.3,0,2,0,1.1,0,2.1,0,3.2,0,2,0,4.1,0,6.2,0l-.3.2c-.7.1-1.4,0-2.1,0-.7,0-1.4,0-2.1,0-.7,0-1.3.1-2,0-.8,0-1.6,0-2.4,0-.9,0-1.7,0-2.6,0-1.5,0-3.1,0-4.6,0-.4,0-.7,0-1-.2Z" style="fill: #6c2c21;"/>
  <path d="M56.3,121.7c.1,0,.3,0,.4,0-.1.3-.4.3-.4,0Z" style="fill: #6a2c20;"/>
  <path d="M56.9,121.7c.8,0,1.6,0,2.5,0-.4,1.4-.8,2.8-1.3,4.2-.1,1-.6,1.8-.8,2.8-.2.7-.5,1.5-.7,2.2h0c0,.5-.3.9-.3,1.3,0,.4-.3.7-.3,1.2-.2.5-.3,1-.5,1.5v.2c-.2.3-.3.5-.3.7v-.3c0-.9.4-1.7.6-2.5.6-2.2,1.2-4.4,1.9-6.5.4-1.5,1-3.1,1.3-4.6-.6,0-1.2,0-1.8,0l-.3-.2Z" style="fill: #7e3b31;"/>
  <path d="M65.6,123.2c.2.4.3.8.5,1.3.3,1,.8,1.9,1.1,2.9v.3c-.6-1.4-1.2-3.1-1.8-4.5h.2Z" style="fill: #7c352b;"/>
  <path d="M36.4,123.4c.4,0,.7.5.7,1-.2-.3-.5-.7-.7-1Z" style="fill: #813d32;"/>
  <path d="M61.8,123.7c.2,0,.3,0,.5,0,.6,1.3,1.1,2.8,1.6,4.2.3,1,.8,2,1.1,3,0,.3.3.5,0,.8-.3-.6-.5-1.2-.7-1.8-.1-.3-.2-.6-.3-.8-.3-.9-.6-1.8-1-2.6-.4-.8-.7-2-1.1-2.7-.2.6-.3,1.2-.6,1.8v.2s-.2-.3-.2-.3c.1-.6.3-1.2.5-1.9Z" style="fill: #f0e9e6;"/>
  <path d="M62,123.8c.4.7.8,1.9,1.1,2.7.4.8.6,1.8,1,2.6h-.2c-.6-1.5-1.1-3.2-1.8-4.7-.2.4-.2,1.1-.6,1.2.3-.6.3-1.2.6-1.8Z" style="fill: #7f3f35;"/>
  <path d="M37.4,124.5c1.1,1.3,1.9,3,3,4.4,1,1.6,2,3.1,3.1,4.6.2.3.2.4.2.8-.3-.5-.7-1-1.1-1.6h0c-.2-.5-.5-.8-.7-1.1-.1-.2-.3-.4-.4-.6-.2-.2-.3-.5-.5-.7,0,0,0-.2-.1-.2-.3-.4-.6-.8-.8-1.2-.4-.6-.8-1.2-1.2-1.7-.2-.3-.3-.5-.5-.8,0-.2-.2-.3-.3-.4-.3-.5-.6-.9-.9-1.3h.2Z" style="fill: #843b31;"/>
  <path d="M62,124.4c.7,1.5,1.2,3.3,1.8,4.8h.2c.1.2.2.4.3.7-.3.5.3,1.1.3,1.6,0,.2-.2.5-.3.7h0s-.3,0-.3,0c-.5.4-1,1-1.5,1.5-.5.7-1.2,1.3-1.6,2v.4c0,.2-.2.3-.3.4-.2,0-.3,0-.4.1-.7,1.2-1.3,2.5-1.7,3.8v.3c.1,0,0,0,0,0-.3,0-.3.5-.5.7-.1.4-.1.4,0,.8h0c-.4.2-.4.6-.5,1,0,.4-.2.7,0,1.1,0,.1,0,.3,0,.4v-.4s-.2,0-.2,0c0,.5-.2,1.3.1,1.8,0,.2,0,.5,0,.7h-.1c.1-.5-.3-.5-.1,0h-.1c-.5-.5-1.3-.1-1.9-.2,0-.5.4-1,.2-1.5,0-.3.2-.6.3-.9.4-.2.4-.6.5-1,0-.4.3-.8,0-1.2h0c.3,0,.6-.6.3-.9,0-.2,0-.4.2-.6.4-.2.4-.6.5-1,.3-1.2.7-2.3,1-3.4.8-2.6,1.5-5.3,2.3-8,.2-.7.4-1.3.6-2v-.3c0,0,0-.1,0-.1h.1s0-.1,0-.1h0c0-.1-.1-.2-.1-.2v-.2c.5,0,.5-.8.7-1.2Z" style="fill: #9f5044;"/>
  <path d="M37.1,124.6h0c.3.4.6.9.9,1.3-.3.1-.4-.2-.6-.4-.2-.3-.4-.5-.4-.9Z" style="fill: #f1eae8;"/>
  <path d="M30.4,124.9c-.2.9-.4,1.7-.6,2.6v-.3c0-.6,0-1.1.2-1.7,0-.3.2-.4.4-.6Z" style="fill: #8c483d;"/>
  <path d="M33.3,125.6h.2c-.2,1.2-.5,2.4-.7,3.6-.1-.2-.2-.5-.1-.7.2-1,.4-2,.6-2.9Z" style="fill: #ebe3e0;"/>
  <path d="M33.5,125.6h.2c0,.3.3.6.4.9-.2,0-.3-.1-.5-.2-.2,1-.4,2-.6,3,0,.4-.3,1-.2,1.4.4.3.8.4,1.1.7v.3c-.3-.1-.5-.3-.8-.4-.2-.2-.5-.2-.7-.5,0-.5.2-1,.3-1.4.2-1.2.5-2.4.7-3.6Z" style="fill: #823f35;"/>
  <path d="M61.4,125.8h.1s0,.2,0,.2h0c0,.1-.1.1-.1.1v-.3Z" style="fill: #6a2519;"/>
  <path d="M38.4,126.3c.2.3.3.5.5.8-.4,0-.6-.3-.5-.8Z" style="fill: #f5eeee;"/>
  <path d="M61.3,126.2v.3c0,.7-.3,1.3-.5,2-.8,2.6-1.5,5.3-2.3,8-.3,1.1-.7,2.2-1,3.4-.1.4-.2.8-.5,1,.3-1.2.7-2.3,1-3.5.2-.8.5-1.6.7-2.4.3-.9.5-1.8.8-2.7,0-.6.3-1.1.5-1.6v-.2c.4-1.3.8-2.7,1.2-4v-.3Z" style="fill: #854237;"/>
  <path d="M61.1,126.6c-.3,1.3-.8,2.8-1.2,4v-.3c.1-.8.4-1.7.6-2.5.1-.4.2-1,.6-1.2Z" style="fill: #eee8e5;"/>
  <path d="M34.8,127c.3.3.6.6.6,1.1h-.1c-.2-.3-.4-.6-.6-.9v-.2c-.1,0,0,0,0,0Z" style="fill: #f4eceb;"/>
  <path d="M34.7,127.3c.2.3.4.6.6.9-.4,0-.7-.4-.6-.9Z" style="fill: #7f372c;"/>
  <path d="M29.5,127.6h.2c-.1.5-.2,1.1-.4,1.7v.3c-.4,0-.7-.1-.9-.1.2-.2.4-.2.7-.3.2-.5.2-1.1.4-1.6Z" style="fill: #844439;"/>
  <path d="M36.1,129.4c-.2-.2-.3-.5-.5-.7.3-.3.6.3.5.7Z" style="fill: #f2eeed;"/>
  <path d="M40,128.8c.2.4.6.8.8,1.2-.3.1-.4-.2-.6-.4-.2-.3-.2-.4-.2-.8Z" style="fill: #f4eeed;"/>
  <path d="M28.1,129.1c.2,0,.3,0,.3.2h-.4c-.2,0-.4,0-.6,0-1.4,0-2.6,0-4,.6h-.3c.4-.4,1-.5,1.5-.6,1.1-.3,2.2-.2,3.4-.2Z" style="fill: #75291e;"/>
  <path d="M71.1,129.1c1,0,2,0,2.9,0l-.2.3c-.6-.1-1.3,0-1.9,0,0,0-.2,0-.2,0-.6.1-1.3.1-1.9.3v-.3c.5-.1.9-.2,1.3-.2Z" style="fill: #803d33;"/>
  <path d="M27.5,129.3c.2,0,.4.1.6,0,.1,0,.3,0,.4,0,.3,0,.6.1.8.1v.2c-.4,0-.7-.2-1-.2-1.6,0-3.1-.2-4.6.5-2.6,1-5,2.4-6.8,5-.2.2-.4.8-.7.6.3-.4.5-.8.8-1.2,0,0,0-.1.1-.2.3-.3.5-.6.8-.9.2-.2.5-.4.7-.7.5-.4,1-.8,1.5-1.1.2-.1.4-.3.6-.4.6-.3,1.2-.8,1.8-.9.4-.1.7-.4,1.1-.5,1.3-.6,2.6-.5,4-.6Z" style="fill: #e8ddd9;"/>
  <path d="M72,129.3c.6.1,1.3,0,1.9,0,.1,0,.2,0,.3,0,.4,0,.7.3,1.1.2-.3.3-.5.2-.8.1-.9-.3-1.8,0-2.7-.1,0-.1,0-.3,0-.4Z" style="fill: #e6dbd8;"/>
  <path d="M75.7,129.5v.2c-.1,0-.4,0-.4,0-.4,0-.7-.2-1.1-.2.4-.4,1,0,1.5,0Z" style="fill: #792b20;"/>
  <path d="M69.7,129.7c-.4,0-.8.2-1.2.3.2-.5.8-.7,1.2-.3Z" style="fill: #844c41;"/>
  <path d="M71.8,129.3c0,.3-.2.4-.3.4-1,0-2,.4-2.9.6h-.2c0-.1.1-.2.2-.3.4,0,.8-.3,1.2-.3h.2c.6-.2,1.3-.3,1.9-.4Z" style="fill: #f1ece8;"/>
  <path d="M76.9,129.9v.2c-.4-.1-.8-.3-1.1-.3.4-.3.7,0,1.1,0Z" style="fill: #792b20;"/>
  <path d="M36.8,129.9c.3.3.6.7.6,1.3h0c-.2-.4-.4-.7-.7-1.1v-.2c0,0,.1,0,.1,0Z" style="fill: #f0e9e6;"/>
  <path d="M75.5,129.8h.3c.4,0,.7.2,1,.3,0,0,.2,0,.3.1h.1c.2.2.4.2.5.3.5.2.9.5,1.4.8.3.2.5.4.8.6.8.7,1.6,1.3,2.3,2.2-.2,0-.3,0-.4,0-.7-.8-1.5-1.5-2.3-2.1-1.3-.9-2.6-1.6-4-1.9v-.2Z" style="fill: #eee5e2;"/>
  <path d="M64.4,130c.2.6.4,1.2.7,1.8,0,0,0,.1-.1.2-.2.1-.4.3-.5.4,0-.2.2-.5.3-.7,0-.5-.6-1.2-.3-1.6Z" style="fill: #844135;"/>
  <path d="M77.1,130.1c.2-.1.3,0,.2.1h-.1c0,0-.1,0-.1,0h0Z" style="fill: #6c2119;"/>
  <path d="M22,130.3c.1,0,.3,0,.4.2-.6.2-1.2.6-1.8.9v-.3c.4-.3.9-.6,1.4-.8Z" style="fill: #823d31;"/>
  <path d="M36.7,130.1c.3.3.5.7.7,1-.3.1-.7-.7-.7-1Z" style="fill: #793023;"/>
  <path d="M41,130.2c.2.2.3.5.5.7-.3.3-.6-.3-.5-.7Z" style="fill: #f3f0ef;"/>
  <path d="M78,130.5c.4.2.8.4,1.2.7v.2c-.5-.3-1-.6-1.4-.8h.3Z" style="fill: #793027;"/>
  <path d="M59.7,130.7c0,0,.2,0,.2,0-.2.5-.4,1-.5,1.6-.3.9-.5,1.8-.8,2.7-.1.8-.5,1.6-.7,2.4-.4,1.2-.7,2.3-1,3.5,0,.2-.1.4-.2.6,0,.3-.2.6-.3.9h0c-.1.4-.1.8-.3,1.1,0-.5,0-.7,0-1.1.3-.9.5-1.9.8-2.9.7-2.2,1.3-4.4,2-6.7.2-.7.4-1.4.6-2.1Z" style="fill: #efe9e6;"/>
  <path d="M56.5,130.9c0,.2.1.3.1.5-.2.8-.5,1.5-.6,2.3-.1.4-.1,1-.6,1.2.2-.5.3-1,.5-1.5,0-.4.2-.7.3-1.2,0-.4.3-.8.3-1.3Z" style="fill: #eededa;"/>
  <path d="M33.2,131.1c.2.1.5.3.7.4.4.3.8.6,1.2.9h-.2c-.6-.3-1.1-.8-1.8-1.1v-.3Z" style="fill: #efe7e3;"/>
  <path d="M20,131.8c-.5.3-1,.8-1.5,1.1,0-.5.4-.6.7-.9.3-.2.4-.5.7-.2Z" style="fill: #813429;"/>
  <path d="M37.6,131.5l.2.2h0c.2.3.4.7.6,1h-.2c-.2-.3-.7-.7-.6-1.2Z" style="fill: #7c2e22;"/>
  <path d="M38.5,132.7h0c-.2-.3-.4-.6-.6-1,.4-.2.7.6.7,1Z" style="fill: #efeceb;"/>
  <path d="M41.9,131.5c.2.4.5.7.7,1.1-.4-.1-.8-.5-.7-1.1Z" style="fill: #f1f2f1;"/>
  <path d="M80.2,131.8c.7.6,1.6,1.3,2.2,2.1.1.2.5.5.4.8-.2-.2-.3-.4-.5-.6-.7-.8-1.5-1.5-2.3-2.2h.2Z" style="fill: #80382d;"/>
  <path d="M65,131.9v.3c-.4.3-.9,1-1.4,1,.3-.3.5-.6.8-.8h0c.2-.2.4-.3.5-.4Z" style="fill: #efeeeb;"/>
  <path d="M64.1,132.3h.3c-.3.3-.6.6-.8.9-.5.5-.9,1-1.4,1.5-.4.5-.9,1-1.3,1.6v-.4c.5-.7,1.1-1.3,1.7-2,.5-.5,1-1.1,1.5-1.5Z" style="fill: #82382b;"/>
  <path d="M35.2,132.5c.1,0,.3,0,.4,0,.2.2.6.4.5.8-.3-.3-.6-.6-.9-.8Z" style="fill: #7d3025;"/>
  <path d="M42.6,132.7c.3.5.7,1,1.1,1.6h0c.1.2.2.4.3.6h-.2c-.3-.3-.4-.7-.7-1-.3-.4-.6-.6-.5-1.2Z" style="fill: #efecea;"/>
  <path d="M38.5,132.9c.2.3.4.6.6.8.3.5.7.8,1,1.4.2.3.4.5.6.8-.4,0-.5-.4-.7-.7-.5-.7-1-1.3-1.4-2v-.3Z" style="fill: #87443a;"/>
  <path d="M72.9,133c.7.2,1.5.1,2.2.4.7.2,1.4.5,2.1.8v.3c-.7-.3-1.4-.6-2.1-.8,0,0-.1,0-.2,0-.7,0-1.3-.3-2-.2,0-.1,0-.2,0-.4Z" style="fill: #f0e8e5;"/>
  <path d="M25.3,133.2c1,0,2,0,3.1,0v.3c-1,0-2-.3-2.9,0,0-.1,0-.2-.1-.3Z" style="fill: #f2ebe8;"/>
  <path d="M70.2,133.2c.7,0,1.4,0,2.1,0,.1,0,.3.1.4.2-.8,0-1.6,0-2.4,0-.3.1-.7.2-1,.3.4,1.5,1,2.9,1.5,4.4h0c0,.1-.2.1-.2.1-.4-1-.8-2.1-1.2-3.1-.1-.5-.4-1.1-.3-1.5.3-.2.6-.3,1-.3Z" style="fill: #f3edeb;"/>
  <path d="M28.3,133.5c.1,0,.2.2.1.3-.7,0-1.4-.3-2.1-.1-.5,0-1,.3-1.5,0,.2,0,.4,0,.7,0,.9-.3,1.9-.1,2.8,0Z" style="fill: #7e4239;"/>
  <path d="M36.1,133.4c.2,0,.3,0,.4.1.6.6,1.1,1.3,1.6,2.1v.2s0,0,0,0c-.5-.8-1.1-1.5-1.7-2.2,0-.1-.2-.2-.3-.3Z" style="fill: #7d372c;"/>
  <path d="M70.4,133.4c.8,0,1.6,0,2.4,0h.2c.7,0,1.3.2,2,.2-.4.3-1,.1-1.5,0-.7-.2-1.3.2-1.9,0-.6-.1-1.2,0-1.8,0,.3,1.3.9,2.6,1.3,3.9v.4c-.6-1.4-1.3-2.9-1.6-4.4.3,0,.7-.2,1-.3Z" style="fill: #82453b;"/>
  <path d="M17.8,133.6c-.3.3-.5.6-.8.9-.2-.4.5-1,.8-.9Z" style="fill: #7a2c20;"/>
  <path d="M24.8,133.6c.4.3,1,.1,1.5,0,.7-.2,1.4.2,2.1.1l-.2.2c-.3.3-.3.8-.4,1.2,0,.2,0,.4.1.7h0c0,.1-.1.1-.2,0-.1.5-.3,1.1-.3,1.7v.3c.1,0,.1.2,0,.2l-.2-.2c-.6,2.8-1.3,5.6-1.9,8.4-.2,1-.6,1.9-.3,2.9h.2c0,.2.1.3.2.4h0c0,0,0,.2,0,.2h.1c0,0,.2.2.3.3,0,.5.4.6.8.7.5,0,1-.2,1.3-.6v-.3c0,0,0-.1.1-.2.3-.7.4-1.5.6-2.2h0c0,0,.1.2.1.2.2-1.3.7-2.5.9-3.8.2-1,.5-2,.7-3v-.3c-.1,0-.1-.2,0-.3v.2c.3-.5.5-.9.3-1.4h0c.4-.2.4-.6.5-1,.2-.9.5-1.8.6-2.7v-.4c-.1,0-.1-.1-.1-.1h0c.8.4,1.6,1.1,2.4,1.8h.3c0,0,0,.1,0,.1v.3c.5.8,1.2,1.4,1.7,2.2.4.8.8,1.5,1.1,2.3.2.4.2.8.6.9.2.5.4,1.1.5,1.7-.3.5,0,1.2,0,1.7,0,0,.2-.2.2-.4,0,.2,0,.4,0,.7,0,.1,0,.2,0,.3,0,.8.1,1.5,0,2.3-.1.2-.1.4,0,.6-.1,1.3-.3,2.5-.6,3.8-.4.2-.5.8-.6,1.2-.1.4-.3.7-.2,1.1,0,0,0,.1,0,.2-.4.1-.6.7-.8,1.1-.1.1-.1.3,0,.5,0,.1-.1.2-.2.3,0,0,0,.1-.1.2,0,0-.1.2-.2.2h-.2c-.4.5-.8,1-1.2,1.5v.2s0,.1,0,.1h-.1c-.4,0-.6.3-.9.6-.2.3-.5.3-.4.7,0,0,0,0-.1,0-.5,0-.8.3-1.2.5-1.3.8-2.7,1.2-4.1,1.4-.7,0-1.3,0-2,0l-.3.2c-.2,0-.4-.1-.7-.1-.2,0-.4,0-.5,0,0-.1,0-.2,0-.3-.5-.2-1-.3-1.4-.5-.5-.2-.9-.6-1.4-.9h-.3c0,0-.2,0-.3,0h0c0,0,0-.2,0-.2h0c0,0,0,0,0,0-.1,0-.3-.2-.4-.2,0,0-.2-.2-.2-.3,0-.3-.2-.4-.3-.6-.5-.5-.8-1.1-1.2-1.7h-.2c0,0,0,0,0,0h0c0-.4,0-.6-.1-.8-.6-1.1-1.2-2.2-1.6-3.5-.3-1-.5-2.1-.7-3.1,0,0-.1,0-.2.1v-.3c.2-.3.1-.9,0-1.3-.1,0-.2.2-.2.5-.1-.4,0-.9,0-1.3.3-.7.3-1.3.3-2.1,0-.6.3-1.1,0-1.7h0s.2-.2.2-.2c.2-.9.4-1.8.7-2.6.2-.6.5-1.2.8-1.8v-.3c-.1,0,0,0,0,0,.4,0,.5-.4.7-.8.4-.8.9-1.5,1.4-2.2.1-.1.1-.3,0-.5,0,0,0-.1.1-.2h.2c.4-.3.9-.6,1.3-1v-.4c.2,0,.2-.1.3-.1.4.1.8-.2,1.1-.4.4-.3.9-.4,1.4-.6v-.2c.3,0,.5-.2.7-.2Z" style="fill: #9f5045;"/>
  <path d="M39.7,134.1c.2.3.4.5.4,1-.3-.5-.7-.9-1-1.4.3-.1.4.2.6.4Z" style="fill: #f0f2ed;"/>
  <path d="M71.5,133.7c.7.1,1.3-.2,1.9,0,.5,0,1.1.3,1.5,0,0,0,.1,0,.2,0v.3c.8.2,1.7.6,2.5,1.1.3.2.6.5,1,.4.2.1.3.3.4.4h0c0,.1,0,.2,0,.2h0c0-.1,0,0,0,0,0,0,0,.1.1.2-.3.4.4.8.6.7,0,0,.2.2.3.3,0,.4.2.5.3.8.3.4.5.8.9,1.2h.2c0,0,0,0,0,0v.3s0,.2,0,.2c.5,1.2,1.1,2.2,1.4,3.5.2.4.2,1,.6,1.2,0,.3.2.6.2.9-.2,0-.2.8,0,.7,0-.2,0-.4,0-.6h0c.1.6.1,1.2.2,1.7,0,.2-.1.3-.1.5,0,1.2,0,2.3-.2,3.5-.2.9-.3,1.8-.5,2.6,0,.4-.3.7,0,1h0c-.4.2-.6,1-.8,1.4-.7,1.5-1.6,2.9-2.6,4v.3c0,0,0,.2,0,.2h0s-.2,0-.2,0c-.2.1-.6.4-.6.8h0c-.1.2-.3.3-.4.4-.4-.1-.7.2-1.1.4-.2.2-.5.3-.6.7h0s-.3-.2-.3-.2c-.9.2-1.7.8-2.6.8,0,.2,0,.2.3.2-.2,0-.4.1-.6.1v-.2c-.8,0-1.7,0-2.4,0l-.3.2h-.2c0-.1,0-.2,0-.3-1.2-.2-2.4-.7-3.5-1.4-.3-.1-.4-.4-.7-.2h-.1c0-.1,0-.2,0-.2h0c0,0,0,0,0,0,0,0-.2-.1-.3-.2h0c0-.5-.6-1-.9-.9h0c0,0,0-.4,0-.4-.3-.5-.6-.8-.9-1.3-.4-.6-.8-1.3-1.2-1.9h-.3c0-.1,0-.2,0-.2h.1c-.2-.6-.5-1.2-.7-1.8-.1-.3-.2-.7-.5-.8h0s.1-.3.1-.3c0-.6-.2-1.1-.3-1.7,0,0-.1,0-.2,0v-.4c.3,0,.7,0,1-.2,0-.1,0-.2-.1-.3.7,0,1.3.1,2,0,.9,0,1.8,0,2.6,0,.3,0,.6-.1.9,0,.6,0,1.2,0,1.8,0,.5,0,.9.2,1.4,0,.7.1,1.3,0,2,0s.8-.3,1.1-.5h0c.2.2.5-.2.2-.4,0-.1.1-.2.2-.3.5-.2.4-.8.4-1.4,0-.8-.3-1.4-.6-2.1-.5-1.5-1.1-3-1.7-4.5-.2-.6-.4-1.4-.7-1.9h-.2c0,0,0-.2-.1-.4.3-.4-.2-1.2-.5-1.3h0c0-.1,0-.2,0-.2h0c0-.1-.1,0-.1,0h0s0-.1,0-.1v-.4c-.3-1.3-.9-2.5-1.2-3.9.6,0,1.2-.2,1.8,0Z" style="fill: #9f5044;"/>
  <path d="M36.4,133.7c.6.7,1.2,1.4,1.7,2.2h-.2c-.4-.4-.7-1-1.1-1.4-.2-.3-.4-.3-.3-.8Z" style="fill: #f1edec;"/>
  <path d="M75.1,133.7c.7.2,1.4.5,2,.8.2,0,.4.2.6.4.3.2.6.4.8.6-.3.1-.7-.2-1-.4-.9-.5-1.7-.9-2.7-1.1v-.3Z" style="fill: #7c382d;"/>
  <path d="M24.2,133.8v.2c-.5.2-1,.4-1.5.6-.4.2-.7.5-1.1.4.1,0,.2-.2.4-.2.3-.2.7-.4,1-.6.4-.2.8-.3,1.2-.5Z" style="fill: #793227;"/>
  <path d="M28.2,134c0,.6-.3,1.2-.3,1.9-.1-.2-.2-.5-.1-.7.1-.4,0-1,.4-1.2Z" style="fill: #80463b;"/>
  <path d="M23,134.3c-.4.2-.7.3-1,.6v-.3c.3-.2.7-.6,1-.3Z" style="fill: #f2ebe8;"/>
  <path d="M44.4,135c.7.9,1.2,1.9,1.9,2.9.2.2.2.4.2.7,0,0-.1-.2-.2-.3-.2-.2-.3-.5-.5-.7,0,0-.1-.2-.2-.3-.2-.2-.3-.5-.5-.7,0,0,0-.2-.1-.2-.2-.3-.5-.7-.7-1-.1-.2-.3-.4-.4-.6-.1-.2-.2-.4-.3-.6.3-.2.5.5.7.7Z" style="fill: #853e34;"/>
  <path d="M16.9,134.7c-.3.4-.5.8-.8,1.2,0,0,0,.1-.1.2-.2.2-.3.5-.5.7-.1.2-.2.4-.3.6-.1.2-.2.4-.3.7,0-.4,0-.5.1-.8.4-.7.9-1.4,1.3-2.1.2-.2.3-.6.6-.4Z" style="fill: #82392d;"/>
  <path d="M31.3,134.8h.2c0,0,0,.2,0,.2-.3,1.5-.6,2.7-.9,4.1h0c-.1.4-.2.8-.3,1.3,0,0,0,.2,0,.3-.3,1.5-.7,2.9-1,4.4-.2.8-.4,1.5-.6,2.3-.3-.5,0-1.1.2-1.6.8-3.7,1.7-7.2,2.5-10.9Z" style="fill: #eee5e3;"/>
  <path d="M31.6,134.7c.1,0,.3,0,.4.1.3.3.7.5,1.1.8.4.3.8.7,1.1,1.1h0s-.3,0-.3,0c-.7-.7-1.5-1.3-2.4-1.7v-.3Z" style="fill: #7e392e;"/>
  <path d="M62.2,134.6v.3c-.3.5-.7,1-1.1,1.5-.6.9-1.1,1.9-1.5,2.9-.2.2-.1.6-.4.4.5-1.1.9-2.1,1.6-3.1,0-.1.2-.3.2-.4.4-.5.8-1.1,1.3-1.6Z" style="fill: #eee7e4;"/>
  <path d="M78.5,135.1c.3.3.6.4.7.9h0c0,0-.1-.1-.1-.1-.1-.2-.3-.3-.4-.4-.3-.2-.5-.4-.8-.6.3-.2.5,0,.7.2Z" style="fill: #ede6e4;"/>
  <path d="M82.7,134.9h0c0-.1.1-.1.1-.1.2.3.4.6.6.9-.3.1-.6-.5-.8-.8Z" style="fill: #f0e8e7;"/>
  <path d="M82.8,134.8c.4,0,.5.4.8.7,1,1.6,2,3.4,2.6,5.3,0,.2,0,.4,0,.6-.1-.4-.3-.8-.4-1.2-.2-.6-.5-1.2-.8-1.8-.5-.9-.9-1.8-1.4-2.5,0,0,0-.1,0-.2-.2-.3-.4-.6-.6-.9Z" style="fill: #7d362c;"/>
  <path d="M31.5,135v.4c0,.9-.3,1.8-.4,2.7-.1.4-.1.8-.5,1,.3-1.4.6-2.7.9-4.1Z" style="fill: #824238;"/>
  <path d="M55.3,135.1c.2.4.1,1-.3,1.1h0c0,0,0-.4,0-.4,0-.3.2-.5.2-.7Z" style="fill: #f8eeec;"/>
  <path d="M21.2,135.4c-.4.3-.7.5-1.1.8v-.3c.3-.2.7-.7,1.1-.6Z" style="fill: #efeceb;"/>
  <path d="M21.2,135.4l.2-.2v.4c-.5.4-1,.7-1.4,1h-.2c.1-.1.2-.3.3-.4.4-.3.7-.5,1.1-.8Z" style="fill: #7d392d;"/>
  <path d="M66.1,135.3h.2s0,.2,0,.2c0,0-.1.1-.2.2-.4.3-.8.7-1.2,1.1,0-.2,0-.4,0-.5.4-.4.8-.8,1.2-1Z" style="fill: #f1eceb;"/>
  <path d="M66.3,135.4h.1s0,0,0,0c.2.4.3.9.5,1.3h-.2c-.2-.4-.3-.8-.5-1.2h0Z" style="fill: #7d3429;"/>
  <path d="M66.7,135.4c.6,1.7,1.2,3.4,1.8,5v.5c-.5-1.3-1-2.5-1.4-3.8,0-.1-.1-.3-.2-.4-.1-.4-.3-.9-.5-1.3h.2Z" style="fill: #f0e8e5;"/>
  <path d="M33.1,135.6c.2,0,.3,0,.4,0,.3.2.5.4.8.7v.3c-.4-.4-.8-.8-1.2-1.1Z" style="fill: #ebe7e4;"/>
  <path d="M44.4,135.4c.2.4.5.7.7,1-.4.1-.8-.6-.7-1Z" style="fill: #f0ebe7;"/>
  <path d="M66.2,135.5c.2.4.4.8.5,1.3h.2c0,0,.1.2.2.4-.1.3,0,.5,0,.9.5,1.6,1.2,3.1,1.7,4.7.6,1.4,1,2.9,1.6,4.3-2.7-.2-5.4,0-8.1-.1-.5,0-.9.1-1.4.1,0-.5,0-1-.2-1.4v-.2c.1,0,.2,0,.3,0,.1-.9.4-1.7.6-2.6.3-1.1.8-2,1.3-3.1v-.3c0,0,0-.2,0-.3.4-.1.5-.5.8-.9.6-.8,1.2-1.5,1.9-2.1.1-.1.2-.3.3-.6,0,0,.1-.1.2-.2Z" style="fill: #9f5045;"/>
  <path d="M66,135.7c0,.3-.1.4-.3.6-.7.6-1.3,1.3-1.9,2.1-.3.4-.3.8-.8.9.1-.4.3-.6.5-1v-.2c.2-.2.4-.4.5-.6.2-.2.4-.5.7-.7.4-.4.8-.8,1.2-1.1Z" style="fill: #823d33;"/>
  <path d="M27.7,136c0,0,.1,0,.2,0-.1.8-.3,1.3-.4,2v-.3c0-.6,0-1.1.2-1.7Z" style="fill: #8b453c;"/>
  <path d="M38.6,136.6c-.1-.2-.2-.4-.3-.6.3-.3.4.3.3.6Z" style="fill: #7a3329;"/>
  <path d="M54.9,136c0,0,.1,0,.2.1h0c0,0,0,.2,0,.2-.3.7-.4,1.5-.7,2.3-.1.3-.2.6-.3.9v-.3c.2-1.1.4-2.2.8-3.2Z" style="fill: #89453c;"/>
  <path d="M79,135.9h.1c0,0,0,.2,0,.2h0c0,0,0-.2,0-.2Z" style="fill: #701003;"/>
  <path d="M83.5,135.8c.5.8,1,1.7,1.4,2.5h-.2c-.3-.4-.5-.9-.8-1.4-.2-.4-.5-.6-.4-1.1Z" style="fill: #eee6e3;"/>
  <path d="M16,136c.1.4,0,1-.5.7.1-.2.3-.5.5-.7Z" style="fill: #f1f0ed;"/>
  <path d="M38.2,136.1h0c0,.1.2.3.3.5.1.3.3.5.4.8h-.2c-.2-.3-.6-.8-.6-1.3Z" style="fill: #f0eeea;"/>
  <path d="M40.8,136c.1.2.2.3.3.5-.3.3-.4-.3-.3-.5Z" style="fill: #772a1f;"/>
  <path d="M79.4,136.2c.2.2.4.4.6.7-.3.1-.9-.2-.6-.7Z" style="fill: #883c2f;"/>
  <path d="M55,136.4c0,.2,0,.4,0,.6-.3,1.2-.6,2.3-1,3.4-.5,1.7-1,3.5-1.5,5.3h-.2c.5-1.9,1-3.8,1.6-5.5h0c0,0,0-.2,0-.2,0,0,0-.2,0-.3,0-.3.2-.6.3-.9.2-.8.3-1.5.7-2.3Z" style="fill: #efe8e5;"/>
  <path d="M60.7,136.6c-.6.9-1.1,2-1.6,3.1,0,.1,0,.2-.1.4,0,.3-.2.6-.3.8v-.3c.3-1.4.9-2.7,1.6-3.8,0-.2.2-.2.4-.1Z" style="fill: #834036;"/>
  <path d="M45.3,136.7c.2.2.3.5.5.7-.3.3-.6-.3-.5-.7Z" style="fill: #f3edea;"/>
  <path d="M19.6,136.8c0,.2,0,.3,0,.5-.5.7-1,1.4-1.4,2.2-.2.4-.3.7-.7.8.5-.9.9-1.9,1.6-2.7.2-.3.4-.5.6-.8Z" style="fill: #833f34;"/>
  <path d="M34.4,136.8c.2.2.4.5.7.7.4.5.8.9,1.1,1.5,0,0,0,.1.1.2.3.5.5,1,.8,1.5.1.3.3.6.4.9.1.3.2.6.3.8-.3-.2-.4-.6-.6-.9-.3-.8-.7-1.6-1.1-2.3-.5-.8-1.2-1.4-1.7-2.2v-.3Z" style="fill: #823b31;"/>
  <path d="M41.3,136.8c.3.4.5.8.8,1.2-.3.2-.3-.1-.5-.4-.1-.3-.4-.5-.3-.9Z" style="fill: #772e25;"/>
  <path d="M39,137.4c.1,0,.2,0,.3.2.4.5.6,1.2.9,1.8.3.7.5,1.4.8,2.1.1.4.4.6,0,1,0-.5-.3-.9-.4-1.4-.2-.5-.3-1.1-.6-1.6-.1-.3-.2-.5-.3-.8-.2-.4-.4-.8-.7-1.2v-.2Z" style="fill: #803a30;"/>
  <path d="M67.1,137.2c.5,1.3.9,2.5,1.4,3.8h0c.6,1.8,1.3,3.4,1.8,5.1.1.4.4.7.5,1.1-1.6,0-3.3,0-5,0h-.1c-1.7,0-3.3,0-5,0,0-.6.1-1.1.2-1.7.2.5.1.9.2,1.4.5,0,.9-.1,1.4-.1,2.7.1,5.4,0,8.1.1-.6-1.4-1-2.9-1.6-4.3-.5-1.6-1.2-3.1-1.7-4.7,0-.3-.2-.5,0-.9Z" style="fill: #863d32;"/>
  <path d="M80.2,137.2c.3.4.6.9.9,1.3.2.2.3.4.5.7h-.2c-.3-.3-.6-.8-.9-1.2-.2-.3-.4-.4-.3-.8Z" style="fill: #863d31;"/>
  <path d="M15.2,137.4v.3c-.2.7-.6,1.3-.9,2.1-.5,1.3-1,2.7-1.2,4.2h-.2c.3-1.9.9-3.8,1.7-5.3,0-.2.2-.4.3-.6,0-.2.2-.4.3-.7Z" style="fill: #efe9e7;"/>
  <path d="M19,137.6c-.6.8-1.1,1.7-1.6,2.7h0c-.3.7-.6,1.3-.9,2-.2-.4,0-.7.2-1.1.5-1,1-2.1,1.6-3.1.2-.3.3-.7.7-.5Z" style="fill: #ede8e7;"/>
  <path d="M35,137.5h.3c.3.4.8.9.8,1.5-.3-.5-.7-1-1.1-1.5Z" style="fill: #f3f0ef;"/>
  <path d="M64.2,137.5c-.2.2-.3.4-.5.6-.1-.5,0-.8.5-.6Z" style="fill: #f2f1ef;"/>
  <path d="M39.1,137.6c.3.4.4.8.7,1.2h-.2c-.2-.3-.4-.7-.5-1.2Z" style="fill: #ede7e4;"/>
  <path d="M45.9,137.6c.1.3.3.5.5.7-.3.4-.6-.4-.5-.7Z" style="fill: #f3efed;"/>
  <path d="M27.2,138.1l.2.2c-.4,1.7-.7,3.3-1.2,5-.3,1.5-.7,3.3-1.1,4.8,0,.4,0,1,0,1.4h-.2c-.3-1.1,0-1.9.3-2.9.6-2.8,1.3-5.6,1.9-8.4Z" style="fill: #7b3429;"/>
  <path d="M71,138.2h.1s0,0,0,0h0c0,0,0,0,0,0Z" style="fill: #6a2013;"/>
  <path d="M42.2,138.2c.2.2.4.5.5.8-.3,0-.6-.4-.5-.8Z" style="fill: #7c3023;"/>
  <path d="M63.6,138.3c-.2.3-.4.6-.5,1,0,0-.1.2-.1.3,0,.2-.2.4-.3.6-.2-.4,0-.6.2-.9.2-.4.3-.8.7-.9Z" style="fill: #eee8e7;"/>
  <path d="M81.7,139.1h0c-.1-.2-.3-.4-.5-.7.3-.3.6.3.5.7Z" style="fill: #f0eeec;"/>
  <path d="M14.4,138.5h.2c-.8,1.6-1.4,3.4-1.7,5.2,0,.1,0,.2,0,.4-.3-.1-.1-.5-.1-.7.3-1.7.9-3.4,1.6-4.9Z" style="fill: #823f35;"/>
  <path d="M71,138.4c.3.2.7,1,.5,1.3-.1-.4-.3-.8-.4-1.2h0Z" style="fill: #7b382f;"/>
  <path d="M71.1,138.6c.1.4.3.8.4,1.2,0,.1,0,.3.1.4.2.4.3.9.5,1.3h-.2c-.3-.7-.6-1.6-.9-2.4,0-.2,0-.3,0-.5Z" style="fill: #efe8e6;"/>
  <path d="M36.7,139.6c.1.4.5.7.3,1.2-.3-.5-.5-1-.8-1.5.3-.2.3.1.5.4Z" style="fill: #eadcd9;"/>
  <path d="M43.4,140.2c-.2-.3-.4-.7-.6-1,.3-.2.8.6.6,1Z" style="fill: #f2f2f0;"/>
  <path d="M46.7,139l.2.2h0c.2.3.4.6.7,1-.2,0-.3,0-.4-.1-.2-.3-.5-.6-.5-1Z" style="fill: #f2efed;"/>
  <path d="M47.1,139.1c.4.6.8,1.2,1.2,1.8v.4s0,0,0,0c-.2-.2-.3-.4-.5-.7,0-.1-.2-.3-.3-.4-.2-.3-.4-.6-.7-1h.2Z" style="fill: #7e3428;"/>
  <path d="M30.6,139.2c.3.5,0,.9-.1,1.4v-.2c0-.4,0-.8.1-1.3Z" style="fill: #7a372d;"/>
  <path d="M42.8,139.1h0c.2.4.4.7.6,1h0c-.4,0-.8-.5-.7-1Z" style="fill: #7b362a;"/>
  <path d="M82,139.3c.3.6.8,1.3.7,2.1-.3-.7-.6-1.4-.9-2h.2Z" style="fill: #efe9e5;"/>
  <path d="M81.7,139.4h0c.3.6.6,1.3.9,2,.1.4.3.8.5,1.2.2.6.3,1.1.5,1.7-.4-.2-.4-.7-.6-1.2-.3-1.3-.9-2.3-1.4-3.5v-.2Z" style="fill: #813f34;"/>
  <path d="M40.1,139.5c.2.5.4,1.1.6,1.6.1.5.4.9.4,1.4,0,.3.1.5.2.8.1.5.2.9.2,1.4.1.8.3,1.7.3,2.5,0,.4,0,.7,0,1.1h0c0,1.5,0,2.8-.3,4.1-.1-.2-.2-.5-.1-.7.2-1.1.1-2.2.2-3.3-.1-1.2,0-2.3-.3-3.5-.2-1.5-.5-2.8-1-4.2-.1-.4-.4-.8-.2-1.3Z" style="fill: #ebe3e1;"/>
  <path d="M54,139.9v.2c-.4,0-.2-.6,0-.2Z" style="fill: #772218;"/>
  <path d="M63,139.5v.3c-.3,1-.9,2-1.2,3.1-.2.9-.5,1.7-.6,2.6,0,0-.2,0-.2,0,.3-1.5.7-2.9,1.3-4.3.1-.3.3-.7.5-1,0-.2.2-.4.3-.6Z" style="fill: #813d33;"/>
  <path d="M71.9,140.1c.4.5.5,1.3.7,1.9.6,1.5,1.1,3,1.7,4.5.3.7.6,1.2.6,2.1,0,.6,0,1.2-.4,1.4h0c.2-.6.3-1.3.2-1.9-.7-2.1-1.6-4.1-2.3-6.2,0-.1-.1-.3-.2-.4-.2-.4-.3-.9-.5-1.3h.2Z" style="fill: #854237;"/>
  <path d="M44.1,141.1h0c-.1-.2-.3-.4-.4-.7.3-.2.5.3.5.7Z" style="fill: #f1f0ec;"/>
  <path d="M53.9,140.1c-.6,1.8-1.1,3.6-1.6,5.4-.1.3-.2.7-.4,1-.1-.2-.3-.4-.4-.6-.1-.2-.2-.3-.3-.5h.2c.2.2.3.4.5.5.2-.3.2-.7.3-1,.4-1.3.8-2.6,1.1-3.9.1-.4.2-.8.5-1Z" style="fill: #7f3b30;"/>
  <path d="M59,140.1c.1.6-.1,1.1-.3,1.6-.3.9-.4,1.8-.6,2.7h-.2c0-.6.2-1.3.4-1.9h0c0-.5.3-1,.4-1.5h0c0-.3.2-.6.3-.9Z" style="fill: #f3eeea;"/>
  <path d="M85.8,140.1c.1.4.3.8.4,1.2h0c.4,1.3.7,2.6.9,3.9.1.6.1,1.2.2,1.9,0,1,0,2,0,3-.2.6,0,1.3-.2,1.9h0c0,.5-.2,1-.2,1.5,0,0,0,.1,0,.2-.2,1.4-.7,2.7-1.2,3.9,0,.2-.1.4-.2.5-.2-.1-.2-.3,0-.5.7-1.5,1.1-3.1,1.4-4.7.4-2,.4-4.1.3-6.2-.2-2.1-.6-4.2-1.3-6.2,0-.2,0-.4,0-.6Z" style="fill: #ede5e3;"/>
  <path d="M17.5,140.3v.3c-.1.6-.5,1.1-.7,1.8-.3.9-.5,1.8-.7,2.6l-.2.2c0-.4.1-.9.2-1.3.2-.5.3-1.1.4-1.6.2-.7.6-1.3.9-2Z" style="fill: #803c33;"/>
  <path d="M43.5,140.4h0c0,.3.3.4.4.7-.3.3-.6-.4-.5-.7Z" style="fill: #7e3326;"/>
  <path d="M47.9,140.6c.1.2.3.5.5.7-.3.3-.6-.3-.5-.7Z" style="fill: #f2edea;"/>
  <path d="M30.2,140.7v.3c0,1-.4,2-.5,3-.2,1.3-.6,2.5-.9,3.8v-.3c-.1,0-.1-.2-.1-.2.2-.8.4-1.5.6-2.3.3-1.5.7-2.9,1-4.4Z" style="fill: #84453b;"/>
  <path d="M58.7,141c-.1.5-.3,1-.4,1.5-.2-.3-.2-.4,0-.8.1-.3.2-.7.5-.7Z" style="fill: #79392f;"/>
  <path d="M62,141.1h.2c-.6,1.4-1,2.8-1.3,4.3v.2c0,.6-.2,1.1-.2,1.7,1.7,0,3.3,0,5,0-.2.2-.3.2-.5.2-1,0-1.9,0-2.9,0-.5,0-1.1.1-1.6,0-.1-.5,0-1.2,0-1.7.3-1.6.7-3.2,1.3-4.6Z" style="fill: #f4edea;"/>
  <path d="M68.5,141.1c.2,0,.3.2.3.3.8,1.8,1.3,3.7,2.1,5.5,0,.1,0,.3,0,.4-.6.4-1.2.1-1.9.1-.9,0-1.8,0-2.7,0-.1,0-.3-.1-.4-.2,1.6,0,3.3,0,5,0,0-.4-.3-.7-.5-1.1-.6-1.7-1.2-3.3-1.8-5Z" style="fill: #f0e8e5;"/>
  <path d="M44.1,141.3c.3.3.5.7.7,1,.1.2.3.4.4.6,0,.1.2.3.3.4.2.3.4.7.7,1,.6,1,1.3,2,1.9,3h-.2c-1.2-1.5-2.1-3.3-3.3-4.8-.3-.4-.6-.6-.6-1.2Z" style="fill: #7f3529;"/>
  <path d="M48.5,141.4c.2,0,.3,0,.4.2.8,1,1.5,2.2,2.3,3.3v.3c-.2-.2-.4-.4-.5-.6-.2-.2-.3-.5-.5-.7,0-.1-.2-.3-.3-.4-.3-.5-.7-.9-1-1.4-.1-.2-.3-.4-.4-.6Z" style="fill: #823b31;"/>
  <path d="M86.2,141.4l.3.2c.3.6.4,1.5.6,2.2,0,.5.3,1,0,1.5-.2-1.3-.5-2.6-.9-3.8Z" style="fill: #874940;"/>
  <path d="M56.8,141.5c.3.3,0,.8-.3.9,0-.3.2-.6.3-.9Z" style="fill: #80473a;"/>
  <path d="M37.4,141.7c.2,0,.3.2.4.4.4,1,.6,2.1.8,3.2,0,.4,0,.6-.1.9,0-.2,0-.5,0-.7-.1-.4-.2-.9-.3-1.3-.1-.6-.3-1.1-.5-1.7,0-.3-.2-.6-.3-.8Z" style="fill: #f2ebe8;"/>
  <path d="M72.3,141.9c.7,2.1,1.6,4.1,2.3,6.2,0,.6,0,1.3-.2,1.8-.2-.8.1-1.5-.2-2.3-.6-1.7-1.3-3.4-1.9-5.1,0-.2,0-.4,0-.6Z" style="fill: #efe8e5;"/>
  <path d="M44.8,142.2c.4-.1.6.2.4.6-.1-.2-.3-.4-.4-.6Z" style="fill: #f2f6f4;"/>
  <path d="M48.9,142c.3.5.7.9,1,1.4-.2,0-.3,0-.4-.1-.3-.4-.7-.7-.6-1.3Z" style="fill: #f2eeed;"/>
  <path d="M83.3,142.4c.2.7.5,1.4.6,2.2,0,.2,0,.4-.1.6,0-.3-.1-.6-.2-.9-.2-.6-.3-1.2-.5-1.7h.2Z" style="fill: #f1eae7;"/>
  <path d="M56.5,142.5c.2.4,0,.8,0,1.2-.1.4-.2.8-.5,1,0-.2.1-.5.2-.7,0-.1,0-.3.1-.4.2-.3.2-.7.3-1Z" style="fill: #83463e;"/>
  <path d="M58.3,142.5c-.2.7-.3,1.4-.4,2.1h0c-.2-.3-.1-.6,0-1,.1-.4.1-.8.5-1Z" style="fill: #8d4e42;"/>
  <path d="M41.5,143.2c.2.8.2,1.7.4,2.5.1.8,0,1.6,0,2.4v.3c-.2-.4-.2-.7-.2-1.1,0-.8-.2-1.7-.3-2.5,0-.5-.1-.9-.2-1.4l.2-.2Z" style="fill: #7c3c32;"/>
  <path d="M46.2,144.2c-.2-.3-.5-.6-.7-1,.3-.1.7.6.7,1Z" style="fill: #f3efed;"/>
  <path d="M26.3,143.2c0,.2.1.3.1.5-.3,1.5-.7,3-1,4.6-.2.7.4,1.4.6,2.1h-.2c0-.3-.2-.4-.3-.5h0c0-.3-.1-.4-.2-.5-.2-.4,0-1,0-1.4.4-1.5.8-3.3,1.1-4.8Z" style="fill: #eadcd9;"/>
  <path d="M55.9,143.8h.2c0,.4-.1.6-.2.9,0,.3-.2.6-.3.9-.2.6-.3,1.1-.5,1.7.7,0,1.5,0,2.2,0h.1s.1,0,.1,0h.1c0-.2,0-.5,0-.7v-.4c.3.4.1.8.1,1.2-.7,0-1.5,0-2.2.1-.3,0-.7,0-.7-.5.2-1.1.7-2.2.9-3.3Z" style="fill: #f0e9e5;"/>
  <path d="M16.1,143.9c-.1.4-.1.8-.2,1.3h0c-.2,1.1-.3,2.1-.3,3.2v-.3c-.3-1.2,0-2.1.2-3.3,0-.4,0-.7.4-.8Z" style="fill: #ece7e6;"/>
  <path d="M50.1,143.9c.2.2.3.5.5.7-.3.3-.6-.4-.5-.7Z" style="fill: #f3f0ee;"/>
  <path d="M12.8,144.1v.2c.2.8-.2,1.5-.2,2.3,0,1.4,0,2.7,0,4.1.2,1.7.4,3.4,1,5,0,.4.4.8.1,1.2v-.3c-.1-.2-.2-.3-.2-.5,0-.3-.2-.6-.3-.9h0c-.4-1.6-.8-3.3-.8-4.9,0-.9-.2-1.8,0-2.8,0-1.2.1-2.2.3-3.3Z" style="fill: #f6f0ec;"/>
  <path d="M38.2,144.2c0,.4.2.9.3,1.3,0,.2-.1.3-.2.4,0-.5-.4-1.2,0-1.7Z" style="fill: #823f35;"/>
  <path d="M57.6,144.8h.1c0,0,0,.3,0,.3,0,.4,0,.7,0,1.1v.4c-.3-.5-.1-1.2-.1-1.8Z" style="fill: #722c20;"/>
  <path d="M83.8,145.1h0c0,.3,0,.5,0,.7-.2,0-.2-.8,0-.7Z" style="fill: #6e3125;"/>
  <path d="M15.9,145.2c.3.5,0,1.1,0,1.7,0,.7,0,1.4-.3,2.1v-.5s0,0,0,0c0-1.1.1-2.1.3-3.1Z" style="fill: #924639;"/>
  <path d="M51,145.3c0,0,.1.1.2.2.1.2.2.3.3.5-.3.3-.6-.4-.5-.7Z" style="fill: #f6f3f0;"/>
  <path d="M83.9,145.4c.3.2.4.8.4,1.2,0,1.6.1,3.4-.2,5l-.2.2c.3-1.6.3-3.3.2-4.9,0-.5,0-1-.2-1.5Z" style="fill: #f1e9e4;"/>
  <path d="M55.6,145.6c.2.5-.1,1-.2,1.5.6,0,1.4-.3,1.9.2-.7,0-1.5,0-2.2,0,.2-.6.3-1.1.5-1.7Z" style="fill: #78372e;"/>
  <path d="M38.8,146.3c0,1.1,0,2.2,0,3.3-.2,2.2-.7,4.3-1.5,6.3h-.3c0,.1.1-.1.1-.1,0,0,0-.1,0-.2.3-.8.6-1.6.8-2.4.3-1.2.5-2.5.6-3.8,0-.3,0-.5,0-.6,0-.8,0-1.5,0-2.3l.2-.3Z" style="fill: #f3edea;"/>
  <path d="M87.5,146.6c0,1.1,0,2.2,0,3.4,0,.6-.1,1.2-.2,1.9l-.3.2c.2-.6,0-1.3.2-1.9,0-1,0-2,0-3,0-.3,0-.5.2-.4Z" style="fill: #7f3c32;"/>
  <path d="M57.6,147.3h-.1c-.2-.5.2-.5.1,0Z" style="fill: #7d2412;"/>
  <path d="M48.4,147.2c.2.2.5.5.6.9v.3c-.3-.3-.5-.7-.7-1h0c0-.1.1-.2.1-.2Z" style="fill: #efebe9;"/>
  <path d="M84.1,147c.1,1.6,0,3.3-.2,4.9h0c-.1.9-.4,1.9-.7,2.7-.2-.4,0-.7,0-1,.3-.9.4-1.7.5-2.6.2-1.2.1-2.3.2-3.5,0-.2,0-.3.1-.5Z" style="fill: #7e4439;"/>
  <path d="M28.5,147.5v.2c0,.7-.2,1.5-.5,2.2-.2-.4,0-.9.2-1.3.1-.3.1-.9.3-1.1Z" style="fill: #f2eae8;"/>
  <path d="M48.3,147.3c.2.3.4.7.7,1h0c-.4,0-.7-.5-.7-1Z" style="fill: #7f3b2f;"/>
  <path d="M15.3,148.5h.2c0-.1,0,.4,0,.4,0,.4,0,.9,0,1.3,0,.2,0,.5,0,.8v.3c.3,1.5.6,3,1.2,4.3-.1,0-.3-.1-.3-.3-.6-1.4-.8-2.8-1-4.4-.2-.8,0-1.7-.2-2.5Z" style="fill: #efebe9;"/>
  <path d="M49.7,149c.3.4.7.8,1,1.3v.3c-.4-.4-.8-.9-1.1-1.4h0c-.1-.2-.2-.4-.3-.6.3,0,.4.2.6.5Z" style="fill: #f3eae7;"/>
  <path d="M41.8,148.5c.3.5.1,1.4.1,2.1-.1,1.4-.4,2.9-.8,4.2-.6,2.4-1.7,4.5-2.9,6.5h-.2c1.7-2.5,2.9-5.6,3.4-8.7h0c.3-1.4.3-2.7.3-4Z" style="fill: #814036;"/>
  <path d="M49,148.5h0c0,.2.2.4.3.5-.3.3-.4-.2-.4-.5Z" style="fill: #7a2a1c;"/>
  <path d="M49.5,149.1c.4.5.7,1,1.1,1.4h0c-.3,0-.6-.4-.8-.7-.2-.2-.3-.4-.3-.7Z" style="fill: #803225;"/>
  <path d="M15.8,149.7c0,.4.2,1,0,1.3,0-.3,0-.5,0-.8,0-.3,0-.5.2-.5Z" style="fill: #763127;"/>
  <path d="M25.4,149.9h0c0,0,0,0,0,0h-.1c0,0,0,0,0,0Z" style="fill: #552213;"/>
  <path d="M94.2,149.8c.1,2,0,3.9,0,5.9,0,30.9,0,61.8,0,92.8,0,.5,0,1,0,1.4-.2-.4-.2-.8-.2-1.3,0-3.1,0-6.1,0-9.2,0-.6,0-1.1,0-1.7,0-9.8,0-19.8,0-29.5,0-1.7,0-3.3,0-4.9,0-1.6,0-3.2,0-4.8,0-1.6,0-3.1,0-4.7,0-4.9,0-9.9,0-14.8,0-2.5,0-5.1,0-7.6,0-1.2,0-2.3,0-3.5,0-5.5,0-11.1,0-16.6,0-.5,0-.9.1-1.4Z" style="fill: #9d3b2d;"/>
  <path d="M27.9,150.1v.3c-.3.4-.8.7-1.3.6-.3-.1-.7-.2-.8-.7h.2c.6.6,1.4.5,1.9-.1Z" style="fill: #7d392f;"/>
  <path d="M12.5,150.3c0,1.6.4,3.3.8,4.9-.4-.2-.4-.6-.5-1.1-.2-1.1-.4-2.1-.5-3.2,0-.3.1-.4.2-.6Z" style="fill: #88473d;"/>
  <path d="M74.2,150.3c.3.2,0,.6-.2.4,0-.1.2-.3.2-.4Z" style="fill: #782d1d;"/>
  <path d="M50.7,150.6c.2,0,.3,0,.5,0,.3.1.6.3,1,.3,1.7,0,3.5,0,5.2,0,.2,0,.5,0,.6.2.2.4.2.8,0,1.1,0-.4,0-.8-.2-1.1-1.6.1-3.3,0-4.9,0-.3,0-.5-.1-.8,0-.5,0-.9-.2-1.3-.4l-.2-.2Z" style="fill: #f6f3f0;"/>
  <path d="M73.9,150.7c-.4.3-.7.5-1.1.5-.7,0-1.3,0-2,0-.5.2-.9,0-1.4,0-.6.2-1.2,0-1.8,0-.3-.2-.6,0-.9,0-.9-.1-1.7,0-2.6,0-.7.1-1.3,0-2,0-.3,0-.6,0-.9,0v-.2c3.9,0,7.9,0,11.7,0,.3,0,.7-.5,1-.3Z" style="fill: #f8f6f4;"/>
  <path d="M50.9,150.8c.4.2.8.5,1.3.4.3-.1.5.1.8,0,1.6,0,3.3,0,4.9,0,.2.3.1.7.2,1.1,0,0,0,.2,0,.3.2,1.3.6,2.7.9,3.9l-.2.2c-.5-1.6-.8-3.3-1.1-5-1.1-.1-2.2,0-3.3,0-1,0-2.1.1-3-.3-.3,0-.3-.3-.4-.6Z" style="fill: #8f4b3f;"/>
  <path d="M16,151.2c.2,1,.3,2.1.7,3.1.4,1.3.9,2.4,1.6,3.5.1.2.2.4.1.7h0c-.5-.8-.9-1.7-1.3-2.5,0,0,0-.2-.1-.3-.6-1.4-.9-2.8-1.1-4.3,0,0,.1,0,.2-.1Z" style="fill: #854238;"/>
  <path d="M61.2,151.2c.3,0,.6,0,.9,0,0,.1,0,.2.1.3-.4,0-.7.1-1.1.2,0-.2,0-.3,0-.4Z" style="fill: #8d473a;"/>
  <path d="M61.2,151.7v.4c.2.6.3,1.3.5,1.9h0c.1.4.2.8.4,1.1h-.2c-.3-.9-.6-1.9-.8-3,0-.2,0-.3.1-.5Z" style="fill: #f1edeb;"/>
  <path d="M61.5,152c.1.6.2,1.1.3,1.7v.3c-.3-.6-.4-1.3-.6-1.9,0,0,.1,0,.2,0Z" style="fill: #84493f;"/>
  <path d="M83.8,151.9c.1.2.2.4.1.6-.2.9-.4,1.9-.8,2.7h-.2c0-.3.1-.4.2-.6h0c.3-.9.5-1.8.7-2.8Z" style="fill: #efe7e5;"/>
  <path d="M87,152c.3.5,0,1.1,0,1.6h-.2c0-.6.2-1.1.2-1.6Z" style="fill: #804037;"/>
  <path d="M58.3,152.4c.1,1.2.5,2.4.8,3.5.1.5.4.9.3,1.5l-.2-.4c0-.2-.1-.3-.2-.5-.4-1.3-.7-2.6-.9-3.9h.2Z" style="fill: #f2e7e4;"/>
  <path d="M41.5,152.5c-.5,3.2-1.8,6.2-3.4,8.7,0,0-.1.2-.2.2,0-.5.2-.7.4-1.1,1.3-2.1,2.2-4.4,2.8-7,.1-.3,0-.8.4-.9Z" style="fill: #eee8e5;"/>
  <path d="M38,153.2c-.2.8-.5,1.6-.8,2.4-.2-.4,0-.7.2-1.1.2-.4.3-1.1.6-1.2Z" style="fill: #87463b;"/>
  <path d="M86.7,153.8c.1.2.2.5,0,.7-.3,1.1-.6,2.3-1.1,3.3h-.2c.5-1.3.9-2.6,1.2-4Z" style="fill: #7f3d33;"/>
  <path d="M61.7,154c.3.1.4.5.5.8.2.6.5,1.2.7,1.8h-.1s0,0,0,0c-.2-.5-.4-1-.6-1.5-.1-.4-.3-.7-.4-1.1Z" style="fill: #833b32;"/>
  <path d="M83.2,154.6c0,.2-.1.4-.2.5,0,.1-.1.3-.2.4-.3.8-.7,1.5-1.1,2.1,0,0,0,.1,0,.2-.2.4-.5.8-.8,1.2-.2.3-.4.5-.6.8-.1.1-.3.3-.4.4v-.3c1-1.1,1.9-2.5,2.6-4,.2-.4.4-1.3.8-1.4Z" style="fill: #7f3429;"/>
  <path d="M13.3,155.2c.1.3.2.6.3.9-.3,0-.6-.6-.3-.9Z" style="fill: #844436;"/>
  <path d="M82.8,155.6c.1.2.1.4,0,.6-.2.6-.5,1.1-.9,1.6h-.2c.4-.7.8-1.4,1.1-2.2Z" style="fill: #ece2e0;"/>
  <path d="M37.1,155.8v.3c-.2.2-.3.3-.4.5-.2.3-.3.6-.5.9,0-.2,0-.4,0-.5.2-.4.4-1,.8-1.1Z" style="fill: #854035;"/>
  <path d="M17,155.9c.4.8.8,1.7,1.3,2.4-.5,0-.6-.6-.9-1.1-.2-.5-.5-.8-.4-1.3Z" style="fill: #ece5e2;"/>
  <path d="M13.7,156.6v.3c.2.1.2.3.3.4.2.4.3.8.5,1.1h-.2c-.2-.5-.5-1-.6-1.6v-.3Z" style="fill: #82382b;"/>
  <path d="M36.8,156.5c0,.3,0,.5-.1.7-.2.2-.2.6-.5.5,0-.1.1-.2.2-.3.2-.3.3-.6.5-.9Z" style="fill: #f3eae9;"/>
  <path d="M62.7,156.6h0s0,.1,0,.1c.1.2.2.5.4.7-.3.3-.6-.5-.4-.8Z" style="fill: #f0efef;"/>
  <path d="M62.8,156.7h.3c.4.7.7,1.4,1.2,2,.3.4.7.8.9,1.3v.3c-.5-.6-1-1.2-1.4-1.9,0,0,0-.1-.1-.2-.1-.2-.2-.3-.3-.5,0,0,0-.2-.1-.3-.1-.2-.2-.5-.4-.7Z" style="fill: #823d33;"/>
  <path d="M59.2,156.9l.2.4c.3.7.6,1.4,1,2.1h-.3c-.3-.7-.6-1.4-.9-2.1,0-.2,0-.3,0-.5Z" style="fill: #833e35;"/>
  <path d="M14.2,157.3c.2.5.5,1,.6,1.5v.3c-.1-.2-.3-.4-.4-.6-.2-.4-.3-.7-.5-1.1h.2Z" style="fill: #f1e9e8;"/>
  <path d="M63.3,157.7c.1.2.2.3.3.5-.3.3-.4-.2-.3-.5Z" style="fill: #f8f6f3;"/>
  <path d="M35.6,158.1h.2c-.2.4-.5.7-.8,1.1-.2.2-.4.5-.6.7v-.2c.4-.5.8-1,1.2-1.5Z" style="fill: #813a2d;"/>
  <path d="M36,157.9c0,.6-.5,1.3-1,1.3.3-.4.5-.7.8-1,0,0,.1-.2.2-.2Z" style="fill: #f2f0ef;"/>
  <path d="M81.6,157.9c0,.4,0,.5-.2.8-.2.2-.3.6-.6.4.3-.4.6-.8.8-1.2Z" style="fill: #f1eae5;"/>
  <path d="M85.4,158.2h.2c-.2.5-.4,1-.7,1.5h-.2c.2-.3.3-.7.5-1,0-.2.1-.3.2-.5Z" style="fill: #7c362c;"/>
  <path d="M18.6,158.5c.4.6.8,1.2,1.2,1.7.1.2.4.3.3.6h-.1c-.4-.6-.8-1-1.2-1.6-.1-.2-.3-.4-.4-.7h.2Z" style="fill: #7f3a30;"/>
  <path d="M18.3,158.6h0c.1.2.3.4.4.7-.3.3-.6-.3-.5-.7Z" style="fill: #f1ecea;"/>
  <path d="M63.7,158.4c.4.7.9,1.3,1.4,1.9h0c0,0,.1.2.1.2h-.4c-.4-.5-.9-1.1-1.2-1.6v-.5Z" style="fill: #f4efed;"/>
  <path d="M85.1,158.7c-.2.3-.3.6-.5,1-.2.3-.3.5-.5.8,0-.5.3-.8.5-1.2.2-.2.2-.7.5-.5Z" style="fill: #efeaea;"/>
  <path d="M15,159.7c.1.2.2.4.4.6.1.2.3.5.4.7h-.2c-.2-.4-.7-.8-.6-1.4Z" style="fill: #7d362b;"/>
  <path d="M34.3,160c-.1.2-.3.3-.5.5,0,0-.1.1-.2.2-.2.2-.4.4-.6.6-.2-.4.2-.5.4-.7.3-.2.5-.6.9-.6Z" style="fill: #7a3027;"/>
  <path d="M34.3,160h.1c.1.5-.3.6-.6.5.2-.1.3-.3.5-.5Z" style="fill: #f2e7e5;"/>
  <path d="M80.2,159.9c.2.3-.3.8-.5.6,0,0,0-.2.1-.2.1-.1.2-.3.4-.4Z" style="fill: #f7f3ef;"/>
  <path d="M15.8,161h0c-.1-.2-.3-.5-.4-.7.3-.3.6.4.5.7Z" style="fill: #f5f1ee;"/>
  <path d="M60.8,160.3c.2.2.3.5.4.8-.3.1-.6-.4-.4-.8Z" style="fill: #7e3c33;"/>
  <path d="M65.2,160.4c.3,0,.9.4.9.8h-.2c-.1-.2-.3-.4-.4-.5,0,0,0,0-.1-.1h-.1Z" style="fill: #7e3c33;"/>
  <path d="M79.4,160.4h.2c0,0,0,.2,0,.2-.2.1-.3.3-.5.4h-.2c0-.2.4-.5.6-.6Z" style="fill: #843f35;"/>
  <path d="M84.2,160.5c0,.7-.7,1.3-1,1.7-.3.3-.6,1.1-1.1,1h0c.6-.8,1.3-1.6,1.8-2.4,0-.1.2-.2.3-.3Z" style="fill: #81352a;"/>
  <path d="M20,160.7h.1c0,.2.1.3.2.3-.2.2-.7-.1-.3-.3Z" style="fill: #f6f3ee;"/>
  <path d="M33.7,160.6c.1.4-.2.5-.4.7-1.1,1-2.3,1.6-3.6,2.1-.3.1-.4,0-.7-.1,1.4-.3,2.7-1,3.8-1.9,0,0,0,0,.1,0,.2-.2.4-.4.6-.6Z" style="fill: #efe6e3;"/>
  <path d="M65.5,160.6c.1.1.3.3.4.4-.3.2-.6,0-.4-.4Z" style="fill: #f3efec;"/>
  <path d="M79.5,160.6c0,.4-.2.6-.5.4.2-.1.3-.3.5-.4Z" style="fill: #f3efea;"/>
  <path d="M83.9,160.9c-.6.8-1.2,1.6-1.8,2.3v-.3c.4-.6.8-1.1,1.2-1.7.2-.2.3-.5.6-.4Z" style="fill: #f2ebe9;"/>
  <path d="M61.5,161c.4.4.6.8,1,1.2.2.3.4.4.3.8-.1-.2-.2-.3-.4-.4h-.1c0-.1-.1-.3-.1-.3-.3-.4-.6-.7-.8-1.1v-.2s.1,0,.1,0Z" style="fill: #f0e7e5;"/>
  <path d="M20.8,161.2h0c0,0,0,.2,0,.2h-.1c0,0,0-.2,0-.2Z" style="fill: #601e14;"/>
  <path d="M32.9,161.4c-1.2.9-2.5,1.6-3.8,1.9-.5.2-1,.1-1.4.2-.8,0-1.5,0-2.2,0l.3-.2c.7,0,1.3,0,2,0,1.4-.1,2.8-.6,4.1-1.4.4-.2.7-.6,1.2-.5Z" style="fill: #7a362b;"/>
  <path d="M61.4,161.2c.3.4.6.7.8,1.1-.4,0-.9-.6-.8-1.1Z" style="fill: #7a2c1f;"/>
  <path d="M66.1,161.3c0,0,.2.1.3.2h.1c0,0,.1.2.1.2.6.4,1.1.8,1.7,1.1-.2.1-.3.2-.5,0-.6-.4-1.3-.8-1.8-1.3v-.2Z" style="fill: #efe9e7;"/>
  <path d="M66.5,161.4h0c0,0,0,.2,0,.2h-.1c0,0,0-.2,0-.2Z" style="fill: #5e2113;"/>
  <path d="M78.8,161.3v.2c-.3.3-.9,1-1.3.7.3-.2.6-.4.9-.6.1,0,.3-.2.4-.3Z" style="fill: #eee6e4;"/>
  <path d="M20.8,161.4c0,0,.2.1.3.2.9.7,1.9,1.2,3,1.6-.6.2-1-.1-1.6-.4-.6-.4-1.2-.6-1.7-1.1v-.3Z" style="fill: #f1e9e5;"/>
  <path d="M21.4,161.5c.5.3.9.6,1.4.9.5.2,1,.3,1.4.5,0,.1,0,.2,0,.3h-.1c-1-.4-2-.9-3-1.6h.3Z" style="fill: #834136;"/>
  <path d="M67.3,161.9c1.1.7,2.2,1.3,3.5,1.4,0,0,0,.2,0,.3-.5-.2-1.1-.2-1.6-.5-.1,0-.3-.1-.4-.2-.1,0-.2-.1-.4-.2-.6-.3-1.2-.7-1.7-1.1.3-.2.5,0,.7.2Z" style="fill: #88493e;"/>
  <path d="M78.4,161.6c-.3.2-.6.4-.9.6-.2.1-.4.2-.6.4h-.2c0-.3.3-.4.6-.6.4-.2.7-.5,1.1-.4Z" style="fill: #813e33;"/>
  <path d="M16.6,161.8c.3.2.5.6.7.9v.3s-.1-.1-.1-.1c-.3-.3-.5-.7-.8-1h.2Z" style="fill: #f1edea;"/>
  <path d="M16.4,161.9h0c.3.4.5.7.8,1-.4.2-.9-.6-.8-1Z" style="fill: #772c20;"/>
  <path d="M37.3,162.2h0c0,.1,0,.2,0,.2v-.2Z" style="fill: #571208;"/>
  <path d="M62.3,162.5h.1c0,.1-.1,0-.1,0Z" style="fill: #692214;"/>
  <path d="M76.5,162.5l.3.2c-.8.3-1.7.7-2.5.9-.2,0-.4,0-.3-.2.9,0,1.7-.6,2.6-.8Z" style="fill: #844338;"/>
  <path d="M37,162.6c0,.1-.2.2-.3.4-.2.2-.4.4-.5.6,0,0-.1,0-.2.1-.3.3-.6.5-.9.8v-.3c.3-.3.7-.6,1-1,.3-.3.5-.7.9-.7Z" style="fill: #ede8e5;"/>
  <path d="M76.7,162.7h0s.2,0,.2,0c0,.2-.2.4-.3.4-.8.3-1.6.7-2.4.8-.2,0-.4,0-.6-.2.2,0,.4,0,.6-.1.9-.2,1.7-.6,2.5-.9Z" style="fill: #f2e9e6;"/>
  <path d="M36.7,163c.3.4-.3.8-.5.6.2-.2.4-.4.5-.6Z" style="fill: #783024;"/>
  <path d="M68.7,162.9c.1,0,.3.1.4.2.5.3,1.1.3,1.6.5h.2c.5,0,1,.2,1.4.1.4,0,.8,0,1.1.2-1.4.2-2.8,0-4.2-.5-.3-.1-.5-.1-.6-.6Z" style="fill: #efedea;"/>
  <path d="M17.7,163.4c.3-.1.8.2.5.6-.1-.1-.2-.2-.3-.4,0,0-.1-.2-.2-.2Z" style="fill: #f2edeb;"/>
  <path d="M24.7,163.3c.2,0,.4.1.7.1.8,0,1.5.1,2.2,0,.1,0,.2.2.3.3-1.2.1-2.4,0-3.5-.2.1,0,.2-.2.3-.3Z" style="fill: #e9d7d2;"/>
  <path d="M71.2,163.5c.8,0,1.6,0,2.3,0v.2c-.3,0-.8,0-1.2,0-.5,0-1,0-1.4,0l.3-.2Z" style="fill: #803f35;"/>
  <path d="M81.9,163.4c.3.4-.3.8-.6.6.2-.2.4-.4.6-.6Z" style="fill: #7c3128;"/>
  <path d="M17.8,163.6c.1.1.2.2.3.4h.2c0,.1,0,.2,0,.2-.2.2-.8-.3-.5-.6Z" style="fill: #782a1d;"/>
  <path d="M35.9,163.8v.3c-.2.2-.5.6-.9.6h0c.3-.3.6-.6.9-.9Z" style="fill: #782f24;"/>
  <path d="M18.4,164.1c.4,0,.8.4,1.1.7.4.4.9.5,1.1,1.1-.6-.4-1.2-.8-1.7-1.3-.1-.1-.3-.2-.4-.3h0Z" style="fill: #ecdfdb;"/>
  <path d="M64,164.2c.2.2.4.3.6.5.2.1.3.3.5.4-.2.1-.3.1-.4,0-.3-.3-.6-.4-.7-.9Z" style="fill: #823f35;"/>
  <path d="M80.7,164.5c-.2.2-.3.3-.5.5-.2.2-.5.4-.7.5-.2.1-.5.3-.7.4-.2.1-.4.2-.5.3,0,0-.1,0-.2.1-.9.5-2,.9-3,1.2-.7,0-1.4.3-2.2.2.3-.3.6-.4,1-.4,1,0,1.9-.3,2.8-.7,1-.4,2-.9,2.9-1.6.4-.3.7-.6,1.1-.6Z" style="fill: #eadfdb;"/>
  <path d="M18.8,164.5c.5.5,1.2.9,1.7,1.3,0,0,0,0,.1.1.6.3,1.1.7,1.7.9-.1,0-.2.1-.4.1-.8-.5-1.6-.9-2.3-1.5-.3-.3-.8-.4-.9-1Z" style="fill: #7c372d;"/>
  <path d="M64.6,164.7c.2,0,.3,0,.5,0,.4.3.8.6,1.2,1h-.2c0,0-.2,0-.2,0-.2-.2-.5-.4-.7-.6-.2-.1-.3-.3-.5-.4Z" style="fill: #f0eae8;"/>
  <path d="M80.2,165c0,.1,0,.2,0,.3-.2.2-.5.6-.7.2.2-.2.5-.3.7-.5Z" style="fill: #783124;"/>
  <path d="M34.1,165.3c-1.3,1-2.8,1.8-4.3,2.1h0c-.3.1-.5.2-.9.2-.2,0-.5.1-.7.2-1,0-2.1.1-3.1-.1,0,0-.2,0-.3,0l.2-.2c.5,0,1.1.1,1.7.1.7,0,1.4,0,2.1-.2,1.5-.3,3-.7,4.3-1.7.3-.2.6-.6,1-.3Z" style="fill: #f0e5e2;"/>
  <path d="M34.1,165.3h0s-.1.3-.1.3c-1.1.9-2.4,1.5-3.7,1.9-.2,0-.4,0-.5-.2,1.5-.3,2.9-1.1,4.3-2.1Z" style="fill: #7e3b31;"/>
  <path d="M21.6,166.1c1,.6,2.1.9,3.1,1.1,0,0-.2.2-.3.2-.5-.2-1.1-.2-1.6-.5-.1,0-.3-.1-.4-.2-.6-.3-1.1-.6-1.7-.9.3-.3.6,0,.9.2Z" style="fill: #efe7e4;"/>
  <path d="M65.9,165.7h.2c.1.2.2.3.4.4-.3.2-.7,0-.6-.4Z" style="fill: #763024;"/>
  <path d="M66.8,166.1h0c0,.1-.3,0-.3,0,0-.2.2-.2.3,0Z" style="fill: #fef4f3;"/>
  <path d="M78.8,165.9c.3.3-.4.7-.5.3.2-.1.4-.2.5-.3Z" style="fill: #7d342a;"/>
  <path d="M67.4,166.3c1.6.8,3.4,1.3,5.1,1.1.2,0,.3,0,.3.3-1.3,0-2.6,0-3.9-.5-.5-.2-.9-.3-1.4-.6-.2-.1-.4-.2-.6-.3.2-.1.3-.2.5,0Z" style="fill: #eee4e1;"/>
  <path d="M66.8,166.4h.1c.2,0,.4.2.6.3-.3.3-.5,0-.7,0v-.2Z" style="fill: #752e24;"/>
  <path d="M78.1,166.4c-.1.6-.9.7-1.3.9-1,.4-2,.8-3.1.7-1.3,0-2.7.1-4-.2-.3-.1-.7-.1-.8-.5,1.3.4,2.6.6,3.9.5h0c.7,0,1.5-.2,2.2-.2,1-.3,2.1-.7,3-1.2Z" style="fill: #7d3b31;"/>
  <path d="M22.8,167c.5.2,1.1.3,1.6.5.1,0,.3,0,.5,0,0,.2-.2.2-.3.2-.6,0-1.2-.2-1.8-.5,0,0,0-.2,0-.3Z" style="fill: #803c32;"/>
  <path d="M29.8,167.4v.3c-.4,0-.8.4-.9-.2.3,0,.6,0,.9-.2Z" style="fill: #8b4a3f;"/>
  <path d="M25.1,167.8v-.2c1.1.2,2.2.2,3.2.1.2,0,.6,0,.6.2-1.2,0-2.4,0-3.5,0,0,0-.2,0-.3-.1Z" style="fill: #6e2e23;"/>
  <path d="M94.2,250c.1,1.6,0,3.3,0,4.9,0,12.6,0,25.3,0,37.9,0,1.1,0,2.3,0,3.4-.1-.4-.1-.8-.1-1.2,0-1.2,0-2.5,0-3.7,0-1.1-.1-2.2,0-3.3,0-2,0-3.9,0-5.9,0-1.8,0-3.6,0-5.4,0,0-.1-.2-.2-.2.1-.4.2-.7.2-1.2,0-3.8,0-7.5,0-11.3,0-2.3,0-4.6,0-6.8,0-1.6.1-3.1,0-4.7,0-.8,0-1.6.1-2.4Z" style="fill: #9d3c2d;"/>
  <path d="M94.2,296.2c0,1.2,0,2.4,0,3.6h-.1c0-.7,0-1.3,0-2,0-.6,0-1.1.1-1.6Z" style="fill: #9e3c2e;"/>
</svg>
`,

  infra_kombiweg: `
<svg id="infra_kombiweg" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 190 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,.6h5.5,0c0,.2-.1.4-.2.6,0,72.6,0,145.1,0,217.7,0,25.7,0,51.3,0,77,0,1.2,0,2.5,0,3.7v.4c.1,0,.1,0,.1,0H0V.6Z" style="fill: #b2b1ad;"/>
  <path d="M5.5.6h88.5v.3c-.1.3-.2.6-.2.9,0,4.6,0,9.1,0,13.6,0,4.4,0,8.7,0,13.1,0,1.7,0,3.4,0,5.1,0,1.7,0,3.5,0,5.3,0,9.1,0,18.2,0,27.3,0,.6,0,1.2.1,1.8h0c-.2,1.1,0,2.2-.1,3.3,0,.7,0,1.3.1,2h0c0,.3,0,.5-.1.7,0,5.4,0,10.8,0,16.2,0,1.9,0,3.8,0,5.7,0,.9,0,1.8,0,2.7,0,.7.1,1.4-.2,2,.4.8,0,1.6.3,2.3h0c-.3.7,0,1.5-.1,2.3,0,2.3,0,4.5,0,6.8,0,.6,0,1.2.1,1.8h0c-.2,1.2,0,2.5-.1,3.6,0,4.4,0,8.7,0,13.1,0,5.9,0,11.8,0,17.7,0,.6,0,1.2.1,1.8h0c0,.6-.1,1-.1,1.5,0,5.5,0,11,0,16.6,0,1.2,0,2.3,0,3.5,0,2.5,0,5.1,0,7.6,0,4.9,0,9.9,0,14.8,0,1.6,0,3.1,0,4.7,0,1.6,0,3.2,0,4.8,0,1.6,0,3.3,0,4.9,0,9.7,0,19.7,0,29.4,0,.6,0,1.1,0,1.7,0,3.1,0,6.1,0,9.2,0,.5,0,.9.2,1.3h0c-.2.9-.1,1.7-.1,2.5,0,1.6,0,3.1,0,4.7,0,2.3,0,4.5,0,6.8,0,3.8,0,7.5,0,11.3,0,.4-.1.8-.2,1.2,0,0,.1.2.2.2.1,1.8,0,3.6,0,5.4,0,1.9,0,3.9,0,5.8,0,1.1,0,2.2,0,3.3,0,1.2,0,2.5,0,3.7,0,.4,0,.8.1,1.2h0c-.2.6-.1,1.1-.1,1.7,0,.6,0,1.3,0,1.9h.1c0,0,.1.2.1.2h0c0,.1-88.6.1-88.6.1h0c0-.2.1-.4.1-.6,0-28.2,0-56.3,0-84.4,0-1.6,0-3.1,0-4.7,0-1.4,0-2.7,0-4.1,0-9.8,0-19.5,0-29.2,0-1.4,0-2.9,0-4.3,0-13.6,0-27.2,0-40.7,0-2.5,0-5.1,0-7.6,0-4.1,0-8.2,0-12.3,0-36.8,0-73.5,0-110.3,0-.4,0-.7-.1-1.1h0Z" style="fill: #9f5044;"/>
  <path d="M94,.6h.1c0,99.8,0,199.5,0,299.3h-.1c0-1.3,0-2.5,0-3.6h0c0-1.2,0-2.3,0-3.5,0-12.6,0-25.2,0-37.8,0-1.6,0-3.3,0-4.9h0c0-.6,0-1,0-1.5,0-30.9,0-61.7,0-92.6,0-2,0-3.9,0-5.9h0c0-.6,0-1,0-1.5,0-7.5,0-15.1,0-22.6,0-3.5,0-7,0-10.5,0-.5,0-1.1,0-1.6h0c0-.7,0-1.3,0-1.9,0-2.5,0-5.1,0-7.6s0-.9,0-1.4h0c0-.7,0-1.3,0-1.9,0-8.6,0-17.3,0-25.9,0-.6,0-1.2,0-1.8h0c.1-1.3,0-2.5,0-3.6,0-.5,0-1.1,0-1.6h0c.1-1.7,0-3.4,0-5,0-19.3,0-38.8,0-58.1,0-1.3,0-2.6,0-4v-.3Z" style="fill: #905349;"/>
  <path d="M94,.6h5.7v299.4h-5.6c0-.2,0-.4,0-.6,0-99.4,0-198.8,0-298.2,0-.2,0-.4-.2-.5h0Z" style="fill: #b2b1ad;"/>
  <path d="M5.5.7c0,99.8,0,199.5,0,299.3v-.4c-.2-1.2-.1-2.5-.1-3.7,0-25.7,0-51.3,0-77,0-72.6,0-145.1,0-217.7,0-.2,0-.4.2-.5Z" style="fill: #dcd2cd;"/>
  <path d="M5.5.7c.1.4.2.7.1,1.1,0,36.8,0,73.6,0,110.3,0,4.1,0,8.2,0,12.3,0,2.5,0,5.1,0,7.6,0,13.6,0,27.2,0,40.7,0,1.4,0,2.9,0,4.3,0,9.8,0,19.5,0,29.2,0,1.4,0,2.7,0,4.1,0,1.6,0,3.1,0,4.7,0,28.1,0,56.2,0,84.4,0,.2,0,.4-.1.5,0-99.8,0-199.5,0-299.3Z" style="fill: #793b31;"/>
  <path d="M94.1.7c.1.1.2.3.2.5,0,99.4,0,198.8,0,298.2,0,.2,0,.4,0,.6h0,0c0-99.9,0-199.6,0-299.3Z" style="fill: #f6efeb;"/>
  <path d="M93.9.9c0,1.3,0,2.6,0,4,0,19.3,0,38.8,0,58.1,0,1.6,0,3.3,0,4.9-.2-.6-.1-1.2-.1-1.8,0-9.1,0-18.2,0-27.3,0-1.8-.1-3.5,0-5.3,0-1.7,0-3.4,0-5.1,0-4.4,0-8.7,0-13.1,0-4.6,0-9.1,0-13.6,0-.3,0-.6.1-.9Z" style="fill: #9c3b2e;"/>
  <path d="M93.9,68c0,.5,0,1.1,0,1.6,0,1.2,0,2.4,0,3.6-.2-.7-.2-1.3-.1-2,0-1-.1-2.2.1-3.2Z" style="fill: #9f3d2f;"/>
  <path d="M93.9,73.3c0,.6,0,1.2,0,1.8,0,8.7,0,17.3,0,25.9,0,.6,0,1.2,0,1.8-.3-.8,0-1.5-.3-2.3.3-.7.1-1.3.2-2,0-.9,0-1.8,0-2.7,0-1.9,0-3.8,0-5.7,0-5.4,0-10.8,0-16.2,0-.2,0-.4.1-.6Z" style="fill: #9c3c2e;"/>
  <path d="M93.9,102.9c0,.5,0,.9,0,1.4,0,2.5,0,5.1,0,7.6,0,.6,0,1.2,0,1.8-.1-.6-.1-1.2-.1-1.8,0-2.3,0-4.5,0-6.8,0-.7-.2-1.6.1-2.2Z" style="fill: #9c3a2d;"/>
  <path d="M39.6,105c.3,0,.5,0,.8.2-.9,0-1.9,0-2.9,0-.3.2-.6.1-.8.3v-.2c.9-.4,1.9-.3,2.9-.3Z" style="fill: #6f2c20;"/>
  <path d="M40.7,105.1c.6-.1,1.2,0,1.8,0,.8,0,1.6-.1,2.4.1,0,1.1,0,2.2,0,3.3,0,.4,0,.9-.2,1.1-2.2,0-4.4,0-6.5,0-.4,0-.6.4-1,.3.2-.2.4-.3.6-.5.2,0,.4,0,.5,0,2.1,0,4.2-.2,6.3,0,0-.4,0-.8,0-1.3.2-.7.1-1.6.1-2.4,0-.2,0-.3-.1-.4-1.4,0-2.8,0-4.2,0l.2-.2Z" style="fill: #8a4d42;"/>
  <path d="M37.5,105.3c1,0,2,0,2.9,0h0c1.4,0,2.8,0,4.2,0,0,.9,0,1.9,0,2.8,0,.4,0,.8,0,1.3-2.1-.2-4.2,0-6.3,0,0-.4.4-.3.6-.3,1.8,0,3.7,0,5.5,0,0-1.1,0-2.3,0-3.4-2,0-3.9,0-5.9,0-.9.1-1.6,0-2.4.6-.5.3-.9,1-1.4,1,0,0,.1-.2.2-.3.2-.2.3-.4.5-.5.4-.3.7-.6,1.1-.8.3-.2.6,0,.8-.3Z" style="fill: #f3eae6;"/>
  <path d="M44.6,105.3c0,.1.1.2.1.4,0,.8.1,1.7-.1,2.4,0-.9,0-1.9,0-2.8Z" style="fill: #7a5c57;"/>
  <path d="M38.5,105.6c2,0,3.9,0,5.9,0,0,1.1,0,2.3,0,3.4-1.8,0-3.6,0-5.5,0-.3,0-.5-.1-.6.3-.2,0-.4,0-.5,0-.2.1-.4.3-.6.5h0c-.2.2-.2.4-.3.7l-.2-.2c-.6,2.5-1.1,5.1-1.7,7.6,0,0,.2-.1.3-.2v.3c1.9,0,3.8,0,5.7,0,1.4.1,2.8,0,4.3,0,1.7,0,3.2,0,4.9,0,1.1.2,2.1,0,3.2,0,.5,0,1,0,1.5,0,.9.1,1.8.1,2.8,0,.8.2,1.6,0,2.4,0,.2,0,.3,0,.4-.3,0-.1,0-.2.1-.4.2-.6.3-1.3.5-1.9.1-.6.4-1.2.5-1.7h-.5c-.5-.3-1.4-.4-2,0h0c-.3-.3-.6-.1-1-.2-.7,0-1.5-.1-1.9-1.1-.2-.6,0-1.4,0-2,.1-.2.3-.4.4-.5.3,0,.6,0,.9,0,2.6,0,5.3,0,7.9,0,.9,0,1.8,0,2.7.1,0,0,0,.1.1.2-.1.7.3,1.2.1,1.9,0,.5-.4.9-.8,1.1-.8.1-1.7.2-2.5.3-.3.3-.4,1-.6,1.4-.3,1.3-.7,2.5-1,3.8v.4c.1.5.4.8.6,1.3-.1.4,0,.4,0,.7.5,1,.8,2,1.3,3.1.3.7.5,1.5.8,2.2.4.9.7,1.9,1.1,2.7l.3.2c.2.4.3,1.2.7,1.3h.2c.9-.1,2-.6,2.9-.5.1,0,.3,0,.3-.4,0,0,.2,0,.2,0,0,.1,0,.3,0,.4.9,0,1.8-.1,2.7.1.3,0,.5.2.8-.1h.3s0,.2,0,.2v.2c1.3.3,2.7,1,3.9,1.9.8.6,1.6,1.3,2.3,2.1,0,.1.2.2.4,0,.2.2.3.4.5.6h0c0,0,0,.2,0,.2.1.3.5.9.8.8,0,0,0,.1,0,.2,0,.5.2.7.4,1.1.3.5.5,1,.8,1.5h.2c.3.5.5,1.1.8,1.7-.1.2-.1.4,0,.6.7,2,1.1,4,1.3,6.1,0,2.1,0,4.1-.3,6.2-.3,1.6-.7,3.2-1.4,4.7-.1.2,0,.3,0,.5,0,.2-.1.3-.2.5-.3-.1-.3.3-.5.5-.2.4-.5.7-.5,1.2h0c0,.2-.2.3-.3.4-.3,0-.4.2-.6.4-.4.6-.9,1.1-1.2,1.7v.3s0,0,0,0c0,0-.1,0-.2.2-.2.2-.4.4-.6.6-.2.2-.4.3-.6.5-.5,0-.7.3-1.1.6-.9.6-1.9,1.2-2.9,1.6-.9.4-1.8.8-2.8.7-.4,0-.6,0-1,.4h0c0-.3-.2-.4-.3-.3-1.7.2-3.5-.3-5.1-1.1-.2,0-.3,0-.5,0h-.1s0-.1,0-.1h0c-.1-.3-.2-.3-.3,0h0c-.1-.1-.3-.2-.4-.3h.2c-.4-.4-.8-.8-1.2-1.1-.1,0-.3-.1-.5,0-.2-.2-.4-.3-.6-.5-.4-.4-.8-.8-1.2-1.2,0-.4-.2-.5-.3-.8-.3-.4-.6-.9-1-1.2h-.1s0,0,0,0c-.1-.3-.3-.5-.4-.8-.1-.3-.3-.6-.5-.8-.4-.7-.7-1.4-1-2.1.1-.6-.1-1-.3-1.5-.3-1.1-.7-2.3-.8-3.5h-.2c0,0,0,0,0-.1.2-.4.2-.8,0-1.1-.2-.2-.4-.2-.6-.2-1.7,0-3.5,0-5.2,0-.3,0-.6-.2-1-.3-.2,0-.3,0-.5,0h-.2s0,0,0,0v-.3c-.3-.4-.6-.8-.9-1.3-.2-.2-.3-.5-.6-.5h0s-.1-.1-.1-.1h0c0,0,0-.4,0-.4-.1-.3-.4-.6-.6-.9h-.1s0,0,0,0c-.6-1-1.3-1.9-1.9-3,0-.4-.3-1.1-.7-1,0-.1-.2-.3-.3-.4.1-.5,0-.7-.4-.6-.3-.3-.5-.7-.7-1v-.2c0-.4-.2-.9-.5-.7h0s0-.2,0-.2h0c.1-.4-.3-1.2-.6-1h0s0-.2,0-.2c-.1-.3-.3-.5-.5-.8,0,0,0-.2-.1-.2-.3-.4-.5-.8-.8-1.2,0,0-.1-.1-.2-.2-.1-.2-.2-.4-.3-.5h-.1c-.2-.4-.4-.7-.6-.9,0-.5-.1-.7-.4-1-.2-.2-.3-.5-.6-.4-.2-.3-.4-.5-.6-.8,0,0,0-.1,0-.2,0-.4-.3-1.1-.7-1h0s-.2-.2-.2-.2c0-.1-.1-.2-.2-.3,0-.6-.3-.9-.6-1.3h-.2c-.1-.2-.3-.4-.4-.6.1-.4-.1-1-.5-.7,0-.2-.2-.3-.3-.5,0-.5-.3-.8-.6-1.1h-.2c-.2-.2-.3-.4-.5-.6-.2-.3-.3-.5-.4-.9h-.4c-.3,1-.4,2-.6,3,0,.2,0,.5.1.7-.1.5-.2,1-.3,1.4.2.2.5.3.7.5v.3c.6.3,1.1.8,1.7,1.2h.2c0,0,0,0,0,0,.3.3.6.5.9.8h0c0,.1.2.2.3.3-.1.4.2.5.3.8.4.4.7,1,1.1,1.4h.2s0,0,0,0v.3c0,.5.4.9.6,1.3h.2s0,0,0,0v.2c0,.5.3.9.5,1.3h.2c.1.2.2.4.3.7-.2.4.1.9.2,1.3.5,1.3.8,2.7,1,4.2.3,1.1.2,2.3.3,3.5,0,1.1,0,2.3-.2,3.3,0,.2,0,.5.1.7h0c-.3.2-.3.6-.4.9-.5,2.5-1.5,4.9-2.8,7-.2.4-.5.6-.4,1.1-.2.3-.4.5-.6.8v.2c-.2,0-.3.1-.3.2-.4,0-.6.4-.9.7-.3.4-.7.6-1.1,1v.3c0,0,0,0,0,0-.3.1-.6.5-.9.7h0c-.3-.2-.6.2-.9.4-1.3.9-2.8,1.4-4.3,1.7-.7,0-1.4.3-2.1.2-.5,0-1.1-.2-1.7-.1l-.2.2c-.2,0-.3,0-.5,0,0,0,.2-.2.3-.2-1.1-.2-2.1-.5-3.1-1.1-.3-.2-.5-.5-.9-.2,0,0,0,0-.1-.1-.1-.6-.7-.7-1.1-1.1-.3-.2-.7-.7-1.1-.7h-.2c.3-.5-.3-.9-.5-.7-.1-.1-.2-.2-.3-.4v-.3c-.2-.3-.4-.7-.7-.9h-.2s0,0,0,0c-.1-.3-.4-.5-.5-.8,0-.3-.2-1-.5-.7-.1-.2-.2-.4-.4-.6,0-.2-.2-.4-.3-.6v-.3c-.1-.5-.3-1-.6-1.5h-.2c0,0-.1-.2-.2-.4.2-.4,0-.8-.1-1.2-.6-1.6-.8-3.3-1-5,0-1.4,0-2.7,0-4.1,0-.8.3-1.5.3-2.3v-.2c-.1-.1-.1-.2,0-.4h.2c.2-1.3.7-2.7,1.2-4,.3-.7.7-1.3,1-2.1v-.3c0-.2.1-.4.3-.6.4.3.6-.3.5-.7,0,0,0-.1.1-.2.3.2.5-.4.7-.6,1.8-2.6,4.2-4,6.8-5,1.5-.7,3-.5,4.6-.5.4,0,.7.2,1,.2v-.2s.1-.3.1-.3l.2.2c.3-2.1.9-4.1,1.3-6.1.3-1.1.5-2.3.8-3.5,0-.4.3-.8,0-1.2,0-.2,0-.4,0-.5v.5s.2,0,.2,0c.4-1.7.7-3.4,1.1-5,.2-.9.3-1.9.5-2.8,0-.2,0-.4,0-.6v-.2c0,0,0,0,0,0l.2.2c.1-.5.2-1.1.4-1.7.1-.4.4-.7.4-1.2,0-.1.1-.2.2-.3.5,0,.9-.7,1.4-1,.8-.6,1.5-.5,2.4-.6Z" style="fill: #d6d4d1;"/>
  <path d="M35.5,106.4c-.2.2-.4.3-.5.5-.2-.3.3-.9.5-.5Z" style="fill: #7e2e24;"/>
  <path d="M34.5,107.5c0,.5-.2.8-.4,1.2-.2.5-.3,1.1-.4,1.7l-.2-.2c0-.2.1-.5.2-.7,0-.4.2-.7.3-1.1.2-.3.3-.6.5-.9Z" style="fill: #f4e9e5;"/>
  <path d="M33.8,108.3h.2c-.1.4-.2.8-.3,1.2-.3-.4,0-.8,0-1.2Z" style="fill: #7f3e33;"/>
  <path d="M56.8,109.4c1.2,0,2.4,0,3.5,0-.2.2-.5.1-.8.2-.9,0-1.8,0-2.7,0h0Z" style="fill: #6c2216;"/>
  <path d="M62.9,109.4c1.6,0,3.1,0,4.7,0v.3c-.4-.1-.6-.1-.8,0-1.2-.2-2.3.2-3.5,0-.4.2-.7,0-1.1.1.2-.1.4-.3.6-.4Z" style="fill: #874338;"/>
  <path d="M66.8,109.7c.2-.1.4-.1.6,0,.2,0,.4.2.5.3-.9,0-1.8-.2-2.7-.1-2.6,0-5.3,0-7.9,0-.3,0-.6,0-.9,0,.5-.5,1.2-.1,1.8-.3.7,0,1.4,0,2.1.1.6-.1,1.2,0,1.8,0,.4-.2.7,0,1.1-.1,1.1.2,2.3-.2,3.5,0Z" style="fill: #f5eae6;"/>
  <path d="M33.4,109.9l.2.2v.2c-.2.6-.3,1.2-.4,1.8-.3-.6.2-1.6.2-2.3Z" style="fill: #742f23;"/>
  <path d="M37.2,109.9c0,.7-.2,1.4-.4,2.2-.1.4,0,.8-.4.9.2-.8.3-1.6.5-2.5,0-.2.1-.4.3-.6Z" style="fill: #894b42;"/>
  <path d="M36.7,110.3l.2.2c-.2.8-.3,1.6-.5,2.5v.2c-.3.9-.5,2-.7,3h0c-.1.4-.2.8-.2,1.2,0,.1,0,.2-.1.3,0,0-.2.2-.3.2.6-2.5,1.1-5.1,1.7-7.6Z" style="fill: #efe8e5;"/>
  <path d="M68.1,110.2l.2.3c0,.3.2.5.2.8,0,.8-.1,1.3-.6,1.8-.8.7-2,.4-2.9.5-.2.3-.3.7-.4,1,0,.2-.1.4-.2.7-.3,1.3-.7,2.5-1.1,3.8v-.4c.2-1.3.6-2.5.9-3.8.1-.5.2-1.1.6-1.4.8-.1,1.7-.1,2.5-.3.4-.2.8-.6.8-1.1.2-.7-.2-1.2-.1-1.9Z" style="fill: #ede5e2;"/>
  <path d="M68.5,111.4c0-.3-.1-.6-.2-.8.4-.4.6.6.2.8Z" style="fill: #824339;"/>
  <path d="M33.5,110.4c.1.2.1.4,0,.6-.2.9-.3,1.9-.5,2.8-.4,1.7-.7,3.3-1.1,5h-.1c0,0,0-.4,0-.4.1-.5.2-.9.3-1.4.1-.7.4-1.4.5-2.2,0-.4.2-.7.3-1.1.1-.5.3-1.1.3-1.6,0-.6.2-1.2.4-1.8Z" style="fill: #eee6e3;"/>
  <path d="M56.1,110.4c0,.6-.2,1.4,0,2,.4.9,1.2,1,1.9,1.1.4,0,.7-.1,1,.2h-.3c-.3,0-.6.1-1,0-.3,0-.5,0-.8-.1-.1,0-.3-.1-.4-.2-.2-.2-.4-.4-.6-.7-.2-.8-.3-1.5.1-2.2Z" style="fill: #eee5e3;"/>
  <path d="M56,112.6c.1.3.3.5.6.7-.3.3-.8-.4-.6-.7Z" style="fill: #7d3429;"/>
  <path d="M36.4,113.2c0,1-.2,2-.5,2.9h-.2c.3-.9.4-1.9.7-2.9Z" style="fill: #814034;"/>
  <path d="M67.9,113.2v.3c-.7.7-1.9.4-2.7.5-.3,0-.3.6-.4.9l-.2-.2c0-.3.2-.7.4-1,.9,0,2.2.2,2.9-.5Z" style="fill: #7b372d;"/>
  <path d="M61,113.7c-.7,0-1.3,0-2,0,.5-.4,1.4-.3,2,0Z" style="fill: #fbf0ec;"/>
  <path d="M32.6,113.7h.2c0,.5-.2.8-.3,1.2-.3-.4,0-.8,0-1.2Z" style="fill: #7f3e33;"/>
  <path d="M56.9,113.6c.3.1.5,0,.8.1-.1.2-.3.2-.5.2-.2,0-.6,0-.3-.3Z" style="fill: #6f2c22;"/>
  <path d="M58.7,113.7h.3s0,0,0,0c.7,0,1.3,0,2,0h.5c0,.6-.4,1.2-.5,1.7-.2.6-.3,1.3-.5,1.9-.2-.6.2-1.1.3-1.7.1-.6.4-1.1.5-1.8-.7,0-1.3,0-2,0-.2,0-.4,0-.5-.2Z" style="fill: #77342a;"/>
  <path d="M93.9,113.8c0,.5,0,1.1,0,1.6,0,3.5,0,7,0,10.5,0,7.5,0,15.1,0,22.6,0,.5,0,.9,0,1.4-.2-.6-.1-1.2-.1-1.8,0-5.9,0-11.8,0-17.7,0-4.4,0-8.7,0-13.1,0-1.2,0-2.4.1-3.5Z" style="fill: #9d3c2e;"/>
  <path d="M64.5,115.3c.1.3.1.5,0,.8-.3,1-.6,2-.8,3,.1.5.4,1,.6,1.5v.3c-.2-.2-.2-.4-.3-.6-.2-.5-.4-.8-.5-1.3.4-1.2.7-2.5,1.1-3.8Z" style="fill: #76332a;"/>
  <path d="M35.6,116.3c.3.4,0,.8,0,1.3h-.2c0-.5.1-.9.2-1.3Z" style="fill: #7a3c30;"/>
  <path d="M31.9,117h.2c0,.6-.2,1.1-.3,1.5,0,.2,0,.3,0,.5-.2.8-.4,1.6-.5,2.4-.1-.4-.1-.6,0-1,.3-1.1.5-2.3.7-3.4Z" style="fill: #783025;"/>
  <path d="M60.4,117.7c0,.2-.2.3-.4.3-.8,0-1.6.1-2.4,0-.9.1-1.8,0-2.8,0-.5,0-1,0-1.5,0-1.1,0-2.1.1-3.2,0-1.7.2-3.2,0-4.9,0-1.4,0-2.8,0-4.3,0-1.8,0-3.8,0-5.6,0v-.3c7.1,0,14.4,0,21.6,0,1.1,0,2.3,0,3.4,0Z" style="fill: #672016;"/>
  <path d="M31.7,119c.2.4,0,.8,0,1.2-.3,1.1-.5,2.3-.8,3.5-.4,2-1,4-1.3,6.1l-.2-.2c.1-.6.2-1.2.4-1.9h0c.2-.9.4-1.7.6-2.6.1-.6.3-1.2.4-1.9.2-.4.2-.8.3-1.2,0-.2,0-.5.1-.8.2-.8.4-1.6.5-2.4Z" style="fill: #f0e8e5;"/>
  <path d="M63.9,120.4c0,.2.2.4.3.6,0,.1.1.2.2.3,0,.3.2.5.3.7.1.5.4,1,.5,1.5.5,1.3,1.2,3.1,1.7,4.5.1.4.3.8.5,1.2l-.3-.2c-.4-.9-.7-1.9-1.1-2.7-.3-.7-.5-1.5-.8-2.2-.4-1-.7-2.1-1.3-3.1-.2-.3-.2-.3,0-.7Z" style="fill: #efe8e5;"/>
  <path d="M59.2,121.3c0,.4.2.8,0,1.1-.4,1.2-.7,2.5-1.1,3.6-.4,1.6-1,3.1-1.4,4.7,0,.2-.2.3-.4.4.2-.7.4-1.5.7-2.2.2-1,.7-1.8.8-2.8.5-1.3.8-2.8,1.3-4.2-.8,0-1.6,0-2.4,0h0c-.2,0-.3,0-.4,0h0c-2.1,0-4.2,0-6.2,0-1.1,0-2.1,0-3.2,0-.7,0-1.3,0-2,0-1.2,0-2.5,0-3.7,0v-.3c.7-.1,1.4,0,2,0,1.3,0,2.6,0,4,0,1,.1,2,0,3,0,1.4,0,2.7,0,4.1,0,1.2,0,2.3,0,3.5,0,.6,0,1.1.3,1.5-.3Z" style="fill: #ecdfdb;"/>
  <path d="M64.3,121.3c.4-.1.4.3.3.7-.1-.2-.2-.5-.3-.7Z" style="fill: #7f4238;"/>
  <path d="M35.2,121.7c1.2,0,2.3,0,3.5,0v.2c-.2,0-.4.1-.6.2-.5,0-1,0-1.5,0-.5,0-.9,0-1.4-.2v-.2Z" style="fill: #ece4e2;"/>
  <path d="M39.2,121.8c.6,0,1.2-.1,1.8,0,0,.1-.1.3-.3.4-.5,0-1.1,0-1.6,0h-.3c.1-.2.2-.3.4-.3Z" style="fill: #eddfdb;"/>
  <path d="M30.8,122l.2.2c-.1.4-.1.8-.3,1.2-.2-.4,0-.9,0-1.3Z" style="fill: #78382c;"/>
  <path d="M35.1,122c.5,0,1,0,1.4,0,.5,0,1,0,1.5,0,.2,0,.5,0,.7,0h.2s-.2.2-.2.2c-1.1.1-2.1,0-3.2,0,.1.4.4.6.6,1v.3c-.3-.5-.8-1-1.1-1.5Z" style="fill: #6f291e;"/>
  <path d="M39,122h0c.3.2.6.2,1,.2,1.5,0,3,0,4.6,0,.9,0,1.7,0,2.6,0,.8,0,1.6,0,2.4,0,.7,0,1.3,0,2,0,.7,0,1.4,0,2.1,0,.7,0,1.4.1,2.1,0l.3-.2h0c0,.3.3.3.4,0h0s.3.2.3.2c.6,0,1.2,0,1.8,0-.3,1.6-.9,3.1-1.3,4.6-.7,2.1-1.4,4.3-1.9,6.5-.2.9-.5,1.7-.7,2.5v.3c.1,0,0,.3,0,.3,0-.2-.1-.2-.2-.1-.4,1-.6,2.2-1,3.2v.3c.1.1.1.2,0,.3-.2-.5-.4,0,0,.2h0c-.3.3-.4.7-.5,1.1-.3,1.3-.7,2.6-1.1,3.9,0,.4-.2.7-.3,1-.2-.1-.3-.4-.5-.6h-.2c0,0-.1,0-.2-.1h0c0,0,0-.3,0-.3-.7-1.1-1.5-2.3-2.3-3.3-.1-.1-.2-.2-.4-.2h0c0-.1,0-.5,0-.5-.4-.6-.8-1.2-1.2-1.8h-.2c0,0,0,0,0,0l-.2-.2c0-.1-.1-.3-.2-.4,0-.3,0-.5-.2-.7-.6-.9-1.2-2-1.9-2.8-.2-.2-.3-.9-.7-.7h0c0-.4,0-.5-.2-.8-1.1-1.5-2.1-3.1-3.1-4.6-1.1-1.4-1.9-3-3-4.3h-.2s0,0,0,0h0c0-.6-.3-1.1-.7-1.1,0,0,0-.2-.1-.2v-.3c-.2-.3-.5-.6-.6-1,1.1-.1,2.1,0,3.2,0l.2-.2Z" style="fill: #9f5045;"/>
  <path d="M39,122c.5,0,1.1,0,1.6,0,.1,0,.3,0,.4,0,1.2,0,2.5,0,3.7,0,.7,0,1.3,0,2,0,1.1,0,2.1,0,3.2,0,2,0,4.1,0,6.2,0l-.3.2c-.7.1-1.4,0-2.1,0-.7,0-1.4,0-2.1,0-.7,0-1.3.1-2,0-.8,0-1.6,0-2.4,0-.9,0-1.7,0-2.6,0-1.5,0-3,0-4.6,0-.4,0-.7,0-1-.2Z" style="fill: #6c2c21;"/>
  <path d="M56.2,122c.1,0,.3,0,.4,0-.1.3-.4.3-.4,0Z" style="fill: #6a2c20;"/>
  <path d="M56.7,122c.8,0,1.6,0,2.4,0-.4,1.4-.8,2.8-1.3,4.2-.1,1-.6,1.8-.8,2.8-.2.7-.5,1.5-.7,2.2h0c0,.5-.3.9-.3,1.3,0,.4-.3.7-.3,1.2-.2.5-.3,1-.5,1.5v.2c-.2.3-.3.5-.3.7v-.3c0-.9.4-1.7.6-2.5.6-2.2,1.2-4.3,1.9-6.5.4-1.5,1-3.1,1.3-4.6-.6,0-1.2,0-1.8,0l-.3-.2Z" style="fill: #7e3b31;"/>
  <path d="M65.4,123.5c.2.4.3.8.5,1.3.3,1,.8,1.9,1.1,2.9v.3c-.6-1.4-1.2-3.1-1.8-4.5h.2Z" style="fill: #7c352b;"/>
  <path d="M36.3,123.8c.4,0,.7.5.7,1-.2-.3-.5-.7-.7-1Z" style="fill: #813d32;"/>
  <path d="M61.6,124.1c.2,0,.3,0,.5,0,.6,1.3,1.1,2.8,1.6,4.2.3,1,.8,2,1.1,3,0,.3.3.5,0,.8-.3-.6-.5-1.2-.7-1.8-.1-.3-.2-.5-.3-.8-.3-.9-.6-1.8-1-2.6-.4-.8-.7-2-1.1-2.7-.2.6-.3,1.2-.6,1.8v.2s-.2-.3-.2-.3c.1-.6.3-1.2.5-1.8Z" style="fill: #f0e9e6;"/>
  <path d="M61.8,124.1c.4.7.8,1.9,1.1,2.7.4.8.6,1.7,1,2.6h-.2c-.6-1.5-1.1-3.2-1.8-4.7-.2.4-.2,1.1-.6,1.2.3-.6.3-1.2.6-1.8Z" style="fill: #7f3f35;"/>
  <path d="M37.3,124.8c1.1,1.3,1.9,3,3,4.3,1,1.5,2,3.1,3.1,4.6.2.3.2.4.2.8-.3-.5-.7-1-1.1-1.6h0c-.2-.5-.5-.8-.7-1.1-.1-.2-.3-.4-.4-.6-.2-.2-.3-.5-.5-.7,0,0,0-.2-.1-.2-.3-.4-.6-.8-.8-1.2-.4-.6-.8-1.2-1.2-1.7-.2-.3-.3-.5-.5-.8,0-.2-.2-.3-.3-.4-.3-.5-.6-.9-.9-1.3h.2Z" style="fill: #843b31;"/>
  <path d="M61.9,124.8c.7,1.5,1.2,3.2,1.8,4.8h.2c.1.2.2.4.3.7-.3.5.3,1.1.3,1.6,0,.2-.2.5-.3.7h0s-.2,0-.2,0c-.5.4-1,1-1.5,1.5-.5.6-1.2,1.3-1.6,2v.4c0,.2-.2.3-.3.4-.2,0-.3,0-.4.1-.7,1.2-1.3,2.5-1.7,3.8v.3c.1,0,0,0,0,0-.3,0-.3.5-.4.7-.1.4-.1.4,0,.8h0c-.4.2-.4.6-.5,1,0,.4-.2.7,0,1.1,0,.1,0,.3,0,.4v-.4s-.2,0-.2,0c0,.5-.2,1.3.1,1.8,0,.2,0,.5,0,.7h-.1c.1-.5-.3-.5-.1,0h-.1c-.5-.5-1.3-.1-1.9-.2,0-.5.4-1,.2-1.5,0-.3.2-.6.3-.9.4-.2.4-.6.5-1,0-.4.3-.8,0-1.2h0c.3,0,.6-.6.3-.9,0-.2,0-.4.2-.6.4-.2.4-.6.5-1,.3-1.2.7-2.2,1-3.4.8-2.6,1.5-5.3,2.3-7.9.2-.7.4-1.3.6-2v-.3c0,0,0-.1,0-.1h.1s0-.1,0-.1h0c0-.1-.1-.2-.1-.2v-.2c.5,0,.5-.8.7-1.2Z" style="fill: #9f5044;"/>
  <path d="M37,124.9h0c.3.4.6.9.9,1.3-.3.1-.4-.2-.6-.4-.2-.3-.4-.5-.4-.9Z" style="fill: #f1eae8;"/>
  <path d="M30.3,125.2c-.2.9-.4,1.7-.6,2.6v-.3c0-.6,0-1.1.2-1.7,0-.3.2-.4.4-.6Z" style="fill: #8c483d;"/>
  <path d="M33.2,126h.2c-.2,1.2-.5,2.4-.7,3.6-.1-.2-.2-.5-.1-.7.2-1,.4-2,.6-2.9Z" style="fill: #ebe3e0;"/>
  <path d="M33.4,125.9h.2c0,.3.3.6.4.9-.2,0-.3-.1-.5-.2-.2,1-.4,2-.6,2.9,0,.4-.3,1-.2,1.4.4.3.8.4,1.1.7v.3c-.3-.1-.5-.3-.8-.4-.2-.2-.5-.2-.7-.5,0-.5.2-1,.3-1.4.2-1.2.5-2.4.7-3.6Z" style="fill: #823f35;"/>
  <path d="M61.2,126.2h.1s0,.2,0,.2h0c0,.1-.1.1-.1.1v-.3Z" style="fill: #6a2519;"/>
  <path d="M38.3,126.6c.2.3.3.5.5.8-.4,0-.6-.3-.5-.8Z" style="fill: #f5eeee;"/>
  <path d="M61.1,126.6v.3c0,.7-.3,1.3-.5,2-.8,2.6-1.5,5.3-2.3,7.9-.3,1.1-.7,2.2-1,3.4-.1.4-.2.8-.5,1,.3-1.2.7-2.3,1-3.5.2-.8.5-1.6.7-2.4.3-.9.5-1.8.8-2.7,0-.6.3-1.1.5-1.6v-.2c.4-1.3.8-2.7,1.2-4v-.3Z" style="fill: #854237;"/>
  <path d="M61,126.9c-.3,1.3-.8,2.8-1.1,4v-.3c.1-.8.4-1.7.6-2.5.1-.4.2-1,.6-1.2Z" style="fill: #eee8e5;"/>
  <path d="M34.7,127.4c.3.3.6.6.6,1.1h-.1c-.2-.3-.4-.6-.6-.9v-.2c-.1,0,0,0,0,0Z" style="fill: #f4eceb;"/>
  <path d="M34.6,127.6c.2.3.4.5.6.9-.4,0-.7-.4-.6-.9Z" style="fill: #7f372c;"/>
  <path d="M29.4,127.9h.2c-.1.5-.2,1.1-.4,1.7v.3c-.4,0-.6-.1-.9-.1.2-.2.4-.2.7-.3.2-.5.2-1.1.4-1.6Z" style="fill: #844439;"/>
  <path d="M36,129.7c-.2-.2-.3-.5-.5-.7.3-.3.6.3.5.7Z" style="fill: #f2eeed;"/>
  <path d="M39.9,129.1c.2.4.6.8.8,1.2-.3.1-.4-.2-.6-.4-.2-.3-.2-.4-.2-.8Z" style="fill: #f4eeed;"/>
  <path d="M28,129.5c.2,0,.3,0,.3.2h-.4c-.2,0-.4,0-.6,0-1.4,0-2.6,0-3.9.6h-.3c.4-.4,1-.5,1.5-.6,1.1-.3,2.2-.2,3.4-.2Z" style="fill: #75291e;"/>
  <path d="M70.9,129.4c1,0,2,0,2.9,0l-.2.3c-.6-.1-1.3,0-1.9,0,0,0-.2,0-.2,0-.6.1-1.3.1-1.9.3v-.3c.5-.1.9-.2,1.3-.2Z" style="fill: #803d33;"/>
  <path d="M27.4,129.7c.2,0,.4.1.6,0,.1,0,.3,0,.4,0,.3,0,.6.1.8.1v.2c-.4,0-.7-.2-1-.2-1.6,0-3.1-.2-4.6.5-2.6,1-5,2.4-6.8,5-.2.2-.4.8-.7.6.3-.4.5-.8.8-1.1,0,0,0-.1.1-.2.3-.3.5-.6.8-.9.2-.2.5-.4.7-.7.5-.4.9-.8,1.5-1.1.2-.1.4-.3.6-.4.6-.3,1.2-.8,1.8-.9.4-.1.7-.4,1.1-.5,1.3-.6,2.6-.5,3.9-.6Z" style="fill: #e8ddd9;"/>
  <path d="M71.8,129.7c.6.1,1.3,0,1.9,0,.1,0,.2,0,.3,0,.4,0,.7.3,1.1.2-.3.3-.5.2-.8.1-.8-.3-1.8,0-2.7-.1,0-.1,0-.3,0-.4Z" style="fill: #e6dbd8;"/>
  <path d="M75.5,129.9v.2c-.1,0-.4,0-.4,0-.4,0-.7-.2-1.1-.2.4-.4,1,0,1.5,0Z" style="fill: #792b20;"/>
  <path d="M69.5,130c-.4,0-.8.2-1.2.3.2-.5.8-.7,1.2-.3Z" style="fill: #844c41;"/>
  <path d="M71.6,129.7c0,.3-.2.4-.3.4-1,0-2,.4-2.9.6h-.2c0-.1.1-.2.2-.3.4,0,.8-.3,1.2-.3h.2c.6-.2,1.3-.2,1.9-.4Z" style="fill: #f1ece8;"/>
  <path d="M76.7,130.3v.2c-.4-.1-.8-.3-1.1-.3.4-.3.7,0,1.1,0Z" style="fill: #792b20;"/>
  <path d="M36.7,130.3c.3.3.6.7.6,1.3h0c-.2-.4-.4-.7-.7-1v-.2c0,0,.1,0,.1,0Z" style="fill: #f0e9e6;"/>
  <path d="M75.3,130.2h.2c.4,0,.7.2,1,.3,0,0,.2,0,.3.1h.1c.2.2.4.2.5.3.5.2.9.5,1.4.8.3.2.5.4.8.6.8.7,1.6,1.3,2.3,2.1-.2,0-.3,0-.4,0-.7-.8-1.5-1.5-2.3-2.1-1.3-.9-2.6-1.6-4-1.9v-.2Z" style="fill: #eee5e2;"/>
  <path d="M64.2,130.3c.2.6.4,1.2.7,1.8,0,0,0,.1-.1.2-.2.1-.4.3-.5.4,0-.2.2-.5.3-.7,0-.5-.6-1.2-.3-1.6Z" style="fill: #844135;"/>
  <path d="M76.9,130.5c.2-.1.3,0,.2.1h-.1c0,0-.1,0-.1,0h0Z" style="fill: #6c2119;"/>
  <path d="M21.9,130.6c.1,0,.3,0,.4.2-.6.2-1.2.6-1.8.9v-.3c.4-.3.9-.6,1.4-.8Z" style="fill: #823d31;"/>
  <path d="M36.5,130.5c.3.3.5.7.7,1-.3.1-.7-.7-.7-1Z" style="fill: #793023;"/>
  <path d="M40.9,130.6c.2.2.3.5.5.7-.3.3-.6-.3-.5-.7Z" style="fill: #f3f0ef;"/>
  <path d="M77.8,130.8c.4.2.8.4,1.2.7v.2c-.5-.3-1-.6-1.4-.8h.3Z" style="fill: #793027;"/>
  <path d="M59.6,131.1c0,0,.2,0,.2,0-.2.5-.4,1-.5,1.6-.3.9-.5,1.8-.8,2.7-.1.8-.5,1.6-.7,2.4-.4,1.1-.7,2.3-1,3.5,0,.2-.1.4-.2.6,0,.3-.2.6-.3.9h0c-.1.4-.1.8-.3,1.1,0-.5,0-.7,0-1.1.3-.9.5-1.9.8-2.9.7-2.2,1.3-4.4,2-6.6.2-.7.4-1.4.6-2.1Z" style="fill: #efe9e6;"/>
  <path d="M56.4,131.3c0,.2.1.3.1.5-.2.8-.5,1.5-.6,2.3-.1.4-.1,1-.6,1.2.2-.5.3-1,.5-1.5,0-.4.2-.7.3-1.2,0-.4.3-.8.3-1.3Z" style="fill: #eededa;"/>
  <path d="M33.1,131.5c.2.1.5.3.7.4.4.3.8.6,1.2.9h-.2c-.6-.3-1.1-.8-1.8-1.1v-.3Z" style="fill: #efe7e3;"/>
  <path d="M19.9,132.1c-.5.3-1,.8-1.5,1.1,0-.5.4-.6.7-.9.3-.2.4-.5.7-.2Z" style="fill: #813429;"/>
  <path d="M37.5,131.8l.2.2h0c.2.3.4.7.6,1h-.2c-.2-.3-.6-.7-.6-1.2Z" style="fill: #7c2e22;"/>
  <path d="M38.3,133h0c-.2-.3-.4-.6-.6-1,.4-.2.7.6.7,1Z" style="fill: #efeceb;"/>
  <path d="M41.7,131.9c.2.4.5.7.7,1.1-.4-.1-.8-.5-.7-1.1Z" style="fill: #f1f2f1;"/>
  <path d="M79.9,132.2c.7.6,1.6,1.3,2.2,2.1.1.2.5.5.4.8-.2-.2-.3-.4-.5-.6-.7-.8-1.5-1.5-2.3-2.1h.2Z" style="fill: #80382d;"/>
  <path d="M64.8,132.3v.3c-.4.3-.9,1-1.4,1,.3-.3.5-.6.8-.8h0c.2-.2.4-.3.5-.4Z" style="fill: #efeeeb;"/>
  <path d="M64,132.6h.2c-.3.3-.6.6-.8.9-.5.5-.9,1-1.4,1.5-.4.5-.8,1-1.3,1.6v-.4c.5-.7,1.1-1.3,1.7-2,.5-.5,1-1.1,1.5-1.5Z" style="fill: #82382b;"/>
  <path d="M35.1,132.8c.1,0,.3,0,.4,0,.2.2.6.4.5.8-.3-.3-.6-.6-.9-.8Z" style="fill: #7d3025;"/>
  <path d="M42.5,133c.3.5.7,1,1.1,1.6h0c.1.2.2.4.3.6h-.2c-.2-.3-.4-.7-.7-1-.3-.4-.6-.6-.5-1.2Z" style="fill: #efecea;"/>
  <path d="M38.4,133.2c.2.3.4.6.6.8.3.5.7.8,1,1.4.2.3.4.5.6.8-.4,0-.5-.4-.7-.7-.5-.7-1-1.3-1.4-2v-.3Z" style="fill: #87443a;"/>
  <path d="M72.7,133.4c.7.2,1.5.1,2.2.4.7.2,1.4.5,2.1.8v.3c-.7-.3-1.4-.6-2.1-.8,0,0-.1,0-.2,0-.7,0-1.3-.3-2-.2,0-.1,0-.2,0-.4Z" style="fill: #f0e8e5;"/>
  <path d="M25.3,133.5c1,0,2,0,3.1,0v.3c-1,0-2-.2-2.9,0,0-.1,0-.2-.1-.3Z" style="fill: #f2ebe8;"/>
  <path d="M70,133.5c.7,0,1.4,0,2.1,0,.1,0,.3.1.4.2-.8,0-1.6,0-2.4,0-.3.1-.7.2-1,.3.4,1.5,1,2.9,1.5,4.4h0c0,.1-.2.1-.2.1-.4-1-.8-2.1-1.2-3.1-.1-.5-.4-1.1-.3-1.5.3-.2.6-.3,1-.3Z" style="fill: #f3edeb;"/>
  <path d="M28.2,133.8c.1,0,.2.2.1.3-.7,0-1.4-.3-2.1-.1-.5,0-1,.3-1.5,0,.2,0,.4,0,.7,0,.9-.3,1.9-.1,2.8,0Z" style="fill: #7e4239;"/>
  <path d="M36,133.7c.2,0,.3,0,.4.1.6.6,1.1,1.3,1.6,2.1v.2s0,0,0,0c-.5-.8-1.1-1.5-1.7-2.2,0-.1-.2-.2-.3-.3Z" style="fill: #7d372c;"/>
  <path d="M70.2,133.7c.8,0,1.6,0,2.4,0h.2c.7,0,1.3.2,2,.2-.4.3-1,.1-1.5,0-.7-.2-1.3.2-1.9,0-.6-.1-1.2,0-1.8,0,.3,1.3.9,2.6,1.3,3.8v.4c-.6-1.4-1.3-2.9-1.6-4.4.3,0,.7-.2,1-.3Z" style="fill: #82453b;"/>
  <path d="M17.8,133.9c-.3.3-.5.6-.8.9-.2-.4.5-1,.8-.9Z" style="fill: #7a2c20;"/>
  <path d="M24.7,133.9c.4.3,1,.1,1.5,0,.7-.2,1.4.2,2.1.1l-.2.2c-.3.3-.3.8-.4,1.2,0,.2,0,.4.1.7h0c0,.1-.1.1-.2,0-.1.5-.3,1.1-.3,1.7v.3c.1,0,.1.2,0,.2l-.2-.2c-.6,2.8-1.3,5.6-1.9,8.4-.2,1-.6,1.8-.3,2.9h.2c0,.2.1.3.2.4h0c0,0,0,.2,0,.2h.1c0,0,.2.2.3.3,0,.5.4.6.8.7.5,0,1-.2,1.3-.6v-.3c0,0,0-.1.1-.2.3-.7.4-1.5.6-2.2h0c0,0,.1.2.1.2.2-1.3.7-2.5.9-3.8.2-1,.5-2,.7-3v-.3c-.1,0-.1-.2,0-.3v.2c.3-.5.5-.9.3-1.4h0c.4-.2.4-.6.5-1,.2-.9.5-1.8.6-2.7v-.4c-.1,0-.1-.1-.1-.1h0c.8.4,1.6,1.1,2.4,1.8h.3c0,0,0,.1,0,.1v.3c.5.8,1.2,1.4,1.7,2.2.4.8.8,1.5,1.1,2.3.2.4.2.8.6.9.2.5.4,1.1.5,1.7-.3.5,0,1.2,0,1.7,0,0,.2-.2.2-.4,0,.2,0,.4,0,.7,0,.1,0,.2,0,.3,0,.8.1,1.5,0,2.3-.1.2-.1.4,0,.6-.1,1.3-.2,2.5-.6,3.7-.4.2-.5.8-.6,1.2-.1.4-.3.7-.2,1.1,0,0,0,.1,0,.2-.4.1-.6.7-.8,1.1-.1.1-.1.3,0,.5,0,.1-.1.2-.2.3,0,0,0,.1-.1.2,0,0-.1.2-.2.2h-.2c-.4.5-.8,1-1.2,1.5v.2s0,.1,0,.1h-.1c-.4,0-.6.3-.9.6-.2.3-.5.3-.4.7,0,0,0,0-.1,0-.5,0-.8.3-1.2.5-1.3.8-2.7,1.2-4.1,1.4-.7,0-1.3,0-2,0l-.3.2c-.2,0-.4-.1-.7-.1-.2,0-.4,0-.5,0,0-.1,0-.2,0-.3-.5-.2-1-.3-1.4-.5-.5-.2-.9-.6-1.4-.8h-.3c0,0-.2,0-.3,0h0c0,0,0-.2,0-.2h0c0,0,0,0,0,0-.1,0-.3-.2-.4-.2,0,0-.2-.2-.2-.3,0-.3-.2-.4-.3-.6-.5-.5-.8-1.1-1.2-1.7h-.2c0,0,0,0,0,0h0c0-.4,0-.6-.1-.8-.6-1.1-1.2-2.2-1.6-3.5-.3-1-.5-2.1-.6-3.1,0,0-.1,0-.2.1v-.3c.2-.3.1-.9,0-1.3-.1,0-.2.2-.2.5-.1-.4,0-.9,0-1.3.3-.7.3-1.3.3-2.1,0-.6.3-1.1,0-1.7h0s.2-.2.2-.2c.2-.9.4-1.8.7-2.6.2-.6.5-1.2.8-1.8v-.3c-.1,0,0,0,0,0,.4,0,.5-.4.7-.8.4-.8.9-1.5,1.4-2.2.1-.1.1-.3,0-.5,0,0,0-.1.1-.2h.2c.4-.3.9-.6,1.3-1v-.4c.2,0,.2-.1.3-.1.4.1.8-.2,1.1-.4.4-.3.9-.4,1.3-.6v-.2c.3,0,.5-.2.7-.2Z" style="fill: #9f5045;"/>
  <path d="M39.6,134.5c.2.3.4.5.4,1-.3-.5-.7-.9-1-1.4.3-.1.4.2.6.4Z" style="fill: #f0f2ed;"/>
  <path d="M71.3,134.1c.7.1,1.3-.2,1.9,0,.5,0,1.1.3,1.5,0,0,0,.1,0,.2,0v.3c.8.2,1.7.6,2.5,1.1.3.2.6.5,1,.4.2.1.3.2.4.4h0c0,.1,0,.2,0,.2h0c0-.1,0,0,0,0,0,0,0,.1.1.2-.3.4.4.8.6.7,0,0,.2.2.2.3,0,.4.2.5.3.8.3.4.5.8.8,1.2h.2c0,0,0,0,0,0v.3s0,.2,0,.2c.5,1.2,1.1,2.2,1.4,3.5.2.4.2,1,.6,1.2,0,.3.2.6.2.9-.2,0-.2.8,0,.7,0-.2,0-.4,0-.6h0c.1.6.1,1.2.2,1.7,0,.2-.1.3-.1.5,0,1.2,0,2.3-.2,3.5-.2.9-.3,1.8-.5,2.6,0,.4-.3.7,0,1h0c-.4.2-.6,1-.8,1.4-.7,1.5-1.6,2.9-2.6,4v.3c0,0,0,.2,0,.2h0s-.2,0-.2,0c-.2.1-.6.4-.6.8h0c-.1.2-.3.3-.4.4-.4-.1-.7.2-1.1.4-.2.2-.5.3-.6.7h0s-.2-.2-.2-.2c-.9.2-1.7.8-2.6.8,0,.2,0,.2.3.2-.2,0-.4.1-.6.1v-.2c-.8,0-1.7,0-2.4,0l-.3.2h-.2c0-.1,0-.2,0-.3-1.2-.2-2.4-.7-3.5-1.4-.3-.1-.4-.4-.7-.2h-.1c0-.1,0-.2,0-.2h0c0,0,0,0,0,0,0,0-.2-.1-.3-.2h0c0-.5-.6-1-.9-.9h0c0,0,0-.4,0-.4-.3-.5-.6-.8-.9-1.3-.4-.6-.8-1.3-1.2-1.9h-.3c0-.1,0-.2,0-.2h.1c-.2-.6-.5-1.2-.7-1.8-.1-.3-.2-.7-.5-.8h0s.1-.3.1-.3c0-.6-.2-1.1-.3-1.7,0,0-.1,0-.2,0v-.4c.3,0,.7,0,1-.2,0-.1,0-.2-.1-.3.7,0,1.3.1,2,0,.9,0,1.7,0,2.6,0,.3,0,.6-.1.9,0,.6,0,1.2,0,1.8,0,.5,0,.9.2,1.4,0,.6.1,1.3,0,2,0s.8-.3,1.1-.5h0c.2.2.5-.2.2-.4,0-.1.1-.2.2-.3.5-.2.4-.8.4-1.4,0-.8-.3-1.3-.6-2.1-.5-1.5-1.1-3-1.7-4.5-.2-.6-.4-1.4-.7-1.9h-.2c0,0,0-.2-.1-.4.3-.4-.2-1.2-.5-1.3h0c0-.1,0-.2,0-.2h0c0-.1-.1,0-.1,0h0s0-.1,0-.1v-.4c-.3-1.3-.9-2.5-1.2-3.8.6,0,1.2-.2,1.8,0Z" style="fill: #9f5044;"/>
  <path d="M36.3,134c.6.7,1.2,1.4,1.7,2.2h-.2c-.4-.4-.7-1-1.1-1.4-.2-.3-.4-.3-.3-.8Z" style="fill: #f1edec;"/>
  <path d="M74.9,134c.7.2,1.4.5,2,.8.2,0,.4.2.6.4.3.2.6.4.8.6-.3.1-.7-.2-1-.4-.9-.5-1.7-.9-2.7-1.1v-.3Z" style="fill: #7c382d;"/>
  <path d="M24.1,134.2v.2c-.5.2-1,.4-1.4.6-.4.2-.7.5-1.1.4.1,0,.2-.2.4-.2.3-.2.7-.4,1-.6.4-.2.8-.3,1.2-.5Z" style="fill: #793227;"/>
  <path d="M28.2,134.3c0,.6-.3,1.2-.3,1.9-.1-.2-.2-.5-.1-.7.1-.4,0-1,.4-1.2Z" style="fill: #80463b;"/>
  <path d="M22.9,134.6c-.4.2-.7.3-1,.6v-.3c.3-.2.7-.6,1-.3Z" style="fill: #f2ebe8;"/>
  <path d="M44.3,135.3c.7.9,1.2,1.9,1.9,2.8.2.2.2.4.2.7,0,0-.1-.2-.2-.3-.2-.2-.3-.5-.5-.7,0,0-.1-.2-.2-.3-.2-.2-.3-.5-.5-.7,0,0,0-.2-.1-.2-.2-.3-.5-.7-.7-1-.1-.2-.3-.4-.4-.6-.1-.2-.2-.4-.3-.6.3-.2.5.5.7.7Z" style="fill: #853e34;"/>
  <path d="M16.8,135c-.3.4-.5.8-.8,1.1,0,0,0,.1-.1.2-.2.2-.3.5-.5.7-.1.2-.2.4-.3.6-.1.2-.2.4-.3.7,0-.4,0-.5.1-.8.4-.7.9-1.4,1.3-2.1.2-.2.3-.6.6-.4Z" style="fill: #82392d;"/>
  <path d="M31.2,135.1h.2c0,0,0,.2,0,.2-.3,1.5-.6,2.7-.9,4.1h0c-.1.4-.2.8-.3,1.3,0,0,0,.2,0,.3-.3,1.5-.7,2.9-1,4.4-.2.8-.4,1.5-.6,2.3-.3-.5,0-1.1.2-1.6.8-3.7,1.7-7.2,2.4-10.9Z" style="fill: #eee5e3;"/>
  <path d="M31.5,135c.1,0,.3,0,.4.1.3.3.7.5,1.1.8.4.3.8.7,1.1,1.1h0s-.3,0-.3,0c-.7-.7-1.5-1.3-2.4-1.7v-.3Z" style="fill: #7e392e;"/>
  <path d="M62,135v.3c-.3.5-.7.9-1.1,1.5-.6.9-1.1,1.9-1.5,2.9-.2.2-.1.6-.4.4.5-1.1.9-2.1,1.6-3.1,0-.1.2-.3.2-.4.4-.5.8-1.1,1.3-1.6Z" style="fill: #eee7e4;"/>
  <path d="M78.3,135.4c.3.3.6.4.7.9h0c0,0-.1-.1-.1-.1-.1-.2-.3-.3-.4-.4-.3-.2-.5-.4-.8-.6.3-.2.5,0,.7.2Z" style="fill: #ede6e4;"/>
  <path d="M82.4,135.2h0c0-.1.1-.1.1-.1.2.3.4.6.6.9-.3.1-.6-.5-.8-.8Z" style="fill: #f0e8e7;"/>
  <path d="M82.6,135.1c.4,0,.5.4.8.7,1,1.6,2,3.4,2.6,5.3,0,.2,0,.4,0,.6-.1-.4-.3-.8-.4-1.2-.2-.6-.5-1.2-.8-1.8-.5-.9-.9-1.8-1.4-2.5,0,0,0-.1,0-.2-.2-.3-.4-.6-.6-.9Z" style="fill: #7d362c;"/>
  <path d="M31.4,135.3v.4c0,.9-.3,1.8-.4,2.7-.1.4-.1.8-.5,1,.3-1.4.6-2.7.9-4.1Z" style="fill: #824238;"/>
  <path d="M55.2,135.4c.2.4.1,1-.3,1.1h0c0,0,0-.4,0-.4,0-.3.2-.5.2-.7Z" style="fill: #f8eeec;"/>
  <path d="M21.1,135.7c-.4.3-.7.5-1.1.8v-.3c.3-.2.7-.7,1.1-.6Z" style="fill: #efeceb;"/>
  <path d="M21.1,135.7l.2-.2v.4c-.5.4-.9.7-1.4,1h-.2c.1-.1.2-.3.3-.4.4-.3.7-.5,1.1-.8Z" style="fill: #7d392d;"/>
  <path d="M65.9,135.7h.2s0,.2,0,.2c0,0-.1.1-.2.2-.4.3-.8.7-1.2,1.1,0-.2,0-.4,0-.5.4-.4.8-.8,1.2-1Z" style="fill: #f1eceb;"/>
  <path d="M66.1,135.7h.1s0,0,0,0c.2.4.3.9.5,1.3h-.2c-.2-.4-.3-.8-.5-1.2h0Z" style="fill: #7d3429;"/>
  <path d="M66.5,135.7c.6,1.7,1.2,3.3,1.8,5v.5c-.5-1.2-1-2.5-1.4-3.8,0-.1-.1-.3-.2-.4-.1-.4-.3-.9-.5-1.3h.2Z" style="fill: #f0e8e5;"/>
  <path d="M33,135.9c.2,0,.3,0,.4,0,.3.2.5.4.7.7v.3c-.4-.4-.8-.8-1.2-1.1Z" style="fill: #ebe7e4;"/>
  <path d="M44.3,135.7c.2.4.5.7.7,1-.4.1-.8-.6-.7-1Z" style="fill: #f0ebe7;"/>
  <path d="M66,135.9c.2.4.4.8.5,1.3h.2c0,0,.1.2.2.4-.1.3,0,.5,0,.9.5,1.6,1.2,3.1,1.7,4.7.6,1.4,1,2.9,1.6,4.3-2.7-.2-5.4,0-8-.1-.5,0-.9.1-1.4.1,0-.5,0-1-.2-1.4v-.2c.1,0,.2,0,.3,0,.1-.9.4-1.7.6-2.6.3-1.1.8-2,1.3-3.1v-.3c0,0,0-.2,0-.3.4-.1.5-.5.8-.9.6-.8,1.2-1.5,1.9-2.1.1-.1.2-.3.3-.5,0,0,.1-.1.2-.2Z" style="fill: #9f5045;"/>
  <path d="M65.8,136c0,.2-.1.4-.3.5-.7.6-1.3,1.3-1.9,2.1-.3.4-.3.8-.8.9.1-.4.3-.6.5-.9v-.2c.2-.2.4-.4.5-.6.2-.2.4-.5.7-.7.4-.4.8-.8,1.2-1.1Z" style="fill: #823d33;"/>
  <path d="M27.6,136.3c0,0,.1,0,.2,0-.1.8-.3,1.3-.4,2v-.3c0-.6,0-1.1.2-1.7Z" style="fill: #8b453c;"/>
  <path d="M38.5,136.9c-.1-.2-.2-.4-.3-.6.3-.3.4.3.3.6Z" style="fill: #7a3329;"/>
  <path d="M54.7,136.3c0,0,.1,0,.2.1h0c0,0,0,.2,0,.2-.3.7-.4,1.5-.7,2.3-.1.3-.2.6-.3.9v-.3c.2-1.1.4-2.2.8-3.2Z" style="fill: #89453c;"/>
  <path d="M78.8,136.2h.1c0,0,0,.2,0,.2h0c0,0,0-.2,0-.2Z" style="fill: #701003;"/>
  <path d="M83.3,136.2c.5.8,1,1.7,1.4,2.5h-.2c-.3-.4-.5-.9-.8-1.4-.2-.4-.5-.6-.4-1.1Z" style="fill: #eee6e3;"/>
  <path d="M15.9,136.4c.1.4,0,1-.5.7.1-.2.3-.5.5-.7Z" style="fill: #f1f0ed;"/>
  <path d="M38.1,136.4h0c0,.1.2.3.3.5.1.3.3.5.4.8h-.2c-.2-.3-.6-.8-.6-1.3Z" style="fill: #f0eeea;"/>
  <path d="M40.7,136.4c.1.2.2.3.3.5-.3.3-.4-.3-.3-.5Z" style="fill: #772a1f;"/>
  <path d="M79.1,136.6c.2.2.4.4.6.7-.3.1-.9-.2-.6-.7Z" style="fill: #883c2f;"/>
  <path d="M54.8,136.7c0,.2,0,.4,0,.6-.3,1.2-.6,2.3-1,3.4-.5,1.7-1,3.5-1.5,5.2h-.2c.5-1.9,1-3.8,1.6-5.5h0c0,0,0-.2,0-.2,0,0,0-.2,0-.3,0-.3.2-.6.3-.9.2-.8.3-1.5.7-2.3Z" style="fill: #efe8e5;"/>
  <path d="M60.5,137c-.6.9-1.1,2-1.6,3.1,0,.1,0,.2-.1.4,0,.3-.2.6-.3.8v-.3c.3-1.4.9-2.7,1.6-3.8,0-.2.2-.2.4-.1Z" style="fill: #834036;"/>
  <path d="M45.1,137c.2.2.3.5.5.7-.3.3-.6-.3-.5-.7Z" style="fill: #f3edea;"/>
  <path d="M19.6,137.1c0,.2,0,.3,0,.5-.5.7-1,1.4-1.4,2.2-.2.4-.3.7-.7.8.5-.9.9-1.9,1.5-2.6.2-.3.4-.5.6-.8Z" style="fill: #833f34;"/>
  <path d="M34.3,137.1c.2.2.4.5.7.7.4.5.8.9,1.1,1.5,0,0,0,.1.1.2.3.5.5,1,.8,1.5.1.3.3.6.4.9.1.3.2.6.3.8-.3-.2-.4-.6-.6-.9-.3-.8-.7-1.6-1.1-2.3-.5-.8-1.2-1.4-1.7-2.2v-.3Z" style="fill: #823b31;"/>
  <path d="M41.2,137.1c.3.4.5.8.8,1.2-.3.2-.3-.1-.5-.4-.1-.3-.4-.5-.3-.9Z" style="fill: #772e25;"/>
  <path d="M38.9,137.7c.1,0,.2,0,.3.2.4.5.6,1.1.9,1.8.3.7.5,1.4.8,2.1.1.4.4.6,0,1,0-.5-.3-.9-.4-1.4-.2-.5-.3-1.1-.6-1.6-.1-.3-.2-.5-.3-.8-.2-.4-.4-.8-.7-1.2v-.2Z" style="fill: #803a30;"/>
  <path d="M66.9,137.5c.5,1.2.9,2.5,1.4,3.8h0c.6,1.8,1.3,3.4,1.8,5.1.1.4.4.7.5,1.1-1.6,0-3.3,0-4.9,0h-.1c-1.6,0-3.3,0-5,0,0-.5.1-1.1.2-1.7.2.5.1.9.2,1.4.5,0,.9-.1,1.4-.1,2.7.1,5.4,0,8,.1-.6-1.4-1-2.9-1.6-4.3-.5-1.6-1.2-3.1-1.7-4.7,0-.3-.2-.5,0-.9Z" style="fill: #863d32;"/>
  <path d="M80,137.5c.3.4.6.9.9,1.3.2.2.3.4.5.7h-.2c-.3-.3-.5-.8-.8-1.1-.2-.3-.4-.4-.3-.8Z" style="fill: #863d31;"/>
  <path d="M15.1,137.7v.3c-.2.7-.6,1.3-.9,2.1-.5,1.3-1,2.7-1.2,4.2h-.2c.3-1.9.9-3.8,1.7-5.3,0-.2.2-.4.3-.6,0-.2.2-.4.3-.7Z" style="fill: #efe9e7;"/>
  <path d="M19,137.9c-.6.8-1.1,1.7-1.5,2.6h0c-.3.7-.6,1.3-.9,2-.2-.4,0-.7.2-1.1.5-1,1-2.1,1.6-3.1.2-.3.3-.7.7-.5Z" style="fill: #ede8e7;"/>
  <path d="M34.9,137.9h.3c.3.4.8.9.8,1.5-.3-.5-.7-1-1.1-1.5Z" style="fill: #f3f0ef;"/>
  <path d="M64,137.9c-.2.2-.3.4-.5.6-.1-.5,0-.8.5-.6Z" style="fill: #f2f1ef;"/>
  <path d="M39,137.9c.3.4.4.8.7,1.2h-.2c-.2-.3-.4-.7-.5-1.2Z" style="fill: #ede7e4;"/>
  <path d="M45.7,137.9c.1.3.3.5.5.7-.3.4-.6-.4-.5-.7Z" style="fill: #f3efed;"/>
  <path d="M27.1,138.4l.2.2c-.4,1.7-.7,3.3-1.1,5-.3,1.5-.7,3.3-1.1,4.8,0,.4,0,1,0,1.4h-.2c-.3-1.1,0-1.9.3-2.9.6-2.8,1.3-5.6,1.9-8.4Z" style="fill: #7b3429;"/>
  <path d="M70.8,138.5h.1s0,0,0,0h0c0,0,0,0,0,0Z" style="fill: #6a2013;"/>
  <path d="M42.1,138.5c.2.2.4.5.5.8-.3,0-.6-.4-.5-.8Z" style="fill: #7c3023;"/>
  <path d="M63.4,138.6c-.2.3-.4.6-.5.9,0,0-.1.2-.1.3,0,.2-.2.4-.3.6-.2-.4,0-.6.2-.9.2-.4.3-.8.7-.9Z" style="fill: #eee8e7;"/>
  <path d="M81.4,139.4h0c-.1-.2-.3-.4-.5-.7.3-.3.6.3.5.7Z" style="fill: #f0eeec;"/>
  <path d="M14.3,138.9h.2c-.8,1.6-1.4,3.4-1.7,5.2,0,.1,0,.2,0,.4-.3-.1-.1-.5-.1-.7.3-1.7.9-3.4,1.6-4.9Z" style="fill: #823f35;"/>
  <path d="M70.8,138.8c.3.2.7,1,.5,1.3-.1-.4-.3-.8-.4-1.2h0Z" style="fill: #7b382f;"/>
  <path d="M70.9,138.9c.1.4.3.8.4,1.2,0,.1,0,.3.1.4.2.4.3.9.5,1.3h-.2c-.3-.7-.6-1.6-.9-2.4,0-.2,0-.3,0-.5Z" style="fill: #efe8e6;"/>
  <path d="M36.6,139.9c.1.4.5.7.3,1.2-.2-.5-.5-1-.8-1.5.3-.2.3.1.5.4Z" style="fill: #eadcd9;"/>
  <path d="M43.3,140.5c-.2-.3-.4-.7-.6-1,.3-.2.8.6.6,1Z" style="fill: #f2f2f0;"/>
  <path d="M46.6,139.3l.2.2h0c.2.3.4.6.7,1-.2,0-.3,0-.4-.1-.2-.3-.5-.6-.5-1Z" style="fill: #f2efed;"/>
  <path d="M47,139.4c.4.6.8,1.2,1.2,1.8v.4s0,0,0,0c-.2-.2-.3-.4-.5-.7,0-.1-.2-.3-.3-.4-.2-.3-.4-.6-.7-1h.2Z" style="fill: #7e3428;"/>
  <path d="M30.5,139.5c.3.5,0,.9-.1,1.4v-.2c0-.4,0-.8.1-1.3Z" style="fill: #7a372d;"/>
  <path d="M42.6,139.5h0c.2.4.4.7.6,1h0c-.4,0-.8-.5-.7-1Z" style="fill: #7b362a;"/>
  <path d="M81.7,139.6c.3.6.8,1.3.7,2.1-.3-.7-.6-1.4-.9-2h.2Z" style="fill: #efe9e5;"/>
  <path d="M81.4,139.7h0c.3.6.6,1.3.9,2,.1.4.3.8.4,1.2.2.6.3,1.1.5,1.7-.4-.2-.4-.7-.6-1.2-.3-1.3-.9-2.3-1.4-3.5v-.2Z" style="fill: #813f34;"/>
  <path d="M40,139.8c.2.5.4,1.1.6,1.6.1.5.4.9.4,1.4,0,.3.1.5.2.8.1.5.2.9.2,1.4.1.8.3,1.7.3,2.5,0,.4,0,.7,0,1.1h0c0,1.5,0,2.8-.3,4.1-.1-.2-.2-.5-.1-.7.2-1.1.1-2.2.2-3.3-.1-1.2,0-2.3-.3-3.5-.2-1.5-.5-2.8-1-4.2-.1-.4-.4-.8-.2-1.3Z" style="fill: #ebe3e1;"/>
  <path d="M53.8,140.2v.2c-.4,0-.2-.6,0-.2Z" style="fill: #772218;"/>
  <path d="M62.8,139.8v.3c-.3,1-.9,2-1.2,3.1-.2.9-.5,1.7-.6,2.6,0,0-.2,0-.2,0,.3-1.5.7-2.9,1.3-4.3.1-.3.3-.7.5-1,0-.2.2-.4.3-.6Z" style="fill: #813d33;"/>
  <path d="M71.7,140.5c.4.5.5,1.3.7,1.9.6,1.5,1.1,3,1.7,4.5.2.7.6,1.2.6,2.1,0,.6,0,1.2-.4,1.4h0c.2-.6.3-1.3.2-1.9-.7-2.1-1.6-4.1-2.3-6.2,0-.1-.1-.3-.2-.4-.2-.4-.3-.9-.5-1.3h.2Z" style="fill: #854237;"/>
  <path d="M44,141.4h0c-.1-.2-.3-.4-.4-.7.3-.2.5.3.5.7Z" style="fill: #f1f0ec;"/>
  <path d="M53.7,140.4c-.6,1.8-1.1,3.6-1.6,5.4-.1.3-.2.7-.4,1-.1-.2-.3-.4-.4-.6-.1-.2-.2-.3-.3-.5h.2c.2.2.3.4.5.5.2-.3.2-.7.3-1,.4-1.3.8-2.6,1.1-3.9.1-.4.2-.8.5-1Z" style="fill: #7f3b30;"/>
  <path d="M58.8,140.4c.1.6-.1,1.1-.3,1.6-.3.9-.4,1.8-.6,2.7h-.2c0-.6.2-1.2.4-1.9h0c0-.5.3-1,.4-1.5h0c0-.3.2-.6.3-.9Z" style="fill: #f3eeea;"/>
  <path d="M85.5,140.4c.1.4.3.8.4,1.2h0c.4,1.3.7,2.6.9,3.9.1.6.1,1.2.2,1.9,0,1,0,2,0,3-.2.6,0,1.3-.2,1.9h0c0,.5-.2,1-.2,1.5,0,0,0,.1,0,.2-.2,1.4-.7,2.7-1.2,3.9,0,.2-.1.4-.2.5-.2-.1-.2-.3,0-.5.7-1.5,1.1-3.1,1.4-4.7.4-2,.4-4.1.3-6.2-.2-2.1-.6-4.2-1.3-6.1,0-.2,0-.4,0-.6Z" style="fill: #ede5e3;"/>
  <path d="M17.4,140.6v.3c-.1.6-.5,1.1-.7,1.8-.3.9-.5,1.7-.7,2.6l-.2.2c0-.4.1-.8.2-1.3.2-.5.3-1.1.4-1.6.2-.7.6-1.3.9-2Z" style="fill: #803c33;"/>
  <path d="M43.4,140.7h0c0,.3.3.4.4.7-.3.3-.6-.4-.5-.7Z" style="fill: #7e3326;"/>
  <path d="M47.7,140.9c.1.2.3.5.5.7-.3.3-.6-.3-.5-.7Z" style="fill: #f2edea;"/>
  <path d="M30.1,141v.3c0,1-.4,2-.5,3-.2,1.3-.6,2.5-.9,3.8v-.3c-.1,0-.1-.2-.1-.2.2-.8.4-1.5.6-2.3.2-1.5.7-2.9,1-4.4Z" style="fill: #84453b;"/>
  <path d="M58.5,141.3c-.1.5-.3,1-.4,1.5-.2-.3-.2-.4,0-.8.1-.3.2-.7.4-.7Z" style="fill: #79392f;"/>
  <path d="M61.8,141.4h.2c-.6,1.4-1,2.8-1.3,4.3v.2c0,.6-.2,1.1-.2,1.7,1.6,0,3.3,0,5,0-.2.2-.3.2-.5.2-1,0-1.9,0-2.9,0-.5,0-1.1.1-1.6,0-.1-.5,0-1.2,0-1.7.2-1.6.7-3.2,1.3-4.6Z" style="fill: #f4edea;"/>
  <path d="M68.3,141.4c.2,0,.3.2.3.3.8,1.8,1.3,3.7,2.1,5.5,0,.1,0,.3,0,.4-.6.4-1.2.1-1.9.1-.9,0-1.8,0-2.7,0-.1,0-.3-.1-.4-.2,1.6,0,3.3,0,4.9,0,0-.4-.3-.7-.5-1.1-.6-1.7-1.2-3.3-1.8-5Z" style="fill: #f0e8e5;"/>
  <path d="M44,141.6c.2.3.5.7.7,1,.1.2.3.4.4.6,0,.1.2.3.3.4.2.3.4.7.7,1,.6,1,1.3,2,1.9,3h-.2c-1.2-1.5-2.1-3.3-3.3-4.8-.3-.4-.6-.6-.6-1.2Z" style="fill: #7f3529;"/>
  <path d="M48.3,141.7c.2,0,.3,0,.4.2.8,1,1.5,2.2,2.3,3.3v.3c-.2-.2-.4-.4-.5-.6-.2-.2-.3-.5-.5-.7,0-.1-.2-.3-.3-.4-.3-.5-.7-.9-1-1.4-.1-.2-.3-.4-.4-.6Z" style="fill: #823b31;"/>
  <path d="M85.9,141.7l.3.2c.3.6.4,1.5.6,2.2,0,.5.3,1,0,1.5-.2-1.3-.5-2.6-.9-3.8Z" style="fill: #874940;"/>
  <path d="M56.6,141.9c.3.3,0,.8-.3.9,0-.3.2-.6.3-.9Z" style="fill: #80473a;"/>
  <path d="M37.3,142c.2,0,.3.2.4.4.4,1,.6,2.1.8,3.2,0,.4,0,.6-.1.9,0-.2,0-.5,0-.7-.1-.4-.2-.9-.3-1.3-.1-.6-.3-1.1-.5-1.7,0-.3-.2-.6-.3-.8Z" style="fill: #f2ebe8;"/>
  <path d="M72.1,142.2c.7,2.1,1.6,4.1,2.3,6.2,0,.6,0,1.3-.2,1.8-.2-.8.1-1.5-.2-2.3-.6-1.7-1.3-3.4-1.9-5.1,0-.2,0-.4,0-.6Z" style="fill: #efe8e5;"/>
  <path d="M44.7,142.6c.4-.1.6.2.4.6-.1-.2-.3-.4-.4-.6Z" style="fill: #f2f6f4;"/>
  <path d="M48.7,142.4c.3.5.7.9,1,1.4-.2,0-.3,0-.4-.1-.3-.4-.7-.7-.6-1.3Z" style="fill: #f2eeed;"/>
  <path d="M83.1,142.7c.2.7.4,1.4.6,2.2,0,.2,0,.4-.1.6,0-.3-.1-.6-.2-.9-.2-.6-.3-1.2-.5-1.7h.2Z" style="fill: #f1eae7;"/>
  <path d="M56.4,142.8c.2.4,0,.8,0,1.2-.1.4-.2.8-.5,1,0-.2.1-.5.2-.7,0-.1,0-.3.1-.4.2-.3.2-.7.3-1Z" style="fill: #83463e;"/>
  <path d="M58.1,142.8c-.2.7-.3,1.4-.4,2.1h0c-.2-.3-.1-.6,0-1,.1-.4.1-.8.5-1Z" style="fill: #8d4e42;"/>
  <path d="M41.4,143.5c.2.8.2,1.7.4,2.5.1.8,0,1.6,0,2.4v.3c-.2-.4-.2-.7-.2-1.1,0-.8-.2-1.7-.3-2.5,0-.5-.1-.9-.2-1.4l.2-.2Z" style="fill: #7c3c32;"/>
  <path d="M46.1,144.5c-.2-.3-.5-.6-.7-1,.3-.1.7.6.7,1Z" style="fill: #f3efed;"/>
  <path d="M26.2,143.6c0,.2.1.3.1.5-.3,1.5-.7,3-1,4.6-.2.7.4,1.4.6,2.1h-.2c0-.3-.2-.4-.3-.5h0c0-.3-.1-.4-.2-.5-.2-.4,0-1,0-1.4.4-1.5.8-3.3,1.1-4.8Z" style="fill: #eadcd9;"/>
  <path d="M55.7,144.1h.2c0,.4-.1.6-.2.9,0,.3-.2.6-.3.9-.2.6-.3,1.1-.5,1.7.7,0,1.5,0,2.2,0h.1s.1,0,.1,0h.1c0-.2,0-.5,0-.7v-.4c.3.4.1.8.1,1.2-.7,0-1.5,0-2.2.1-.2,0-.7,0-.7-.5.2-1.1.7-2.2.9-3.3Z" style="fill: #f0e9e5;"/>
  <path d="M16.1,144.2c-.1.4-.1.8-.2,1.3h0c-.2,1.1-.3,2.1-.3,3.1v-.3c-.2-1.2,0-2.1.2-3.3,0-.4,0-.7.4-.8Z" style="fill: #ece7e6;"/>
  <path d="M50,144.2c.2.2.3.5.5.7-.3.3-.6-.4-.5-.7Z" style="fill: #f3f0ee;"/>
  <path d="M12.8,144.4v.2c.2.8-.2,1.5-.2,2.3,0,1.4,0,2.7,0,4.1.2,1.7.4,3.4,1,5,0,.4.4.8.1,1.2v-.3c-.1-.2-.2-.3-.2-.5,0-.3-.2-.6-.3-.9h0c-.4-1.6-.8-3.3-.8-4.9,0-.9-.2-1.8,0-2.8,0-1.2.1-2.2.3-3.3Z" style="fill: #f6f0ec;"/>
  <path d="M38.1,144.5c0,.4.2.9.3,1.3,0,.2-.1.3-.2.4,0-.5-.4-1.2,0-1.7Z" style="fill: #823f35;"/>
  <path d="M57.4,145.1h.1c0,0,0,.3,0,.3,0,.4,0,.7,0,1.1v.4c-.3-.5-.1-1.2-.1-1.8Z" style="fill: #722c20;"/>
  <path d="M83.6,145.5h0c0,.3,0,.5,0,.7-.2,0-.2-.8,0-.7Z" style="fill: #6e3125;"/>
  <path d="M15.8,145.5c.3.5,0,1.1,0,1.7,0,.7,0,1.4-.3,2.1v-.5s0,0,0,0c0-1.1.1-2.1.3-3.1Z" style="fill: #924639;"/>
  <path d="M50.9,145.6c0,0,.1.1.2.2.1.2.2.3.3.5-.3.3-.6-.4-.5-.7Z" style="fill: #f6f3f0;"/>
  <path d="M83.6,145.7c.3.2.4.8.4,1.2,0,1.6.1,3.4-.2,5l-.2.2c.3-1.6.3-3.3.2-4.9,0-.5,0-1-.2-1.5Z" style="fill: #f1e9e4;"/>
  <path d="M55.5,145.9c.2.5-.1,1-.2,1.5.6,0,1.4-.3,1.9.2-.7,0-1.5,0-2.2,0,.2-.6.3-1.1.5-1.7Z" style="fill: #78372e;"/>
  <path d="M38.6,146.6c0,1.1,0,2.2,0,3.3-.2,2.2-.7,4.3-1.5,6.3h-.3c0,.1.1-.1.1-.1,0,0,0-.1,0-.2.3-.8.6-1.6.8-2.4.3-1.2.5-2.5.6-3.7,0-.3,0-.5,0-.6,0-.8,0-1.5,0-2.3l.2-.3Z" style="fill: #f3edea;"/>
  <path d="M87.2,147c0,1.1,0,2.2,0,3.4,0,.6-.1,1.2-.2,1.9l-.3.2c.2-.6,0-1.3.2-1.9,0-1,0-2,0-3,0-.3,0-.5.2-.4Z" style="fill: #7f3c32;"/>
  <path d="M57.4,147.6h-.1c-.2-.5.2-.5.1,0Z" style="fill: #7d2412;"/>
  <path d="M48.2,147.5c.2.2.5.5.6.9v.3c-.3-.3-.5-.7-.7-1h0c0-.1.1-.2.1-.2Z" style="fill: #efebe9;"/>
  <path d="M83.8,147.3c.1,1.6,0,3.3-.2,4.9h0c-.1.9-.4,1.9-.7,2.7-.2-.4,0-.7,0-1,.3-.8.4-1.7.5-2.6.2-1.2.1-2.3.2-3.5,0-.2,0-.3.1-.5Z" style="fill: #7e4439;"/>
  <path d="M28.4,147.8v.2c0,.7-.2,1.5-.5,2.2-.2-.4,0-.9.2-1.3.1-.3.1-.9.3-1.1Z" style="fill: #f2eae8;"/>
  <path d="M48.1,147.6c.2.3.4.7.7,1h0c-.4,0-.7-.5-.7-1Z" style="fill: #7f3b2f;"/>
  <path d="M15.3,148.8h.2c0-.1,0,.4,0,.4,0,.4,0,.9,0,1.3,0,.2,0,.5,0,.8v.3c.3,1.5.6,3,1.2,4.3-.1,0-.3-.1-.3-.3-.6-1.4-.8-2.8-1-4.4-.2-.8,0-1.7-.2-2.5Z" style="fill: #efebe9;"/>
  <path d="M49.5,149.3c.3.4.7.8,1,1.3v.3c-.4-.4-.8-.9-1.1-1.4h0c-.1-.2-.2-.4-.3-.6.3,0,.4.2.6.5Z" style="fill: #f3eae7;"/>
  <path d="M41.7,148.8c.3.5.1,1.4.1,2.1-.1,1.4-.4,2.9-.8,4.2-.6,2.3-1.7,4.5-2.9,6.4h-.2c1.7-2.5,2.9-5.6,3.4-8.7h0c.3-1.4.3-2.7.3-4Z" style="fill: #814036;"/>
  <path d="M48.9,148.8h0c0,.2.2.4.3.5-.3.3-.4-.2-.4-.5Z" style="fill: #7a2a1c;"/>
  <path d="M49.3,149.4c.4.5.7,1,1.1,1.4h0c-.3,0-.6-.4-.8-.7-.2-.2-.3-.4-.3-.7Z" style="fill: #803225;"/>
  <path d="M15.8,150c0,.4.2,1,0,1.3,0-.3,0-.5,0-.8,0-.3,0-.5.2-.5Z" style="fill: #763127;"/>
  <path d="M25.3,150.2h0c0,0,0,0,0,0h-.1c0,0,0,0,0,0Z" style="fill: #552213;"/>
  <path d="M93.9,150.1c.1,2,0,3.9,0,5.9,0,30.9,0,61.7,0,92.6,0,.5,0,1,0,1.4-.2-.4-.2-.8-.2-1.3,0-3.1,0-6.1,0-9.2,0-.6,0-1.1,0-1.7,0-9.8,0-19.8,0-29.4,0-1.6,0-3.3,0-4.9,0-1.6,0-3.2,0-4.8,0-1.6,0-3.1,0-4.7,0-4.9,0-9.9,0-14.8,0-2.5,0-5.1,0-7.6,0-1.2,0-2.3,0-3.5,0-5.5,0-11,0-16.6,0-.5,0-.9.1-1.4Z" style="fill: #9d3b2d;"/>
  <path d="M27.8,150.4v.3c-.3.4-.8.7-1.3.6-.3-.1-.7-.2-.8-.7h.2c.6.6,1.4.5,1.9-.1Z" style="fill: #7d392f;"/>
  <path d="M12.5,150.6c0,1.6.4,3.3.8,4.9-.4-.2-.4-.6-.5-1.1-.2-1.1-.4-2.1-.5-3.2,0-.3.1-.4.2-.6Z" style="fill: #88473d;"/>
  <path d="M74,150.6c.3.2,0,.6-.2.4,0-.1.2-.3.2-.4Z" style="fill: #782d1d;"/>
  <path d="M50.6,150.9c.2,0,.3,0,.5,0,.3.1.6.3,1,.3,1.7,0,3.5,0,5.2,0,.2,0,.5,0,.6.2.2.4.2.8,0,1.1,0-.4,0-.8-.2-1.1-1.6.1-3.3,0-4.9,0-.3,0-.5-.1-.8,0-.5,0-.9-.2-1.3-.4l-.2-.2Z" style="fill: #f6f3f0;"/>
  <path d="M73.7,151c-.4.3-.7.5-1.1.5-.7,0-1.3,0-2,0-.5.2-.9,0-1.4,0-.6.2-1.2,0-1.8,0-.3-.2-.6,0-.9,0-.9-.1-1.7,0-2.6,0-.7.1-1.3,0-2,0-.3,0-.6,0-.9,0v-.2c3.9,0,7.8,0,11.7,0,.3,0,.7-.5,1-.3Z" style="fill: #f8f6f4;"/>
  <path d="M50.7,151.1c.4.2.8.5,1.3.4.3-.1.5.1.8,0,1.6,0,3.3,0,4.9,0,.2.3.1.7.2,1.1,0,0,0,.2,0,.3.2,1.3.6,2.7.9,3.9l-.2.2c-.5-1.6-.8-3.3-1.1-5-1.1-.1-2.2,0-3.3,0-1,0-2.1.1-3-.3-.3,0-.3-.3-.4-.6Z" style="fill: #8f4b3f;"/>
  <path d="M15.9,151.5c.2,1,.3,2.1.6,3.1.4,1.3.9,2.4,1.6,3.5.1.2.2.4.1.7h0c-.5-.8-.9-1.7-1.3-2.5,0,0,0-.2-.1-.3-.6-1.4-.9-2.8-1.1-4.3,0,0,.1,0,.2-.1Z" style="fill: #854238;"/>
  <path d="M61.1,151.5c.3,0,.6,0,.9,0,0,.1,0,.2.1.3-.4,0-.7.1-1.1.2,0-.2,0-.3,0-.4Z" style="fill: #8d473a;"/>
  <path d="M61,152v.4c.2.6.3,1.3.5,1.9h0c.1.4.2.8.4,1.1h-.2c-.3-.9-.6-1.9-.8-3,0-.2,0-.3.1-.5Z" style="fill: #f1edeb;"/>
  <path d="M61.3,152.3c.1.6.2,1.1.3,1.7v.3c-.3-.6-.4-1.3-.6-1.9,0,0,.1,0,.2,0Z" style="fill: #84493f;"/>
  <path d="M83.6,152.2c.1.2.2.4.1.6-.2.9-.4,1.9-.8,2.7h-.2c0-.3.1-.4.2-.6h0c.3-.9.5-1.8.7-2.7Z" style="fill: #efe7e5;"/>
  <path d="M86.8,152.3c.3.5,0,1.1,0,1.6h-.2c0-.6.2-1.1.2-1.6Z" style="fill: #804037;"/>
  <path d="M58.1,152.7c.1,1.2.5,2.4.8,3.5.1.5.4.9.3,1.5l-.2-.4c0-.2-.1-.3-.2-.5-.4-1.3-.7-2.6-.9-3.9h.2Z" style="fill: #f2e7e4;"/>
  <path d="M41.4,152.8c-.5,3.2-1.8,6.2-3.4,8.7,0,0-.1.2-.2.2,0-.5.2-.7.4-1.1,1.3-2.1,2.2-4.4,2.8-7,.1-.3,0-.8.4-.9Z" style="fill: #eee8e5;"/>
  <path d="M37.9,153.5c-.2.8-.5,1.6-.8,2.4-.2-.4,0-.7.2-1.1.2-.4.3-1.1.6-1.2Z" style="fill: #87463b;"/>
  <path d="M86.5,154.1c.1.2.2.5,0,.7-.3,1.1-.6,2.3-1,3.3h-.2c.5-1.3.9-2.6,1.2-4Z" style="fill: #7f3d33;"/>
  <path d="M61.5,154.3c.3.1.4.5.5.8.2.6.5,1.2.7,1.8h-.1s0,0,0,0c-.2-.5-.4-1-.6-1.5-.1-.4-.3-.7-.4-1.1Z" style="fill: #833b32;"/>
  <path d="M82.9,154.9c0,.2-.1.4-.2.5,0,.1-.1.3-.2.4-.3.8-.7,1.5-1.1,2.1,0,0,0,.1,0,.2-.2.4-.5.8-.8,1.2-.2.3-.4.5-.6.8-.1.1-.2.3-.4.4v-.3c1-1.1,1.9-2.5,2.6-4,.2-.4.4-1.2.8-1.4Z" style="fill: #7f3429;"/>
  <path d="M13.2,155.5c.1.3.2.6.3.9-.3,0-.6-.6-.3-.9Z" style="fill: #844436;"/>
  <path d="M82.6,155.9c.1.2.1.4,0,.6-.2.6-.5,1.1-.9,1.6h-.2c.4-.7.8-1.4,1.1-2.2Z" style="fill: #ece2e0;"/>
  <path d="M37,156.1v.3c-.2.2-.3.3-.4.5-.2.3-.3.6-.5.9,0-.2,0-.4,0-.5.2-.4.4-1,.8-1.1Z" style="fill: #854035;"/>
  <path d="M16.9,156.2c.4.8.8,1.7,1.3,2.4-.5,0-.6-.6-.9-1.1-.2-.5-.5-.8-.4-1.3Z" style="fill: #ece5e2;"/>
  <path d="M13.6,156.9v.3c.2.1.2.3.3.4.2.4.3.8.5,1.1h-.2c-.2-.5-.5-1-.6-1.6v-.3Z" style="fill: #82382b;"/>
  <path d="M36.7,156.8c0,.3,0,.5-.1.7-.2.2-.2.6-.5.5,0-.1.1-.2.2-.3.2-.3.3-.6.5-.9Z" style="fill: #f3eae9;"/>
  <path d="M62.5,156.9h0s0,.1,0,.1c.1.2.2.5.4.7-.3.3-.6-.5-.4-.8Z" style="fill: #f0efef;"/>
  <path d="M62.6,157h.3c.4.7.7,1.4,1.2,2,.3.4.7.8.9,1.3v.3c-.5-.6-1-1.2-1.4-1.8,0,0,0-.1-.1-.2-.1-.2-.2-.3-.3-.5,0,0,0-.2-.1-.3-.1-.2-.2-.5-.4-.7Z" style="fill: #823d33;"/>
  <path d="M59,157.2l.2.4c.3.7.6,1.4,1,2.1h-.3c-.3-.7-.6-1.4-.9-2.1,0-.2,0-.3,0-.5Z" style="fill: #833e35;"/>
  <path d="M14.1,157.6c.2.5.5,1,.6,1.5v.3c-.1-.2-.2-.4-.4-.6-.2-.4-.3-.7-.5-1.1h.2Z" style="fill: #f1e9e8;"/>
  <path d="M63.1,158c.1.2.2.3.3.5-.3.3-.4-.2-.3-.5Z" style="fill: #f8f6f3;"/>
  <path d="M35.5,158.3h.2c-.2.4-.5.7-.8,1.1-.2.2-.4.5-.6.7v-.2c.4-.5.8-1,1.2-1.5Z" style="fill: #813a2d;"/>
  <path d="M35.9,158.2c0,.6-.5,1.2-.9,1.3.3-.4.5-.7.8-1,0,0,.1-.2.2-.2Z" style="fill: #f2f0ef;"/>
  <path d="M81.4,158.2c0,.4,0,.5-.2.8-.2.2-.3.6-.6.4.3-.4.6-.8.8-1.2Z" style="fill: #f1eae5;"/>
  <path d="M85.1,158.5h.2c-.2.5-.4,1-.7,1.5h-.2c.2-.3.3-.7.5-1,0-.2.1-.3.2-.5Z" style="fill: #7c362c;"/>
  <path d="M18.5,158.7c.4.6.8,1.2,1.2,1.7.1.2.4.3.3.6h-.1c-.4-.6-.8-1-1.2-1.6-.1-.2-.3-.4-.4-.7h.2Z" style="fill: #7f3a30;"/>
  <path d="M18.3,158.8h0c.1.2.3.4.4.7-.3.3-.6-.3-.5-.7Z" style="fill: #f1ecea;"/>
  <path d="M63.5,158.7c.4.7.9,1.3,1.4,1.8h0c0,0,.1.2.1.2h-.4c-.4-.5-.9-1.1-1.2-1.6v-.5Z" style="fill: #f4efed;"/>
  <path d="M84.9,159c-.2.3-.3.6-.5,1-.2.3-.3.5-.5.8,0-.5.3-.8.5-1.2.2-.2.2-.7.5-.5Z" style="fill: #efeaea;"/>
  <path d="M14.9,160c.1.2.2.4.4.6.1.2.3.5.4.7h-.2c-.2-.4-.7-.8-.6-1.4Z" style="fill: #7d362b;"/>
  <path d="M34.2,160.2c-.1.2-.3.3-.5.5,0,0-.1.1-.2.2-.2.2-.4.4-.6.6-.2-.4.2-.5.4-.7.3-.2.5-.6.9-.6Z" style="fill: #7a3027;"/>
  <path d="M34.2,160.2h.1c.1.5-.3.6-.6.5.2-.1.3-.3.5-.5Z" style="fill: #f2e7e5;"/>
  <path d="M80,160.2c.2.3-.3.8-.5.6,0,0,0-.2.1-.2.1-.1.2-.3.4-.4Z" style="fill: #f7f3ef;"/>
  <path d="M15.8,161.3h0c-.1-.2-.3-.5-.4-.7.3-.3.6.4.5.7Z" style="fill: #f5f1ee;"/>
  <path d="M60.6,160.6c.2.2.3.5.4.8-.3.1-.6-.4-.4-.8Z" style="fill: #7e3c33;"/>
  <path d="M65,160.7c.3,0,.9.4.9.8h-.2c-.1-.2-.3-.4-.4-.5,0,0,0,0-.1-.1h-.1Z" style="fill: #7e3c33;"/>
  <path d="M79.2,160.7h.2c0,0,0,.2,0,.2-.2.1-.3.3-.5.4h-.2c0-.2.4-.5.6-.6Z" style="fill: #843f35;"/>
  <path d="M83.9,160.8c0,.7-.7,1.3-1,1.7-.3.3-.6,1.1-1.1,1h0c.6-.8,1.3-1.6,1.8-2.4,0-.1.2-.2.3-.3Z" style="fill: #81352a;"/>
  <path d="M19.9,161h.1c0,.2.1.3.2.3-.2.2-.7-.1-.3-.3Z" style="fill: #f6f3ee;"/>
  <path d="M33.6,160.9c.1.4-.2.5-.4.7-1.1,1-2.3,1.6-3.6,2.1-.3.1-.4,0-.7-.1,1.4-.3,2.7-1,3.8-1.9,0,0,0,0,.1,0,.2-.2.4-.4.6-.6Z" style="fill: #efe6e3;"/>
  <path d="M65.3,160.9c.1.1.3.3.4.4-.3.2-.6,0-.4-.4Z" style="fill: #f3efec;"/>
  <path d="M79.3,160.9c0,.4-.2.6-.5.4.2-.1.3-.3.5-.4Z" style="fill: #f3efea;"/>
  <path d="M83.7,161.1c-.6.8-1.2,1.6-1.8,2.3v-.3c.4-.6.8-1.1,1.2-1.7.2-.2.3-.5.6-.4Z" style="fill: #f2ebe9;"/>
  <path d="M61.3,161.3c.4.4.6.8,1,1.2.2.3.4.4.3.8-.1-.2-.2-.3-.4-.4h-.1c0-.1-.1-.3-.1-.3-.3-.4-.6-.7-.8-1.1v-.2s.1,0,.1,0Z" style="fill: #f0e7e5;"/>
  <path d="M20.7,161.5h0c0,0,0,.2,0,.2h-.1c0,0,0-.2,0-.2Z" style="fill: #601e14;"/>
  <path d="M32.8,161.6c-1.2.9-2.5,1.6-3.8,1.9-.5.2-.9.1-1.4.2-.8,0-1.5,0-2.2,0l.3-.2c.7,0,1.3,0,2,0,1.4-.1,2.8-.6,4.1-1.4.4-.2.7-.6,1.2-.5Z" style="fill: #7a362b;"/>
  <path d="M61.2,161.5c.3.4.6.7.8,1.1-.4,0-.8-.6-.8-1.1Z" style="fill: #7a2c1f;"/>
  <path d="M65.9,161.6c0,0,.2.1.3.2h.1c0,0,.1.2.1.2.6.4,1.1.8,1.7,1.1-.2.1-.3.2-.5,0-.6-.4-1.3-.8-1.8-1.3v-.2Z" style="fill: #efe9e7;"/>
  <path d="M66.3,161.7h0c0,0,0,.2,0,.2h-.1c0,0,0-.2,0-.2Z" style="fill: #5e2113;"/>
  <path d="M78.6,161.5v.2c-.3.3-.9,1-1.3.7.3-.2.6-.4.9-.6.1,0,.3-.2.4-.3Z" style="fill: #eee6e4;"/>
  <path d="M20.8,161.7c0,0,.2.1.3.2.9.7,1.9,1.2,2.9,1.6-.6.2-1-.1-1.6-.4-.6-.4-1.2-.6-1.7-1.1v-.3Z" style="fill: #f1e9e5;"/>
  <path d="M21.3,161.8c.5.3.9.6,1.4.8.5.2.9.3,1.4.5,0,.1,0,.2,0,.3h-.1c-1-.4-2-.9-2.9-1.6h.3Z" style="fill: #834136;"/>
  <path d="M67.2,162.2c1.1.7,2.2,1.3,3.5,1.4,0,0,0,.2,0,.3-.5-.2-1.1-.2-1.6-.5-.1,0-.3-.1-.4-.2-.1,0-.2-.1-.4-.2-.6-.3-1.2-.7-1.7-1.1.3-.2.5,0,.7.2Z" style="fill: #88493e;"/>
  <path d="M78.2,161.9c-.3.2-.6.4-.9.6-.2.1-.4.2-.6.4h-.2c0-.3.3-.4.6-.6.4-.2.7-.5,1.1-.4Z" style="fill: #813e33;"/>
  <path d="M16.6,162.1c.3.2.5.6.7.9v.3s-.1-.1-.1-.1c-.3-.3-.5-.7-.8-1h.2Z" style="fill: #f1edea;"/>
  <path d="M16.3,162.1h0c.2.4.5.7.8,1-.4.2-.9-.6-.8-1Z" style="fill: #772c20;"/>
  <path d="M37.2,162.5h0c0,.1,0,.2,0,.2v-.2Z" style="fill: #571208;"/>
  <path d="M62.2,162.8h.1c0,.1-.1,0-.1,0Z" style="fill: #692214;"/>
  <path d="M76.3,162.8l.2.2c-.8.3-1.7.7-2.5.9-.2,0-.4,0-.3-.2.9,0,1.7-.6,2.6-.8Z" style="fill: #844338;"/>
  <path d="M36.9,162.9c0,.1-.2.2-.3.4-.2.2-.4.4-.5.6,0,0-.1,0-.2.1-.3.3-.6.5-.9.8v-.3c.3-.3.6-.6,1-1,.3-.3.5-.7.9-.7Z" style="fill: #ede8e5;"/>
  <path d="M76.5,162.9h0s.2,0,.2,0c0,.2-.2.4-.3.4-.8.3-1.6.7-2.4.8-.2,0-.4,0-.6-.2.2,0,.4,0,.6-.1.9-.2,1.7-.6,2.5-.9Z" style="fill: #f2e9e6;"/>
  <path d="M36.6,163.3c.3.4-.3.8-.5.6.2-.2.4-.4.5-.6Z" style="fill: #783024;"/>
  <path d="M68.5,163.2c.1,0,.3.1.4.2.5.3,1.1.3,1.6.5h.2c.5,0,1,.2,1.4.1.4,0,.8,0,1.1.2-1.4.2-2.8,0-4.1-.5-.3-.1-.5-.1-.6-.6Z" style="fill: #efedea;"/>
  <path d="M17.6,163.6c.3-.1.8.2.5.6-.1-.1-.2-.2-.3-.4,0,0-.1-.2-.2-.2Z" style="fill: #f2edeb;"/>
  <path d="M24.7,163.6c.2,0,.4.1.7.1.8,0,1.5.1,2.2,0,.1,0,.2.2.3.3-1.2.1-2.4,0-3.5-.2.1,0,.2-.2.3-.3Z" style="fill: #e9d7d2;"/>
  <path d="M71,163.8c.8,0,1.6,0,2.3,0v.2c-.3,0-.8,0-1.2,0-.5,0-1,0-1.4,0l.3-.2Z" style="fill: #803f35;"/>
  <path d="M81.6,163.7c.2.4-.3.8-.6.6.2-.2.4-.4.6-.6Z" style="fill: #7c3128;"/>
  <path d="M17.8,163.9c.1.1.2.2.3.4h.2c0,.1,0,.2,0,.2-.2.2-.8-.3-.5-.6Z" style="fill: #782a1d;"/>
  <path d="M35.8,164v.3c-.2.2-.5.6-.9.6h0c.3-.3.6-.6.9-.9Z" style="fill: #782f24;"/>
  <path d="M18.3,164.4c.4,0,.8.4,1.1.7.4.4.9.5,1.1,1.1-.6-.4-1.2-.8-1.7-1.3-.1-.1-.3-.2-.4-.3h0Z" style="fill: #ecdfdb;"/>
  <path d="M63.9,164.5c.2.2.4.3.6.5.2.1.3.3.5.4-.2.1-.3.1-.4,0-.3-.3-.6-.4-.7-.9Z" style="fill: #823f35;"/>
  <path d="M80.5,164.8c-.2.2-.3.3-.5.5-.2.2-.5.4-.7.5-.2.1-.5.3-.7.4-.2.1-.4.2-.5.3,0,0-.1,0-.2.1-.9.5-2,.9-3,1.2-.7,0-1.4.3-2.2.2.3-.3.6-.4,1-.4,1,0,1.9-.3,2.8-.7,1-.4,2-.9,2.9-1.6.4-.3.7-.6,1.1-.6Z" style="fill: #eadfdb;"/>
  <path d="M18.7,164.8c.5.5,1.2.9,1.7,1.3,0,0,0,0,.1.1.6.3,1.1.7,1.7.9-.1,0-.2.1-.4.1-.8-.5-1.6-.9-2.3-1.5-.3-.3-.8-.4-.9-1Z" style="fill: #7c372d;"/>
  <path d="M64.4,165c.2,0,.3,0,.5,0,.4.3.8.6,1.2,1h-.2c0,0-.2,0-.2,0-.2-.2-.5-.4-.7-.6-.2-.1-.3-.3-.5-.4Z" style="fill: #f0eae8;"/>
  <path d="M80,165.2c0,.1,0,.2,0,.3-.2.2-.5.6-.7.2.2-.2.5-.3.7-.5Z" style="fill: #783124;"/>
  <path d="M34,165.6c-1.3,1-2.7,1.8-4.3,2.1h0c-.3.1-.5.2-.9.2-.2,0-.5.1-.7.2-1,0-2.1.1-3-.1,0,0-.2,0-.3,0l.2-.2c.5,0,1.1.1,1.7.1.7,0,1.4,0,2.1-.2,1.5-.3,3-.7,4.3-1.7.3-.2.6-.5.9-.3Z" style="fill: #f0e5e2;"/>
  <path d="M34,165.6h0s-.1.3-.1.3c-1.1.9-2.4,1.5-3.7,1.9-.2,0-.4,0-.5-.2,1.5-.3,2.9-1.1,4.3-2.1Z" style="fill: #7e3b31;"/>
  <path d="M21.5,166.4c1,.6,2,.9,3.1,1.1,0,0-.2.2-.3.2-.5-.2-1.1-.2-1.6-.5-.1,0-.3-.1-.4-.2-.6-.3-1.1-.6-1.7-.9.3-.3.6,0,.9.2Z" style="fill: #efe7e4;"/>
  <path d="M65.7,166h.2c.1.2.2.3.4.4-.3.2-.7,0-.6-.4Z" style="fill: #763024;"/>
  <path d="M66.6,166.4h0c0,.1-.3,0-.3,0,0-.2.2-.2.3,0Z" style="fill: #fef4f3;"/>
  <path d="M78.6,166.2c.3.3-.4.7-.5.3.2-.1.4-.2.5-.3Z" style="fill: #7d342a;"/>
  <path d="M67.2,166.6c1.6.8,3.4,1.3,5.1,1.1.2,0,.3,0,.3.3-1.3,0-2.6,0-3.9-.5-.5-.2-.9-.3-1.4-.6-.2-.1-.4-.2-.6-.3.2-.1.3-.2.5,0Z" style="fill: #eee4e1;"/>
  <path d="M66.6,166.7h.1c.2,0,.4.2.6.3-.3.3-.5,0-.7,0v-.2Z" style="fill: #752e24;"/>
  <path d="M77.9,166.6c-.1.6-.9.7-1.3.9-1,.4-2,.8-3.1.7-1.3,0-2.7.1-4-.2-.3-.1-.7-.1-.8-.5,1.3.4,2.6.6,3.9.5h0c.7,0,1.4-.2,2.2-.2,1-.3,2.1-.7,3-1.2Z" style="fill: #7d3b31;"/>
  <path d="M22.7,167.3c.5.2,1.1.3,1.6.5.1,0,.3,0,.5,0,0,.2-.2.2-.3.2-.6,0-1.2-.2-1.7-.5,0,0,0-.2,0-.3Z" style="fill: #803c32;"/>
  <path d="M29.7,167.7v.3c-.4,0-.8.4-.9-.2.3,0,.6,0,.9-.2Z" style="fill: #8b4a3f;"/>
  <path d="M25,168.1v-.2c1.1.2,2.2.2,3.2.1.2,0,.6,0,.6.2-1.2,0-2.4,0-3.5,0,0,0-.2,0-.3-.1Z" style="fill: #6e2e23;"/>
  <path d="M93.9,250.1c.1,1.6,0,3.3,0,4.9,0,12.6,0,25.2,0,37.8,0,1.1,0,2.3,0,3.4-.1-.4-.1-.8-.1-1.2,0-1.2,0-2.5,0-3.7,0-1.1-.1-2.2,0-3.3,0-1.9,0-3.9,0-5.8,0-1.8,0-3.6,0-5.4,0,0-.1-.2-.2-.2.1-.4.2-.7.2-1.2,0-3.8,0-7.5,0-11.3,0-2.3,0-4.5,0-6.8,0-1.6.1-3.1,0-4.7,0-.8,0-1.6.1-2.4Z" style="fill: #9d3c2d;"/>
  <path d="M93.9,296.2c0,1.2,0,2.4,0,3.6h-.1c0-.7,0-1.3,0-1.9,0-.6,0-1.1.1-1.6Z" style="fill: #9e3c2e;"/>
  <path d="M90.3,0h99.7v.5c-2.9,0-5.8,0-8.7,0,0,20.4,0,40.9,0,61.3,0,.8,0,1.6,0,2.4,2.3,0,4.6,0,6.9,0,.6,0,1.2,0,1.8,0v.9c-2.9,0-5.8,0-8.7,0,0,20.8,0,41.5,0,62.3,0,.6-.1,1.2.1,1.8,0,.1,0,.2-.1.3,2.6,0,5.3,0,7.8,0,.3,0,.6,0,.8,0v.4c-2.6,0-5.3,0-7.9,0-.3,0-.5,0-.8,0,0,5.2,0,10.5,0,15.7,0,15.9,0,31.8,0,47.7h.1c2.9.1,5.7,0,8.6.1v1c-2.8,0-5.7,0-8.6,0h0c0,21,0,42.3,0,63.1v.2c2.9,0,5.8,0,8.6,0v1c-2.9,0-5.7,0-8.6,0v.2c0,13.4,0,26.9,0,40.3h-1.1c0-2.4,0-4.8,0-7.2,0-.3,0-.7,0-1-13.1,0-26.6,0-39.6,0,0,2.7,0,5.5,0,8.2h-.8c0-2.7,0-5.4,0-8.1h-.1c-11.6,0-23.1,0-34.7,0-1.6,0-3.3,0-4.9,0,0,2.7,0,5.5,0,8.2h-1c0-5.8,0-11.7,0-17.5,0-6.5,0-13.2,0-19.7.1-1,0-2.1.1-3h.3s0,.2,0,.2c0,9.4,0,18.7,0,28.1,0,.9,0,1.7,0,2.6,0,0,.2,0,.3,0-.3-.4-.2-.8-.2-1.3,0-9.1,0-18.2,0-27.3,0-.9,0-1.8,0-2.6-.1,0-.3.1-.4.2-.4-.1-.8-.1-1.2-.1-2.5,0-5.1,0-7.6,0v.2c0,13,0,26.2,0,39.2,0,.3,0,.6,0,1h-.1v-169.3c0,.2,0,.4,0,.7,0,20.6,0,41.2,0,61.8,0,.3,0,.7,0,1h.2c2.8,0,5.5,0,8.3,0h.2c0-1.6,0-3.1,0-4.6,0-18.3,0-36.5,0-54.8,0-1.2,0-2.5,0-3.7,0-.2,0-.3,0-.5-2.4,0-4.8,0-7.2,0-.5,0-1,0-1.5,0v-.9c2.9,0,5.8,0,8.7,0,.1-.3,0-.7,0-1.1,0-20,0-40,0-60,0-.8,0-1.7,0-2.5h-.2c-2.4,0-4.8,0-7.3,0-.4,0-.8,0-1.2,0,0,.4,0,.9,0,1.4,0,20.3,0,40.5,0,60.8,0,.4,0,1,0,1.4V0Z" style="fill: #6d6d67;"/>
  <path d="M181.3.5c2.9,0,5.8,0,8.7,0v63.8c-.6,0-1.2,0-1.8,0-2.3,0-4.6,0-6.9,0,0-.8,0-1.6,0-2.4,0-20.4,0-40.9,0-61.3Z" style="fill: #b8b7b1;"/>
  <path d="M100.1.6c7.4,0,15,0,22.4,0,1.1,0,2.2,0,3.3,0,0,10,0,20.2,0,30.2,0,.4,0,.8,0,1.1-1.8,0-3.6,0-5.4,0-6.7,0-13.4,0-20.1,0h-.1c0-10,0-20.4,0-30.4,0-.3,0-.6,0-.9Z" style="fill: #b8b7b1;"/>
  <path d="M126.7.6c.5-.1,1,0,1.4,0,8.3,0,16.6,0,24.9,0,.2,0,.5,0,.8,0,0,10.4,0,20.7,0,31.1h-.1c-7.9.2-15.7,0-23.6.2-1.1,0-2.3,0-3.4,0,0-2.3,0-4.6,0-7,0-8.1,0-16.2,0-24.3Z" style="fill: #b8b7b1;"/>
  <path d="M154.6.6h.1c8.5,0,17.1,0,25.6,0,0,.2,0,.4,0,.6,0,7.4,0,14.8,0,22.2,0,2.8,0,5.7,0,8.4-2.1,0-4.3,0-6.5,0-6.4,0-12.8,0-19.2,0v-.2c0-10.3,0-20.6,0-31Z" style="fill: #b8b7b1;"/>
  <path d="M90.4.7c.3,0,.6,0,.9,0,2.3,0,4.5,0,6.8,0,.3,0,.7,0,1,0,0,3.6,0,7.2,0,10.7,0,17.6,0,35.2,0,52.8-2.9,0-5.7,0-8.6,0-.1-.4,0-.8,0-1.2,0-20.7,0-41.5,0-62.2v-.2Z" style="fill: #b8b7b1;"/>
  <path d="M100.1,33c13,0,26.2,0,39.3,0,.2,0,.3,0,.4,0,0,10.3,0,20.9,0,31.3-.6.1-1.2,0-1.8,0-12.5,0-25,0-37.5,0-.2,0-.3,0-.5,0,0-10.2,0-20.5,0-30.8,0-.2,0-.4,0-.5Z" style="fill: #b8b7b1;"/>
  <path d="M140.6,33c8.1,0,16.2,0,24.3,0,5.1,0,10.3,0,15.4,0v.2c0,10.3,0,20.7,0,31h0c-2.4.1-4.7.2-7.1.2-6,0-12,0-18,0-2.5,0-5.1,0-7.6,0-2.3,0-4.6,0-6.9,0,0-4.8,0-9.9,0-14.8,0-5.5,0-11.1,0-16.6Z" style="fill: #b8b7b1;"/>
  <path d="M181.3,65.2c2.9,0,5.8,0,8.7,0v63.9c-2.7,0-5.4,0-8.1,0-.3,0-.6.3-.2.5,2.7,0,5.5,0,8.3,0h0c-.3,0-.6,0-.8,0-2.6,0-5.3,0-7.8,0,0,0,.1-.2.1-.3-.3-.6-.1-1.1-.1-1.8,0-20.8,0-41.5,0-62.3Z" style="fill: #b8b7b1;"/>
  <path d="M100.1,65.4c8.6,0,17.1-.1,25.7,0,0,10.4,0,20.8,0,31.2v.2c-8.5,0-16.9,0-25.3,0-.2,0-.3,0-.5,0,0-10.3,0-20.5,0-30.8,0-.2,0-.3,0-.5Z" style="fill: #b8b7b1;"/>
  <path d="M126.7,65.3c8.7,0,17.4,0,26,0,.4,0,.8,0,1.1,0,0,2.8,0,5.6,0,8.3,0,7.6,0,15.3,0,22.9-1.1,0-2.3,0-3.4,0-7.8,0-15.5,0-23.3,0-.2,0-.3,0-.4,0,0-8,0-16.1,0-24.1,0-2.4,0-4.8,0-7.2Z" style="fill: #b8b7b1;"/>
  <path d="M154.6,65.3h.1c8.5,0,17.1,0,25.6,0v.2c0,4.7,0,9.5,0,14.2,0,5.6,0,11.2,0,16.8v.2c-5.5,0-10.8,0-16.2,0-3.2,0-6.4,0-9.5,0,0-7.3,0-14.2,0-21.6,0-3.2,0-6.5,0-9.7Z" style="fill: #b8b7b1;"/>
  <path d="M90.4,65.5c.4,0,.8,0,1.2,0,2.4,0,4.8,0,7.3,0h.2c0,.9,0,1.8,0,2.6,0,20,0,40,0,60,0,.3,0,.8,0,1.1-2.9,0-5.8,0-8.7,0h0c.2-.5,0-1,0-1.5,0-20.3,0-40.5,0-60.8,0-.5,0-1,0-1.4Z" style="fill: #b8b7b1;"/>
  <path d="M100.1,97.7c3.3,0,6.6,0,9.9,0,6.2,0,12.3-.1,18.5,0,3.5,0,7,0,10.6,0,.2,0,.5,0,.8,0,0,10.4,0,20.9,0,31.3-1.8,0-3.7,0-5.6,0-6.3,0-12.5,0-18.8,0-4.8,0-9.7,0-14.5,0-.3,0-.6,0-.8,0,0-10.2,0-20.3,0-30.4,0-.3,0-.6,0-.9Z" style="fill: #b8b7b1;"/>
  <path d="M140.6,97.7c13.1,0,26.5,0,39.6,0,0,.4,0,.9,0,1.4,0,9.9,0,19.9,0,29.8v.2c-13.2,0-26.5,0-39.7,0,0-8.8,0-17.7,0-26.5,0-1.6,0-3.3,0-4.9Z" style="fill: #b8b7b1;"/>
  <path d="M181.9,129c2.7,0,5.4,0,8.1,0v.5c-2.7,0-5.5,0-8.3,0-.4-.2-.1-.5.2-.5Z" style="fill: #6d6d67;"/>
  <path d="M90.3,130.1c.5,0,1,0,1.5,0,2.4,0,4.8,0,7.2,0,0,.1,0,.3,0,.5,0,1.2,0,2.5,0,3.7,0,18.3,0,36.5,0,54.8,0,1.5,0,3,0,4.5h-.2c-2.8,0-5.5,0-8.3,0h-.2c0-.4,0-.7,0-1.1,0-20.6,0-41.2,0-61.8,0-.2,0-.4,0-.7h0Z" style="fill: #b8b7b1;"/>
  <path d="M125.8,130c0,1.5,0,3.1,0,4.7,0,8.8,0,17.7,0,26.5v.2c-5.5,0-10.9,0-16.4,0-3.1,0-6.2,0-9.2,0h-.1c0-10.4,0-20.9,0-31.3,1.6,0,3.3,0,4.9,0,7,0,13.8-.1,20.8-.1Z" style="fill: #b8b7b1;"/>
  <path d="M126.7,130.1c6.6,0,13.3,0,19.9,0,2.4,0,4.7,0,7.1,0h.1c0,5.6,0,11.2,0,16.8,0,4.9,0,9.7,0,14.6-.1,0-.3,0-.4,0-8.9,0-17.7,0-26.6,0-.1-.4,0-.9,0-1.4,0-6.9,0-13.8,0-20.7,0-3.1,0-6.2,0-9.3Z" style="fill: #b8b7b1;"/>
  <path d="M154.6,130.1c1.2-.1,2.4,0,3.6,0,7.4,0,14.7,0,22.1,0,0,.2,0,.4,0,.6,0,10.2,0,20.4,0,30.6v.2c-8.6,0-17.1,0-25.7,0v-.2c0-8.8,0-17.5,0-26.3,0-1.6,0-3.2,0-4.8Z" style="fill: #b8b7b1;"/>
  <path d="M181.3,130.1c.2,0,.5,0,.8,0,2.6,0,5.3,0,7.9,0v63.6c-2.9,0-5.7,0-8.6,0h-.1c0-16,0-31.9,0-47.8,0-5.2,0-10.5,0-15.7Z" style="fill: #b8b7b1;"/>
  <path d="M118.2,162.4c2.9,0,5.7-.1,8.6,0,4.3,0,8.7,0,13,0,0,7,0,14,0,21,0,3.4,0,6.8,0,10.1-.3.2-.7,0-1,.1-3.9,0-7.8,0-11.7,0-4.3-.1-8.7,0-13,0-2.1,0-4.3,0-6.4,0-2.5,0-5.1,0-7.6,0,0-.3,0-.6,0-.9,0-10,0-20.2,0-30.2h.2c2.7,0,5.4,0,8.1,0,3.3,0,6.6,0,9.9,0Z" style="fill: #b8b7b1;"/>
  <path d="M140.7,162.4c1.5,0,3,0,4.4,0,6.1-.1,12.2,0,18.3,0,5.6,0,11.2,0,16.8,0v.2c0,7.2,0,14.4,0,21.6,0,3.1,0,6.3,0,9.4-13.2,0-26.2,0-39.5,0h-.2c0-9.9,0-19.8,0-29.7,0-.5,0-1.1,0-1.5Z" style="fill: #b8b7b1;"/>
  <path d="M153.8,194.6c0,10.2,0,21,0,31.2-1.8,0-3.7,0-5.6,0-7.2,0-14.3,0-21.5,0v-.2c0-2.2,0-4.4,0-6.6,0-8.1,0-16.2,0-24.3h.1c6.5,0,13,0,19.5,0,2.5,0,5,0,7.5-.1Z" style="fill: #b8b7b1;"/>
  <path d="M181.4,194.6c2.9,0,5.7,0,8.6,0v63.3c-2.9,0-5.7,0-8.6,0v-.2c0-20.8,0-42.1,0-62.9h0Z" style="fill: #b8b7b1;"/>
  <path d="M90.4,194.7c2.9,0,5.7,0,8.6,0,0,21,0,42.1,0,63.1-2.9,0-5.7,0-8.6,0,0-.2,0-.4,0-.6,0-20.8,0-41.6,0-62.4v-.2Z" style="fill: #b8b7b1;"/>
  <path d="M100,194.7c7.9,0,15.9,0,23.8,0,.6,0,1.4-.1,2,0,0,7.8,0,15.8,0,23.6,0,2.5,0,4.9,0,7.4v.2c-8.3,0-16.6,0-24.8,0-.3,0-.7,0-1,0,0-10.4,0-20.8,0-31.2Z" style="fill: #b8b7b1;"/>
  <path d="M154.6,194.8h.1c8.2,0,16.5,0,24.8-.1.3,0,.6,0,.9,0v.2c0,10.3,0,20.5,0,30.8v.2c-8.6,0-17.1,0-25.6,0v-.2c0-8.8,0-17.7,0-26.5,0-1.5,0-3,0-4.4Z" style="fill: #b8b7b1;"/>
  <path d="M100.1,226.9c5.7,0,11.2,0,16.8,0,7.4,0,14.7,0,22.1,0,.2,0,.5,0,.8,0,0,10.3,0,20.6,0,30.9-.4,0-.7,0-1.1,0-9.4,0-18.7,0-28.1,0-3.5,0-6.9,0-10.4,0h-.2c0-10,0-20.1,0-30.1,0-.3,0-.6,0-.9Z" style="fill: #b8b7b1;"/>
  <path d="M140.7,226.9c13.1,0,26.5,0,39.6,0v.2c0,9.7,0,19.5,0,29.2,0,.5,0,1.1,0,1.5-13.2,0-26.5,0-39.6,0,0-10,0-20.1,0-30,0-.3,0-.6,0-1Z" style="fill: #b8b7b1;"/>
  <path d="M99.6,258.9c0,.9,0,1.8,0,2.6,0,9.1,0,18.2,0,27.3,0,.5-.1.9.2,1.3,0,0-.2,0-.3,0,0-.9,0-1.7,0-2.6,0-9.4,0-18.7,0-28.1v-.2c0,0-.3,0-.3,0-.2.9,0,2-.1,3,0,6.5,0,13.1,0,19.7,0,5.8,0,11.7,0,17.5h-8.6c0-.3,0-.6,0-1,0-13,0-26.2,0-39.2v-.2c2.6,0,5.1,0,7.7,0,.4,0,.8,0,1.2.1.1,0,.3-.1.4-.2Z" style="fill: #b8b7b1;"/>
  <path d="M117,258.9c2.9,0,5.8,0,8.7,0,0,10.3,0,20.8,0,31.2h0c-3.6,0-7.1.2-10.7.2-4.8,0-9.7,0-14.5,0-.2,0-.3,0-.5,0,0-.3,0-.6,0-.9,0-10,0-20.2,0-30.2.7-.1,1.4,0,2.1,0,4.9,0,9.9,0,14.9-.1Z" style="fill: #b8b7b1;"/>
  <path d="M126.7,258.9c4.8,0,9.5,0,14.3,0,2.9,0,5.8,0,8.7,0,1.3,0,2.8,0,4.1,0,0,10.4,0,20.7,0,31.1-.1,0-.3.1-.4,0-5.7.1-11.5,0-17.2,0-3.1,0-6.3,0-9.4,0v-.2c0-8.1,0-16.2,0-24.4,0-2.2,0-4.5,0-6.7Z" style="fill: #b8b7b1;"/>
  <path d="M154.6,258.9c.1,0,.3,0,.4,0,8.4,0,16.9,0,25.3,0v.2c0,10.3,0,20.7,0,31h0c-4.2,0-8.5.1-12.7.1-4.3,0-8.6,0-13,0,0-10.4,0-20.9,0-31.2Z" style="fill: #b8b7b1;"/>
  <path d="M181.4,258.9c2.9,0,5.7,0,8.6,0v40.5h-8.6c0-13.4,0-26.9,0-40.3v-.2Z" style="fill: #b8b7b1;"/>
  <path d="M100,291.2c1.6,0,3.3,0,4.9,0,11.6,0,23.1,0,34.7,0h.1c0,2.8,0,5.5,0,8.2h-39.7c0-2.7,0-5.5,0-8.2Z" style="fill: #b8b7b1;"/>
  <path d="M140.6,291.2c13,0,26.6,0,39.6,0,0,.3,0,.7,0,1,0,2.4,0,4.8,0,7.2h-39.7c0-2.7,0-5.5,0-8.2Z" style="fill: #b8b7b1;"/>
</svg>
`,

  infra_feldweg: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="30" y="35" width="40" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_schotterweg: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="30" y="35" width="40" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_unterfuehrungsweg: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="30" y="30" width="40" height="40" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Kreuzungen & Übergänge
  // ---------------------------------------------------------------------------

  infra_kreuzung_4arm: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="45" y="20" width="10" height="60" fill="#cccccc" stroke="#000000" stroke-width="2" />
  <rect x="20" y="45" width="60" height="10" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_kreuzung_t: `
<svg id="infra_kreuzung_t" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><polygon points="0 300 100 300 100 199.99995 200 199.99995 200 99.99992 100 99.99992 100 0 0 0 0 99.99992 0 199.99995 0 300" fill="#525252" fill-rule="evenodd"/><path d="M2.00014,300h2.99992V0h-2.99992v300h0ZM200,105.0001v-3.00004h-102.00003V0h-3.00004v105.0001h105.00007ZM94.99994,195.00002v104.99998h3.00004v-102.00006h102.00002v-2.99992h-105.00006Z" fill="#e7e6e6" fill-rule="evenodd"/><rect x="47.88861" y="260.18518" width="4.00005" height="25.00021" fill="#fff"/><rect x="47.88861" y="211.11118" width="4.00005" height="25.00009" fill="#fff"/><rect x="47.88861" y="160.18513" width="4.00005" height="25.00021" fill="#fff"/><rect x="47.88861" y="111.11114" width="4.00005" height="25.0001" fill="#fff"/><rect x="47.88861" y="60.1851" width="4.00005" height="25.00021" fill="#fff"/><rect x="47.88861" y="11.1111" width="4.00005" height="25.0001" fill="#fff"/><rect x="160.1852" y="148.11139" width="25.00009" height="3.99994" fill="#fff"/><rect x="111.1111" y="148.11139" width="25.00009" height="3.99994" fill="#fff"/><rect x="94.99994" y="109.36339" width="3.00004" height="38.748" fill="#b4b4b4"/><rect id="conn-top" x="48" width="4" height="4" fill="#fff" opacity="0"/><rect id="conn-bottom" x="48" y="296" width="4" height="4" fill="#fff" opacity="0"/><rect id="conn-right" x="196" y="148" width="4" height="4" fill="#fff" opacity="0"/></svg>
`,

  infra_kreuzung_y: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="45" y="20" width="10" height="40" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_kreuzung_mittelinsel: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="45" y="20" width="10" height="60" fill="#cccccc" stroke="#000000" stroke-width="2" />
  <rect x="20" y="45" width="60" height="10" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_abknickende_vorfahrt_links: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="45" y="20" width="10" height="40" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_abknickende_vorfahrt_rechts: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="45" y="20" width="10" height="40" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_versetzte_kreuzung: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="45" y="15" width="10" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
  <rect x="45" y="55" width="10" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_einmuendung_links: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="45" y="20" width="10" height="60" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_einmuendung_rechts: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="45" y="20" width="10" height="60" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_einmuendung_eng: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="45" y="20" width="10" height="60" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_einmuendung_breit: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="40" y="20" width="20" height="60" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_zebrastreifen: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="40" width="60" height="5" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_mittelinsel_ueberweg: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="40" width="60" height="5" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_bahnuebergang_mit_schranke: `
<svg id="infra_bahnuebergang_mit_schranke" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 300 300">
  <!-- Generator: Adobe Illustrator 29.8.3, SVG Export Plug-In . SVG Version: 2.1.1 Build 3)  -->
  <path d="M0,200v-100h300v100H0Z" style="fill: #e7e6e6; fill-rule: evenodd;"/>
  <rect x="206" y="114.8" width="12.1" height="70.4" style="fill: #673434;"/>
  <rect x="231.3" y="114.8" width="12.1" height="70.4" style="fill: #673434;"/>
  <rect x="256.6" y="114.8" width="12.1" height="70.4" style="fill: #673434;"/>
  <rect x="282" y="114.8" width="12.1" height="70.4" style="fill: #673434;"/>
  <rect x="6" y="114.8" width="12.1" height="70.4" style="fill: #673434;"/>
  <rect x="31.3" y="114.8" width="12.1" height="70.4" style="fill: #673434;"/>
  <rect x="56.6" y="114.8" width="12.1" height="70.4" style="fill: #673434;"/>
  <rect x="82" y="114.8" width="12.1" height="70.4" style="fill: #673434;"/>
  <rect x="100" y="100" width="100" height="100" style="fill: #c63;"/>
  <rect x="100" y="126.4" width="100" height="10.6" style="fill: #9f4b1f;"/>
  <rect x="100" y="163.1" width="100" height="10.6" style="fill: #9f4b1f;"/>
  <rect x="100" y="200" width="100" height="100" style="fill: #525252;"/>
  <rect x="102" y="200" width="3" height="100" style="fill: #e7e6e6;"/>
  <rect x="195" y="200" width="3" height="100" style="fill: #e7e6e6;"/>
  <rect x="147.9" y="260.2" width="4" height="25" style="fill: #fff;"/>
  <rect x="147.9" y="211.1" width="4" height="25" style="fill: #fff;"/>
  <rect y="129.2" width="300" height="5" style="fill: #cdcccc;"/>
  <rect y="165.8" width="300" height="5" style="fill: #cdcccc;"/>
  <rect x="100" y="185.2" width="100" height="4.8" style="fill: #f4e600;"/>
  <rect x="100" y="110" width="100" height="4.8" style="fill: #f4e600;"/>
  <rect x="139.2" y="215.9" width="98.2" height="3" style="fill: #e52521;"/>
  <polygon points="144.2 218.9 147.2 218.9 149 215.9 146 215.9 144.2 218.9" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="151.8 218.9 154.8 218.9 156.6 215.9 153.6 215.9 151.8 218.9" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="159.4 218.9 162.4 218.9 164.2 215.9 161.2 215.9 159.4 218.9" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="167 218.9 170 218.9 171.7 215.9 168.7 215.9 167 218.9" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="174.6 218.9 177.6 218.9 179.3 215.9 176.3 215.9 174.6 218.9" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="182.2 218.9 185.2 218.9 186.9 215.9 183.9 215.9 182.2 218.9" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="189.8 218.9 192.8 218.9 194.5 215.9 191.5 215.9 189.8 218.9" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="197.3 218.9 200.3 218.9 202.1 215.9 199.1 215.9 197.3 218.9" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="204.9 218.9 207.9 218.9 209.7 215.9 206.7 215.9 204.9 218.9" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="212.5 218.9 215.5 218.9 217.3 215.9 214.3 215.9 212.5 218.9" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="220.1 218.9 223.1 218.9 224.8 215.9 221.8 215.9 220.1 218.9" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="227.7 218.9 230.7 218.9 232.4 215.9 229.4 215.9 227.7 218.9" style="fill: #fff; fill-rule: evenodd;"/>
  <rect x="237.4" y="213.9" width="12.9" height="7" style="fill: #b4b4b4;"/>
  <rect x="243.9" y="213.9" width="6.5" height="7" style="fill: #676767;"/>
  <rect x="224.2" y="218.9" width="2.8" height="3.5" style="fill: #676767;"/>
  <polygon points="217.6 236.1 233.7 236.1 235.7 234.1 235.7 224.4 233.7 222.4 217.6 222.4 215.6 224.4 215.6 234.1 217.6 236.1" style="fill: #b4b4b4; fill-rule: evenodd;"/>
  <rect x="215.6" y="225.4" width="20.1" height="7.6" style="fill: #676767;"/>
  <rect x="219.4" y="227" width="12.5" height="4.5" style="fill: #343434;"/>
  <rect x="100" width="100" height="100" style="fill: #525252;"/>
  <rect x="195" width="3" height="100" style="fill: #e7e6e6;"/>
  <rect x="102" width="3" height="100" style="fill: #e7e6e6;"/>
  <rect x="148.1" y="14.8" width="4" height="25" style="fill: #fff;"/>
  <rect x="148.1" y="63.9" width="4" height="25" style="fill: #fff;"/>
  <rect x="62.6" y="81.1" width="98.2" height="3" style="fill: #e52521;"/>
  <polygon points="155.8 81.1 152.8 81.1 151 84.1 154 84.1 155.8 81.1" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="148.2 81.1 145.2 81.1 143.4 84.1 146.4 84.1 148.2 81.1" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="140.6 81.1 137.6 81.1 135.8 84.1 138.8 84.1 140.6 81.1" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="133 81.1 130 81.1 128.3 84.1 131.3 84.1 133 81.1" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="125.4 81.1 122.4 81.1 120.7 84.1 123.7 84.1 125.4 81.1" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="117.8 81.1 114.8 81.1 113.1 84.1 116.1 84.1 117.8 81.1" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="110.2 81.1 107.2 81.1 105.5 84.1 108.5 84.1 110.2 81.1" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="102.7 81.1 99.7 81.1 97.9 84.1 100.9 84.1 102.7 81.1" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="95.1 81.1 92.1 81.1 90.3 84.1 93.3 84.1 95.1 81.1" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="87.5 81.1 84.5 81.1 82.7 84.1 85.7 84.1 87.5 81.1" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="79.9 81.1 76.9 81.1 75.2 84.1 78.2 84.1 79.9 81.1" style="fill: #fff; fill-rule: evenodd;"/>
  <polygon points="72.3 81.1 69.3 81.1 67.6 84.1 70.6 84.1 72.3 81.1" style="fill: #fff; fill-rule: evenodd;"/>
  <rect x="49.7" y="79.1" width="12.9" height="7" style="fill: #b4b4b4;"/>
  <rect x="49.7" y="79.1" width="6.5" height="7" style="fill: #676767;"/>
  <rect x="72.9" y="77.6" width="2.8" height="3.5" style="fill: #676767;"/>
  <polygon points="82.4 63.9 66.3 63.9 64.3 65.9 64.3 75.6 66.3 77.6 82.4 77.6 84.4 75.6 84.4 65.9 82.4 63.9" style="fill: #b4b4b4; fill-rule: evenodd;"/>
  <rect x="64.3" y="67" width="20.1" height="7.6" style="fill: #676767;"/>
  <rect x="68.1" y="68.5" width="12.5" height="4.5" style="fill: #343434;"/>
  <rect x="147.9" y="257.2" width="48.4" height="3" style="fill: #e7e6e6;"/>
  <rect x="103.4" y="38.3" width="48.7" height="3" style="fill: #e7e6e6;"/>
  <circle id="conn" cx="150" cy="2" r="2" style="fill: #e7e6e6; fill-opacity: 0;"/>
  <circle id="conn-2" cx="150" cy="298" r="2" style="fill: #e7e6e6; fill-opacity: 0;"/>
</svg>
`,

  infra_bahnuebergang_ohne_schranke: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="25" y="40" width="50" height="10" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_radweg_kreuzung: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="18" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_uebergang_fahrbahn_gehweg: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="25" y="40" width="20" height="20" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_kreisverkehr_klein: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="15" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_kreisverkehr_gross: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="22" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_kreisverkehr_mini: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="10" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Begrenzungen
  // ---------------------------------------------------------------------------

  infra_mauer_kurz: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="45" width="40" height="10" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_mauer_lang: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="10" y="45" width="80" height="10" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_betonsperre: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="45" width="60" height="12" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_laermschutzwand: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="18" y="30" width="64" height="40" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_zaun_holz: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="35" width="60" height="4" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_zaun_draht: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="35" width="60" height="4" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_zaun_metall: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="35" width="60" height="4" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_zaun_garten: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="35" width="60" height="4" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_poller_einzel: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="46" y="35" width="8" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_poller_reihe: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="26" y="35" width="8" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
  <rect x="46" y="35" width="8" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
  <rect x="66" y="35" width="8" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_poller_kette: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="30" y="35" width="6" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
  <rect x="64" y="35" width="6" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_leitplanke_kurz: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="46" width="40" height="8" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_leitplanke_lang: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="10" y="46" width="80" height="8" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_bordstein: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="50" width="60" height="6" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_boeschung_links: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="20,70 40,50 40,70" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_boeschung_rechts: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="60,50 80,70 60,70" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // ÖPNV & Haltepunkte
  // ---------------------------------------------------------------------------

  infra_bushaltestellenhaeuschen: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="40" width="60" height="25" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_haltebucht: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="15" y="50" width="70" height="12" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_busteig: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="50" width="60" height="12" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_bushaltestellen_markierung: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="55" width="60" height="6" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_tram_haltestelle: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="44" width="60" height="12" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_bahnsteig: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="18" y="40" width="64" height="16" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_ubahn_zugang: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="30" y="30" width="40" height="40" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_sbahn_zugang: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="30" y="30" width="40" height="40" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_oberleitungsmast: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="48" y="20" width="4" height="60" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Parken & Stellflächen
  // ---------------------------------------------------------------------------

  infra_parkplatz_einzel: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="30" y="35" width="40" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_parkplatz_doppel: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="35" width="25" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
  <rect x="55" y="35" width="25" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_parkstreifen_laengs: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="40" width="60" height="18" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_parkbucht_laengs: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="40" width="60" height="18" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_parkbucht_schraeg: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="20,55 80,40 80,60" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_parkplatz_behindert: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="30" y="35" width="40" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_motorradstellplatz: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="35" y="38" width="30" height="24" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_garagenzufahrt: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="20,70 50,40 80,70" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_carportzufahrt: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="20,70 50,40 80,70" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_garage_silhouette: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="25" y="35" width="50" height="35" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_carport_dach: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="20,45 50,30 80,45" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  // ---------------------------------------------------------------------------
  // Sonstige Infrastruktur
  // ---------------------------------------------------------------------------

  infra_bruecke_symbol: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="18" y="50" width="64" height="10" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_unterfuehrung_eingang: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="32" y="30" width="36" height="40" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_fussgaengerueberfuehrung: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="18" y="40" width="64" height="12" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_baustellenflaeche: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="20" y="35" width="60" height="30" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_aufgerissene_fahrbahn: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="18" y="45" width="64" height="10" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_absperrgitter_nicht_stvo: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="18" y="40" width="64" height="14" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_hydrant_boden: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="8" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_gully: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="10" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_schachtdeckel: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="12" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_rampe_hoehenkante: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="20,60 80,50 80,60" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,

  infra_podest_terrasse: `
<svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="25" y="40" width="50" height="20" fill="#cccccc" stroke="#000000" stroke-width="2" />
</svg>
`,
}
