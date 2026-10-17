// Faithful simplified SVGs based on the official references in questions.js.
function pictureSVG(q){
 const circle=(fill)=>`<circle cx="180" cy="120" r="82" fill="${fill}" stroke="#d92c3b" stroke-width="14"/>`;
 const road='<rect x="70" width="220" height="240" fill="#58696a"/><path d="M80 0v240M280 0v240" stroke="white" stroke-width="3"/>';
 const shapes={
 stop:'<path d="M72 38H288L180 220Z" fill="#d92c3b" stroke="white" stroke-width="6"/><text x="180" y="103" text-anchor="middle" font-size="36" font-weight="bold" fill="white">止まれ</text><text x="180" y="140" text-anchor="middle" font-size="23" fill="white">STOP</text>',
 entry:circle('#d92c3b')+'<path d="M119 120H241" stroke="white" stroke-width="25"/>',
 parking:circle('#164b9d')+'<path d="M124 64L236 176" stroke="#d92c3b" stroke-width="14"/>',
 stopping:circle('#164b9d')+'<path d="M124 64L236 176M236 64L124 176" stroke="#d92c3b" stroke-width="14"/>',
 speed:circle('white')+'<text x="180" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="90" font-weight="bold" fill="#164b9d">40</text>',
 oneway:'<rect x="55" y="60" width="250" height="120" rx="4" fill="#164b9d" stroke="white" stroke-width="5"/><path d="M88 102h125V80l62 40-62 40v-22H88Z" fill="white"/>',
 diamond:road+'<path d="M180 30L216 120 180 210 144 120Z" fill="none" stroke="white" stroke-width="8"/>',
 stopline:road+'<path d="M180 0v240" stroke="white" stroke-width="3" stroke-dasharray="18 14"/><path d="M83 90h91" stroke="white" stroke-width="12"/><path d="M40 65L79 88" stroke="#f6d76a" stroke-width="3"/><text x="10" y="48" font-size="14">所问白线</text>',
 crosswalk:road+'<path d="M94 85v70M124 85v70M154 85v70M184 85v70M214 85v70M244 85v70M274 85v70" stroke="white" stroke-width="16"/>',
 yellow:road+'<path d="M180 0v240" stroke="#f6bf35" stroke-width="6"/><g fill="#468ca2" stroke="white" stroke-width="2"><rect x="110" y="35" width="36" height="55" rx="7"/><rect x="110" y="160" width="36" height="55" rx="7"/></g><path d="M120 60l8-10 8 10M120 185l8-10 8 10" stroke="white" stroke-width="3" fill="none"/>'
 };
 Object.assign(shapes,{
  slow:'<path d="M72 38H288L180 220Z" fill="white" stroke="#d92c3b" stroke-width="12"/><text x="180" y="111" text-anchor="middle" font-size="38" fill="#164b9d">徐行</text>',
  closed:circle('white'),
  straight:'<circle cx="180" cy="120" r="88" fill="#164b9d"/><path d="M163 187V105h-28l45-53 45 53h-28v82Z" fill="white"/>',
  uturn:circle('white')+'<path d="M210 179V94a30 30 0 0 0-60 0v48" fill="none" stroke="#164b9d" stroke-width="15"/><path d="M128 128l22 36 22-36Z" fill="#164b9d"/><path d="M124 64L236 176" stroke="#d92c3b" stroke-width="14"/>',
  park:'<rect x="90" y="30" width="180" height="180" rx="5" fill="#164b9d" stroke="white" stroke-width="6"/><text x="180" y="173" text-anchor="middle" font-family="Arial,sans-serif" font-size="150" fill="white">P</text>',
  curveWarning:'<path d="M180 15L285 120 180 225 75 120Z" fill="#f4c540" stroke="#232b2b" stroke-width="5"/><path d="M157 182v-53q0-35 35-35h22" fill="none" stroke="#232b2b" stroke-width="17"/><path d="M203 70l32 24-32 24Z" fill="#232b2b"/>',
  minimum:circle('white')+'<text x="180" y="145" text-anchor="middle" font-family="Arial,sans-serif" font-size="82" fill="#164b9d">50</text><path d="M129 164h102" stroke="#164b9d" stroke-width="9"/>',
  timedParking:'<g transform="translate(45,-5) scale(.75)">'+shapes.parking+'</g><rect x="118" y="171" width="124" height="48" fill="white" stroke="#164b9d" stroke-width="3"/><text x="180" y="205" text-anchor="middle" font-size="30" fill="#164b9d">8-20</text>',
  roadSpeed:road+'<text x="180" y="158" text-anchor="middle" font-size="100" font-family="Arial,sans-serif" font-weight="bold" fill="#f6bf35">40</text>',
  laneArrow:road+'<path d="M171 205V75h-26l35-42 35 42h-26v130Z" fill="white"/>',
  laneYellow:road+'<path d="M180 0v240" stroke="#f6bf35" stroke-width="6"/><g fill="white"><path d="M121 190V83h-15l22-30 22 30h-15v107Z"/><path d="M223 190V83h-15l22-30 22 30h-15v107Z"/></g>',
  edgeSolid:'<rect x="70" width="220" height="240" fill="#58696a"/><path d="M80 0v240" stroke="#f6bf35" stroke-width="7"/>',
  edgeDashed:'<rect x="70" width="220" height="240" fill="#58696a"/><path d="M80 0v240" stroke="#f6bf35" stroke-width="7" stroke-dasharray="25 20"/>',
  keepClear:road+'<path d="M90 65h180v110H90ZM90 65l180 110M270 65L90 175" fill="none" stroke="white" stroke-width="5"/>'
 });
 return `<figure class="sign-figure"><svg viewBox="0 0 360 240" role="img" aria-label="${escapeHTML(q.imageDescription)}"><title>${escapeHTML(q.imageDescription)}</title>${shapes[q.picture]}</svg><figcaption>观察图形，判断题干是否正确 · 原创示意图</figcaption></figure>`;
}

