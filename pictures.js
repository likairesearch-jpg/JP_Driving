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
 return `<figure class="sign-figure"><svg viewBox="0 0 360 240" role="img" aria-label="${escapeHTML(q.imageDescription)}"><title>${escapeHTML(q.imageDescription)}</title>${shapes[q.picture]}</svg><figcaption>观察图形，判断题干是否正确 · 原创示意图</figcaption></figure>`;
}
