const fs=require('fs'), https=require('https');
const TOKEN=process.env.VC_TOKEN;
const files=[{file:'index.html'},{file:'vercel.json'},{file:'README.md'}].map(f=>({
  file:f.file, data:fs.readFileSync(f.file).toString('base64'), encoding:'base64'
}));
const body=JSON.stringify({
  name:'casa-house-designer',
  files,
  target:'production',
  projectSettings:{ framework:null, buildCommand:null, outputDirectory:null, installCommand:null }
});
const req=https.request('https://api.vercel.com/v13/deployments',{
  method:'POST',
  headers:{'Authorization':'Bearer '+TOKEN,'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)}
},res=>{
  let d='';res.on('data',c=>d+=c).on('end',()=>{
    try{const j=JSON.parse(d);
      if(j.error){console.log('ERROR',res.statusCode,JSON.stringify(j.error));return;}
      console.log('STATUS',res.statusCode);
      console.log('URL https://'+j.url);
      console.log('ALIAS', (j.alias||[]).map(a=>'https://'+a).join(' ')||'(none yet)');
      console.log('READY_STATE', j.readyState||j.status);
      console.log('INSPECTOR', j.inspectorUrl||'');
    }catch(e){console.log('RAW',res.statusCode,d.slice(0,800));}
  });
});
req.on('error',e=>console.log('REQERR',e.message));
req.write(body);req.end();
