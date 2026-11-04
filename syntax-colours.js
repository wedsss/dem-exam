/* Offline lexical colouring; never executes submitted code. */
(function(){
 const set=s=>new Set(s.split(' '));
 const sql=set('SELECT FROM WHERE AS AND OR NOT NULL IS IN LIKE BETWEEN EXISTS JOIN INNER LEFT RIGHT FULL OUTER CROSS ON GROUP BY HAVING ORDER ASC DESC DISTINCT TOP WITH UNION ALL INSERT INTO VALUES UPDATE SET DELETE CREATE ALTER DROP TABLE DATABASE VIEW PROCEDURE PROC FUNCTION TRIGGER INDEX PRIMARY FOREIGN KEY REFERENCES CONSTRAINT UNIQUE CHECK DEFAULT EXEC EXECUTE DECLARE BEGIN END IF ELSE WHILE RETURN RETURNS CASE WHEN THEN TRY CATCH TRANSACTION TRAN COMMIT ROLLBACK GO USE PRINT BACKUP RESTORE TO DISK ADD FOR AFTER INSTEAD OF GRANT DENY REVOKE USER LOGIN PASSWORD CERTIFICATE SYMMETRIC OPEN CLOSE ENCRYPTION OUTPUT OVER PARTITION');
 const types=set('INT BIGINT SMALLINT TINYINT BIT DECIMAL NUMERIC FLOAT REAL MONEY VARCHAR NVARCHAR CHAR NCHAR TEXT DATE DATETIME DATETIME2 TIME VARBINARY BINARY UNIQUEIDENTIFIER');
 const cs=set('int string bool double decimal float long short byte char object uint ulong using namespace class public private protected internal static void new return if else for foreach while do switch case break continue try catch finally throw null true false this base get set value var const readonly async await in out ref is as typeof nameof override virtual abstract sealed interface enum struct partial event delegate params lock yield default');
 const ct=set('int string bool double decimal float long short byte char object uint ulong DateTime String Int32 Exception SqlException Form DataTable DataView SqlConnection SqlCommand SqlDataAdapter MessageBox Color Convert Math');
 const fn=set('COUNT SUM AVG MIN MAX CAST CONVERT COALESCE ISNULL NULLIF GETDATE DATEADD DATEDIFF YEAR MONTH DAY ROUND CONCAT LEN SUBSTRING HASHBYTES ENCRYPTBYKEY DECRYPTBYKEY');
 function safe(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function colour(source,lang){
  let out='',i=0;const s=lang==='sql';
  const emit=(end,kind)=>{const t=safe(source.slice(i,end));out+=kind?'<span class="tok-'+kind+'">'+t+'</span>':t;i=end;};
  while(i<source.length){
   if(source.startsWith(s?'--':'//',i)){let e=source.indexOf('\n',i);emit(e<0?source.length:e,'comment');continue;}
   if(source.startsWith('/*',i)){let e=i+2,d=1;while(e<source.length&&d){if(s&&source.startsWith('/*',e)){d++;e+=2;}else if(source.startsWith('*/',e)){d--;e+=2;}else e++;}emit(e,'comment');continue;}
   const rest=source.slice(i),p=s?/^(?:N)?'/i.exec(rest):/^(?:\$@|@\$|@|\$)?"|^'/.exec(rest);
   if(p){let e=i+p[0].length,q=source[e-1],v=p[0].includes('@');while(e<source.length){if(!s&&!v&&source[e]==='\\'){e+=2;continue;}if(source[e]===q){if((s||v)&&source[e+1]===q){e+=2;continue;}e++;break;}e++;}emit(Math.min(e,source.length),'string');continue;}
   if(s&&(source[i]==='['||source[i]==='"')){let q=source[i]==='['?']':'"',e=i+1;while(e<source.length){if(source[e]===q){if(source[e+1]===q){e+=2;continue;}e++;break;}e++;}emit(e,null);continue;}
   const n=/^(?:0x[\da-f]+|\d+(?:\.\d*)?(?:e[+-]?\d+)?[mfdul]*)/i.exec(rest);
   if(n){emit(i+n[0].length,'number');continue;}
   const w=/^(?:@@?|#)?[\p{L}_][\p{L}\p{N}_]*/u.exec(rest);
   if(w){const key=s?w[0].toUpperCase():w[0];let k=null;if((s?sql:cs).has(key))k='keyword';else if((s?types:ct).has(key))k='type';else if(s&&fn.has(key))k='function';else if(s&&key.startsWith('@'))k='variable';else if(!s&&/^\s*\(/.test(source.slice(i+w[0].length)))k='function';emit(i+w[0].length,k);continue;}
   emit(i+1,null);
  }return out;
 }
 window.highlightTrainingCode=colour;
 function enhance(a){
  if(a.closest('.code-editor'))return;
  const lang=a.dataset.language,b=document.createElement('div'),bar=document.createElement('div'),p=document.createElement('pre'),toggle=document.createElement('button');
  b.className='code-editor language-'+lang;bar.className='code-legend language-'+lang;bar.innerHTML='<b>'+(lang==='sql'?'SQL · стиль SSMS':'C# · стиль Visual Studio')+'</b> <span class="tok-keyword">команды</span> <span class="tok-type">типы</span> <span class="tok-string">строки</span> <span class="tok-comment">комментарии</span> <span class="tok-number">числа</span>';
  toggle.type='button';toggle.textContent='Выключить цвета';toggle.setAttribute('aria-pressed','true');bar.append(toggle);a.before(bar,b);b.append(p,a);p.className='code-paint';p.setAttribute('aria-hidden','true');a.wrap='off';a.autocapitalize='off';a.autocomplete='off';
  const scroll=()=>{p.scrollTop=a.scrollTop;p.scrollLeft=a.scrollLeft;};
  const sync=()=>{p.innerHTML=colour(a.value,lang)+'\n';scroll();};
  a.refreshColours=sync;a.addEventListener('input',sync);a.addEventListener('scroll',scroll);
  toggle.addEventListener('click',()=>{const off=b.classList.toggle('colours-off');toggle.textContent=off?'Включить цвета':'Выключить цвета';toggle.setAttribute('aria-pressed',String(!off));});sync();
 }
 function scan(){document.querySelectorAll('textarea[data-language]').forEach(enhance);document.querySelectorAll('pre[data-language]:not([data-coloured])').forEach(p=>{p.dataset.coloured='true';p.classList.add('code-example','language-'+p.dataset.language);p.innerHTML=colour(p.textContent,p.dataset.language);});}
 new MutationObserver(scan).observe(document.querySelector('main'),{childList:true,subtree:true});scan();
})();
