const fs=require('fs'),https=require('https');const T=process.env.VC_TOKEN;
const files=[{file:'index.html'},{file:'vercel.json'},{file:'README.md'}].filter(f=>fs.existsSync(f.file)).map(f=>({file:f.file,data:fs.readFileSync(f.file).toString('base64'),encoding:'base64'}));
const body=JSON.stringify({name:'casa-house-designer',files,target:'production',projectSettings:{framework:null,buildCommand:null,outputDirectory:null,installCommand:null}});
const r=https.request('https://api.vercel.com/v13/deployments',{method:'POST',headers:{'Authorization':'Bearer '+T,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}},res=>{let d='';res.on('data',c=>d+=c).on('end',()=>{try{const j=JSON.parse(d);console.log(j.error?('ERR '+JSON.stringify(j.error)):('STATUS '+res.statusCode+' https://'+(j.alias&&j.alias[0]||j.url)))}catch(e){console.log('RAW',d.slice(0,200))}})});
r.write(body);r.end();
