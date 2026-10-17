const fs=require('node:fs'),path=require('node:path');
const {QUESTIONS}=require('./questions.js');
const read=s=>s.replace(/\{([^|{}]+)\|([^{}]+)\}/g,'$2');
const rows=QUESTIONS.map(q=>({id:q.id,text:read(q.prompt)+(q.type==='scene'?'。'+q.statements.map((s,i)=>`${i+1}。${read(s.text)}`).join('。'):'')}));
fs.mkdirSync(path.join(__dirname,'audio'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'audio/texts.json'),JSON.stringify(rows,null,2));
