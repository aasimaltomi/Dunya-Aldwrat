const fs=require('node:fs');
const path=require('node:path');

const file=path.join(__dirname,'..','data.json');
const data=JSON.parse(fs.readFileSync(file,'utf8'));
const rwaq=data.platforms.find(p=>p.id==='plat-33');
if(!rwaq)throw new Error('Rwaq platform plat-33 not found');
rwaq.logo=rwaq.logo||{};
rwaq.logo.src='https://www.google.com/s2/favicons?domain=rwaq.org&sz=128';
fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