function expandedSceneSVG(kind,revealed){
 const car=(x,y,color='#337fa0',rotate=0)=>`<g transform="translate(${x} ${y}) rotate(${rotate} 20 30)"><rect width="40" height="60" rx="7" fill="${color}" stroke="white" stroke-width="2"/><rect x="5" y="8" width="30" height="12" fill="#cbe1e4"/><path d="M15 37l5-7 5 7" fill="none" stroke="white" stroke-width="2"/></g>`;
 const person=(x,y)=>`<g transform="translate(${x} ${y})" fill="#bc683f" stroke="#bc683f" stroke-width="4"><circle cy="-10" r="7"/><path d="M0 0v18m-10-12 10-4 10 4M0 18l-8 12m8-12 8 12" fill="none"/></g>`;
 const bike=(x,y)=>`<g transform="translate(${x} ${y})" fill="none" stroke="#ecd45b" stroke-width="3"><ellipse cy="-14" rx="6" ry="10"/><ellipse cy="14" rx="6" ry="10"/><path d="M0-20v40M-10-10h20"/></g>`;
 const base='<rect x="190" width="240" height="280" fill="#667c7b"/><path d="M310 0v280" stroke="white" stroke-width="3" stroke-dasharray="18 16"/><path d="M200 0v280M420 0v280" stroke="white" stroke-width="3"/>';
 const definitions={
  parkedChild:{label:'住宅街左侧停着灰色车，车左前方有儿童，本车在后方。',caption:'住宅街 · 駐車車両と子供',body:car(211,72,'#8a9593')+person(185,71)+car(259,194),answer:'注意遮挡，减速确认'},
  leftCycle:{label:'蓝色本车准备左转，左后方黄色自行车接近。',caption:'左折予定 · 左後方に自転車',body:'<rect x="0" y="50" width="620" height="90" fill="#667c7b"/>'+car(245,154)+bike(217,237)+'<path d="M265 143v-38h-39m10-8-10 8 10 8" fill="none" stroke="#9ec5bf" stroke-width="4"/>',answer:'确认左后方，避免卷入'},
  rightBike:{label:'蓝色本车准备右转，对向灰色卡车后方有黄色摩托车。',caption:'右折予定 · 対向車と二輪車',body:'<rect x="0" y="90" width="620" height="80" fill="#667c7b"/>'+car(238,184)+car(348,75,'#8a9593',180)+bike(370,35)+'<path d="M258 174v-35h55m-10-8 10 8-10 8" fill="none" stroke="#9ec5bf" stroke-width="4"/>',answer:'注意对向车辆遮挡，等待安全间隙'},
  highwayBreakdown:{label:'高速公路左侧路肩停着灰色故障车，车旁有人和警示三角，本车在主路后方。',caption:'高速道路 · 路肩に故障車',body:car(148,65,'#8a9593')+person(127,80)+car(240,194)+'<path d="M158 150l-12 23h24Z" fill="none" stroke="#c8553f" stroke-width="4"/>',answer:'留足间隔，避免突然变道或围观停车'},
  fog:{label:'雾天灰白雾带遮挡前路，前车尾灯位于本车前方。',caption:'濃霧 · 見通し不良',body:car(240,28,'#9aa6a0')+car(240,198)+'<g fill="none" stroke="#dfe6e2" stroke-width="19" opacity=".75"><path d="M35 50h550M60 95h500M25 141h560M80 178h470"/></g>',answer:'降低速度，留足车距'},
  downhill:{label:'侧面示意：车辆位于长下坡，坡底前方有弯曲道路。',caption:'長い下り坂 · この先カーブ',body:'<rect width="620" height="280" fill="#e9efdf"/><path d="M30 50l325 145q100 50 220-20" fill="none" stroke="#667c7b" stroke-width="58"/><path d="M30 50l325 145q100 50 220-20" fill="none" stroke="white" stroke-width="3" stroke-dasharray="16 13"/><g transform="translate(190 101) rotate(24)"><rect width="60" height="30" rx="5" fill="#337fa0" stroke="white" stroke-width="2"/><path d="M40 8l10 7-10 7" fill="none" stroke="white" stroke-width="2"/></g>',answer:'入弯前减速，使用发动机制动'}
 };
 const d=definitions[kind];if(!d)return null;
 return `<figure><svg viewBox="0 0 620 280" role="img" aria-label="${d.label}"><title>${d.label}</title>${base}${d.body}${revealed?`<rect x="8" y="245" width="604" height="29" rx="4" fill="#eff5ee"/><text x="20" y="266" fill="#225d48" font-size="17">${d.answer}</text>`:''}</svg><figcaption>${d.caption} · 原创场景示意，非比例绘制</figcaption></figure>`;
}
