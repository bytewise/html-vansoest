import { PurgeCSS } from 'purgecss';
import fs from 'fs';
(async ()=>{
  const purgeCSSResults = await new PurgeCSS().purge({
    safelist: ['is-active','open','navbar-burger','nav-menu','menu-active','nav-menu-container','mobile-body-overly','header-scrolled','is-active'], 
    content: ['src/**/*.astro','src/**/*.js','public/**/*.html'],
    css: ['assets/css/main.css','assets/css/bootstrap.css']
  });
  purgeCSSResults.forEach(result=>{
    const out = 'public/assets/css/'+result.file.split('/').pop();
    fs.mkdirSync('public/assets/css',{recursive:true});
    fs.writeFileSync(out,result.css);
    console.log('Wrote',out);
  });
})();
