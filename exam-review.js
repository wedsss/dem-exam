/* Local, transparent review of submitted evidence. Never executes user SQL/C#. */
const reviewTests=[
 {id:'access',task:0,label:'user1 читает BD1, но не может читать таблицы BD2',why:'Проверка под sa не показывает ограничения обычного пользователя.',fix:'Войди как user1 в отдельном соединении. Проверь USER в BD1 и роли; убери лишние серверные права.',retry:'SELECT из разрешённой таблицы BD1 должен пройти; из BD2 — завершиться отказом.',lesson:'access'},
 {id:'accounts',task:0,label:'Созданы все 10 пар пользователей/баз, пароли имеют 5 букв/цифр',why:'Ошибка границы цикла или генерации может пропустить пользователя и дать пароль неверного состава.',fix:'Проверь начальное значение, <= 10, увеличение счётчика, длину каждого пароля и соответствие userN → BDN.',retry:'Проверь 10 строк Users, 10 логинов и 10 баз; повтори вход под несколькими пользователями.',lesson:'parameter'},
 {id:'decrypt',task:1,label:'Каждый расшифрованный пароль совпал с исходным',why:'Шифротекст сам по себе не доказывает возможность восстановления значения.',fix:'Проверь ключ, сертификат, открытие ключа в текущем сеансе и преобразование результата в нужный строковый тип.',retry:'В учебной базе сравни исходное и расшифрованное значения для всех строк до удаления открытого текста.',lesson:'backup'},
 {id:'restore',task:2,label:'Копия восстановилась в отдельную учебную базу и данные доступны',why:'VERIFYONLY не проверяет все действия восстановления и не заменяет проверку данных.',fix:'Проверь доступ службы к пути, логические имена файлов и MOVE при необходимости. Восстанавливай в отдельную базу.',retry:'Открой восстановленную базу, прочитай Users и проверь расшифровку.',lesson:'backup'},
 {id:'fk',task:3,label:'База отвергает дочернюю строку с несуществующим родителем',why:'Без внешнего ключа возникают строки, которые не связаны с существующим объектом.',fix:'Добавь FK к правильному PK и согласуй типы. Сначала вставляй родительские строки.',retry:'В транзакции попробуй вставить позицию несуществующего заказа: ожидается отказ, затем откат.',lesson:'create'},
 {id:'normal',task:3,label:'Схема в 3НФ, в каждой таблице минимум три тестовые строки',why:'Повторение справочных свойств в документах создаёт зависимости и ошибки обновления.',fix:'Опиши смысл строки каждой таблицы, проверь зависимости от полного ключа и через другие свойства. Дополни тестовые данные.',retry:'Пройди каждую таблицу: PK/FK, зависимости, COUNT(*), минимум три строки.',lesson:'normal'},
 {id:'batch',task:4,label:'Триггер правильно обработал несколько позиций одной SQL-командой',why:'inserted/deleted содержат набор строк. Скалярный выбор одного ключа может пропустить другие заказы.',fix:'Сформируй множество ключей из inserted UNION deleted и пересчитай каждый заказ наборной операцией.',retry:'Вставь одной командой позиции двух заказов, измени их количества и удали последнюю позицию одного заказа.',lesson:'trigger'},
 {id:'report',task:4,label:'Отчёт за период совпал с ручным расчётом числа заказов, количества и суммы',why:'JOIN с позициями размножает строки заказа и может повторить его сумму.',fix:'Отдельно агрегируй позиции до одной строки на заказ, затем группируй заказы по клиентам.',retry:'Проверь два заказа с одинаковыми суммами и несколькими позициями; пустой и граничный периоды.',lesson:'debug'},
 {id:'archive',task:5,label:'Архив содержит только нужные ключи и месяц, позиции не потеряны',why:'Месяц без года и разные условия копирования/удаления могут перенести лишние строки или потерять данные.',fix:'Зафиксируй диапазон дат и единый набор ключей. Скопируй связанные строки и удали их в правильном порядке.',retry:'Сверь ID и суммы до/после: начало месяца, последний день, первый день следующего месяца и тот же месяц другого года.',lesson:'dates'},
 {id:'rollback',task:5,label:'При искусственной ошибке перенос полностью откатывается',why:'Раздельное копирование и удаление без транзакции оставляет базу в промежуточном состоянии.',fix:'Объедини перенос в транзакцию, добавь обработку ошибок и ROLLBACK. Не отключай внешние ключи.',retry:'В отдельной учебной копии вызови ошибку между копированием и удалением; исходные данные должны сохраниться.',lesson:'transaction'},
 {id:'filter',task:6,label:'Фильтр, сброс и оба направления сортировки работают; итоги соответствуют выборке',why:'Итоги по исходной таблице вместо текущего представления не соответствуют видимым строкам.',fix:'Фильтруй по ключу клиента, сортируй представление и пересчитывай число/сумму после каждого изменения выборки.',retry:'Клиент с несколькими заказами, без заказов, сброс фильтра; сверка числа строк и суммы вручную.',legacy:23},
 {id:'search',task:6,label:'Поиск подсвечивает совпавшие ячейки, а не скрывает строки',why:'Поиск по КИМу отличается от фильтра: должен меняться цвет ячеек, а не состав выборки.',fix:'Ищи по отображаемому тексту, очищай старую подсветку, окрашивай только совпавшие ячейки.',retry:'Найди имя, дату и сумму; затем отсутствующий и пустой текст. Количество видимых заказов не должно уменьшаться.',legacy:24},
 {id:'failure',task:6,label:'При неверном сервере программа показывает понятную ошибку и не закрывается',why:'Необработанное исключение прерывает работу; пустой catch скрывает причину.',fix:'Обработай исключение, покажи причину и действие для исправления, оставь возможность повторить подключение.',retry:'Укажи недоступный сервер в учебной конфигурации, проверь сообщение и повторную загрузку после исправления.',legacy:25},
 {id:'manual',task:7,label:'По руководству можно выполнить все функции; скриншоты соответствуют программе',why:'Общие описания без конкретных действий не позволяют повторить работу.',fix:'Для каждой функции укажи исходное состояние, действия, ожидаемый результат и реальный скриншот.',retry:'Пройди руководство с чистого запуска без дополнительных объяснений, включая исправление ошибки подключения.',legacy:26}
];
const reviewExpected={
 enterprise:{cost1:418.75,cost2:185,cost3:468.25,order1:5112.5,order2:9365,order3:45217.5,count:2,quantity:35,total:14477.5,remaining:1},
 furniture:{cost1:2130,cost2:3160,cost3:1705,order1:5965,order2:3160,order3:5115,count:2,quantity:4,total:9125,remaining:1},
 bakery:{cost1:183,cost2:261,cost3:180,order1:2352,order2:900,order3:783,count:2,quantity:17,total:3252,remaining:1},
 print:{cost1:25.5,cost2:105,cost3:11,order1:3600,order2:550,order3:2100,count:2,quantity:160,total:4150,remaining:1}
};
const reviewNumberFields=[
 ['cost1','Себестоимость изделия 1',4],['cost2','Себестоимость изделия 2',4],['cost3','Себестоимость изделия 3',4],
 ['order1','Сумма заказа 1',4],['order2','Сумма заказа 2',4],['order3','Сумма заказа 3',4],
 ['count','Заказов за архивный месяц до переноса',4],['quantity','Единиц продукции за этот месяц',4],['total','Общая сумма за этот месяц',4],['remaining','Заказов осталось после переноса',5]
];
function ensureReviewData(){if(!examState.submissions||typeof examState.submissions!=='object'||Array.isArray(examState.submissions))examState.submissions={};if(!examState.testResults||typeof examState.testResults!=='object'||Array.isArray(examState.testResults))examState.testResults={};if(!examState.numbers||typeof examState.numbers!=='object'||Array.isArray(examState.numbers))examState.numbers={};}
function reviewInputChanged(){examState.reviewStale=true;saveExam();}
function submissionText(i,v){ensureReviewData();examState.submissions[i]=String(v).slice(0,150000);reviewInputChanged();}
function reviewTestStatus(id,v){ensureReviewData();if(reviewTests.some(t=>t.id===id)&&['unknown','pass','fail'].includes(v)){examState.testResults[id]=v;reviewInputChanged();}}
function reviewNumber(key,v){ensureReviewData();examState.numbers[key]=v;reviewInputChanged();}
function reviewSubmission(i){
 ensureReviewData();
 return '<details class="review-input"><summary>Моё решение для разбора ошибок</summary><p>Вставь текст решения или загрузи .sql, .cs, .txt, .md (UTF-8, до 150 КБ). Несколько частей можно вставить в одно поле. Код остаётся в браузере и не выполняется. Пароли и строки подключения с секретами замени учебными значениями.</p><label for="solution-'+i+'">Код / текст задания '+(i+1)+'</label><textarea '+(i<7?'data-language="'+(i===6?'cs':'sql')+'" ':' ')+ 'id="solution-'+i+'" maxlength="150000" spellcheck="false" oninput="submissionText('+i+',this.value)">'+esc(examState.submissions[i]||'')+'</textarea><label>Загрузить текстовый файл <input type="file" accept=".sql,.cs,.txt,.md" onchange="loadSubmission('+i+',this)"></label><p id="file-status-'+i+'" role="status"></p><p>Загрузка заменит содержимое этого поля. Файлы .bak, .pdf и .sln проверяй в соответствующей программе; здесь отметь фактический результат теста.</p><h3>Результаты твоих проверок</h3>'+reviewTests.filter(t=>t.task===i).map(t=>'<label class="checkrow" for="test-'+t.id+'">'+esc(t.label)+'<br><select id="test-'+t.id+'" onchange="reviewTestStatus(\''+t.id+'\',this.value)">'+[['unknown','Не проверял(а)'],['pass','Проверил(а): работает'],['fail','Проверил(а): ошибка']].map(([v,l])=>'<option value="'+v+'" '+((examState.testResults[t.id]||'unknown')===v?'selected':'')+'>'+l+'</option>').join('')+'</select></label>').join('')+((i===4||i===5)?reviewNumericInputs(i):'')+'</details>';
}
async function loadSubmission(i,input){
 const status=document.getElementById('file-status-'+i),file=input.files?.[0];if(!file)return;
 if(!/\.(sql|cs|txt|md)$/i.test(file.name)||file.size>150000){status.textContent='Нужен текстовый файл .sql, .cs, .txt или .md размером до 150 КБ.';input.value='';return;}
 if(examState.submissions?.[i]&&!confirm('Заменить текст решения этого задания содержимым файла?')){input.value='';return;}
 const attempt=examState.started;
 try{const value=await file.text();if(examState.started!==attempt)return;if(value.includes('\u0000')||value.includes('\uFFFD'))throw Error();submissionText(i,value);document.getElementById('solution-'+i).value=value;document.getElementById('solution-'+i).refreshColours?.();status.textContent='Загружено: '+file.name+'. Разбор появится после завершения попытки.';}catch{status.textContent='Не удалось прочитать файл. Сохрани его в UTF-8 и повтори загрузку.';}
 input.value='';
}
function reviewNumericInputs(i){
 if(!reviewExpected[examState.variant])return '<p>У официального образца нет единого числового эталона для твоих собственных тестовых данных. Сверь расчёт вручную и укажи результат проверки выше.</p>';
 return '<h3>Фактические результаты твоей базы</h3><p>Для исходных данных выбранного варианта, без дополнительных заказов. Изделия идут в порядке спецификаций. Пустое поле означает «не проверено». Можно использовать точку или запятую.</p>'+reviewNumberFields.filter(f=>f[2]===i).map(([key,label])=>'<label class="checkrow" for="number-'+key+'">'+esc(label)+'<br><input id="number-'+key+'" type="text" inputmode="decimal" value="'+esc(examState.numbers[key]??'')+'" oninput="reviewNumber(\''+key+'\',this.value)"></label>').join('');
}
/* Mask comments and string literals, preserving character offsets for honest line references. */
function maskSource(source,csharp=false){
 let out='',i=0;
 function blank(s){return s.replace(/[^\n]/g,' ');}
 while(i<source.length){
  if(source.startsWith('/*',i)){let depth=1,j=i+2;while(j<source.length&&depth){if(source.startsWith('/*',j)&&!csharp){depth++;j+=2;}else if(source.startsWith('*/',j)){depth--;j+=2;}else j++;}out+=blank(source.slice(i,j));i=j;continue;}
  if(source.startsWith(csharp?'//':'--',i)){let end=source.indexOf('\n',i);if(end<0)end=source.length;out+=blank(source.slice(i,end));i=end;continue;}
  if(source[i]==="'"||(csharp&&source[i]==='"')){
   const quote=source[i],verbatim=csharp&&quote==='"'&&i>0&&source[i-1]==='@';let j=i+1;
   while(j<source.length){if(csharp&&!verbatim&&source[j]==='\\'){j+=2;continue;}if(source[j]===quote){if((!csharp||verbatim)&&source[j+1]===quote){j+=2;continue;}j++;break;}j++;}
   out+=blank(source.slice(i,j));i=j;continue;
  }
  out+=source[i++];
 }
 return out;
}
function numericValue(v){const s=String(v??'').trim().replace(/[ \u00a0\u202f]/g,'').replace(',','.');return /^[+-]?\d+(?:\.\d+)?$/.test(s)?Number(s):NaN;}
function collectReview(data){
 const findings=[],sub=data.submissions||{},statuses=data.testResults||{},nums=data.numbers||{};let compared=0,matched=0,testsPassed=0;
 const add=(task,kind,title,why,fix,retry,lesson,extra={})=>findings.push({task,kind,title,why,fix,retry,lesson,...extra});
 for(let task=0;task<8;task++){
  const text=String(sub[task]||'');
  if(!text.trim())add(task,'missing','Текст решения не приложен','Без кода нельзя проверить даже типовые проблемы записи. Отметки готовности не заменяют решение.','Добавь текст SQL/C# или руководства в поле этого задания.','Пересобери разбор после добавления текста.',null);
  const missing=(examOutputs[task]||[]).filter((_,k)=>!(data.checks||[]).includes(task+'-'+k));
  if(missing.length)add(task,'missing','Не подтверждены результаты задания',missing.join('; '),'Подготовь перечисленные результаты и проверь их перед отметкой.','Поставь отметки только после фактической проверки.',null);
  if(!text.trim()||task===7)continue;
  const source=maskSource(text,task===6);
  function rule(re,title,why,fix,retry,lesson){const hit=re.exec(source);if(hit)add(task,'risk',title,why,fix,retry,lesson,{line:source.slice(0,hit.index).split('\n').length});}
  if(task!==6){
   rule(/(?:<>|!=|(?<![<>!=])=)\s*NULL\b/i,'Сравнение с NULL обычным оператором','Такое сравнение не даёт TRUE для отсутствующего значения. Это типовая ошибка; уточни, что найденное место является условием, а не присваиванием.','В условии используй IS NULL или IS NOT NULL. Присваивание SET поле = NULL допустимо.','Проверь строку с NULL, известным значением и пустой строкой.','null');
   // Restrict the NULL warning to clauses used for predicates, avoiding valid SET x = NULL.
   const last=findings.at(-1);
   if(last?.task===task&&last?.title==='Сравнение с NULL обычным оператором'){
    const hit=/(?:<>|!=|(?<![<>!=])=)\s*NULL\b/i.exec(source),prefix=source.slice(Math.max(0,hit.index-250),hit.index);
    if(!/\b(?:WHERE|ON|WHEN|HAVING|IF|AND|OR)\b[^;]*$/i.test(prefix))findings.pop();
   }
   if(/\bMONTH\s*\(/i.test(source)&&!/\bYEAR\s*\(/i.test(source)&&!/(?:>=|<=|BETWEEN)/i.test(source))rule(/\bMONTH\s*\(/i,'Проверь ограничение года','В коде найден MONTH, но не найден явный год или диапазон. Это может выбрать одинаковый месяц разных лет.','Проверь полуоткрытый диапазон: дата >= начало месяца AND дата < начало следующего.','Добавь строку того же месяца другого года: она не должна попасть в архив.','dates');
   rule(/\bSUM\s*\(\s*DISTINCT\b/i,'SUM(DISTINCT ...) может потерять одинаковые суммы','Уникальность суммы не означает уникальность заказа. Два разных заказа по 500 должны дать 1000.','Если считаешь суммы заказов, агрегируй позиции отдельно и не дублируй заказы соединением.','Проверь два разных заказа с равной суммой и несколькими позициями.','debug');
   if(task===4)rule(/\bSELECT\s+@\w+\s*=[^;]*\bFROM\s+(?:dbo\.)?inserted\b/i,'Один ключ выбран из inserted в переменную','Если команда меняет несколько строк, скалярная переменная не представляет всё множество затронутых заказов.','Пересчитывай набор ключей из inserted UNION deleted.','Одной командой вставь позиции двух разных заказов и сверь оба итога.','trigger');
   if(task===1&&/\bHASHBYTES\s*\(/i.test(source)&&!/\b(?:DECRYPTBYKEY|DECRYPTBYPASSPHRASE|DECRYPTBYCERT|DECRYPTBYASYMKEY)\s*\(/i.test(source))rule(/\bHASHBYTES\s*\(/i,'Хеширование не даёт расшифровку','В тексте найден HASHBYTES, но не найдено обратимое расшифрование. Возможно, решение не выполняет требование задания 2.','Для задания требуется обратимое шифрование с защищённым ключом и отдельный вывод расшифрованных значений.','Сравни все расшифрованные значения с исходными в учебных данных.','backup');
  }else{
   rule(/\bcatch\s*(?:\([^)]*\))?\s*\{\s*\}/,'Пустой catch скрывает ошибку','Пользователь не узнает, почему операция не выполнена. Комментарий внутри catch не является обработкой.','Покажи понятное сообщение и оставь возможность повторить действие.','Укажи недоступный сервер и проверь сообщение и повторный запуск операции.',null);
  }
 }
 for(const t of reviewTests){
  if(statuses[t.id]==='fail')add(t.task,'failed',t.label,t.why,t.fix,t.retry,t.lesson||null,{legacy:t.legacy,source:'Результат твоего теста'});
  else if(statuses[t.id]==='pass')testsPassed++;
  else add(t.task,'missing','Не выполнен тест: '+t.label,'Работа этого сценария ещё не подтверждена.',t.fix,t.retry,t.lesson||null,{legacy:t.legacy});
 }
 const expected=reviewExpected[data.variant];
 if(expected)for(const [key,label,task] of reviewNumberFields){
  const value=nums[key];if(value===undefined||String(value).trim()===''){add(task,'missing','Нет результата: '+label,'Число не введено; сравнение не выполнялось.','Выполни расчёт на исходных данных выбранного варианта и введи число.','Пересобери разбор после ввода результата.',task===5?'transaction':'calc');continue;}
  const n=numericValue(value);
  if(!Number.isFinite(n)){add(task,'missing','Не удалось прочитать число: '+label,'Поле содержит текст или неверный формат.','Введи только число: например 2130 или 25,50, без «руб.».','Проверь поле и обнови разбор.',null);continue;}
  compared++;
  const tolerance=['count','quantity','remaining'].includes(key)?0:0.005;
  if(Math.abs(n-expected[key])<=tolerance){matched++;continue;}
  let why='Себестоимость = сумма норм материалов × цены + сумма норм времени × числа операций × тарифа.';
  if(key.startsWith('order'))why='Сумма заказа = сумма по позициям (количество изделий × себестоимость единицы).';
  if(['count','quantity','total'].includes(key))why='Отчёт должен считать заказы, единицы продукции и суммы раздельно, только за заданный месяц; JOIN не должен повторять сумму заказа.';
  if(key==='remaining')why='После переноса двух заказов архивного месяца должен остаться один заказ следующего месяца.';
  add(task,'mismatch',label,why,'Сверь промежуточные суммы и границы периода с документами варианта. Не меняй ответ только ради совпадения — найди расхождение в запросе.','Выполни запрос повторно на исходном наборе данных и обнови это поле.',task===5?'dates':'calc',{actual:n,expected:expected[key],source:'Сравнение с контрольными данными варианта'});
 }
 return {at:Date.now(),variant:data.variant,findings,compared,matched,testsPassed,testsTotal:reviewTests.length,codeTasks:Object.values(sub).filter(v=>String(v).trim()).length};
}
function reviewCard(f){
 const names={failed:'Ошибка по твоей проверке',mismatch:'Расхождение с эталоном',risk:'Требует проверки кода',missing:'Недостаточно данных'};
 const lessonButton=sqlCourse.some(u=>u.id===f.lesson)?'<button onclick="sqlLesson(\''+f.lesson+'\')">Повторить SQL-тему</button>':Number.isInteger(f.legacy)?'<button onclick="lesson('+f.legacy+')">Повторить C#-тему</button>':'';
 return '<article class="feedback '+(f.kind==='missing'?'review-missing':'')+'"><span class="badge">'+names[f.kind]+'</span><h3>'+esc(f.title)+'</h3>'+(f.line?'<p>Строка '+esc(f.line)+' в приложенном тексте. Проверь контекст этого места.</p>':'')+(f.actual!==undefined?'<p><b>Твой результат: '+esc(f.actual)+'. Ожидается: '+esc(f.expected)+'.</b></p>':'')+'<p><b>Почему:</b> '+esc(f.why)+'</p><p><b>Как исправить:</b> '+esc(f.fix)+'</p><p><b>Повторная проверка:</b> '+esc(f.retry)+'</p>'+lessonButton+'</article>';
}
function buildExamReview(){
 if(!examState.finished){renderAttempt();return;}
 ensureReviewData();const old=examState.review;
 if(old){examState.reviewHistory=(examState.reviewHistory||[]).concat([{at:old.at,issues:old.findings.filter(f=>f.kind!=='missing').length,missing:old.findings.filter(f=>f.kind==='missing').length,matched:old.matched}]).slice(-5);}
 examState.review=collectReview(examState);examState.reviewStale=false;saveExam();showExamReview();
}
function showExamReview(){
 if(!examState.finished){renderAttempt();return;}
 if(!examState.review){buildExamReview();return;}
 const r=examState.review,findings=r.findings,issues=findings.filter(f=>f.kind!=='missing'),missing=findings.filter(f=>f.kind==='missing'),s=scenarios.find(s=>s.id===r.variant)||scenarios[0];
 shell('<button onclick="examHub()">← Все варианты</button><span class="tag">Разбор твоей попытки</span><h1>Понять ошибку.<br>Исправить. Проверить снова.</h1><p>'+esc(s.title)+'</p><div class="panel"><p>Это локальный разбор по введённым числам, результатам твоих тестов и ограниченному набору правил чтения кода. Код не компилируется и не исполняется. Он не заменяет проверку преподавателем и не выставляет официальные баллы.</p><div class="row"><b>Проблем и замечаний: '+issues.length+'</b><span>Не подтверждено: '+missing.length+'</span><span>Числа совпали: '+r.matched+' / '+r.compared+'</span></div><p>Тестов отмечено успешными: '+r.testsPassed+' / '+r.testsTotal+' — по твоим отметкам. Текст решений приложен для '+r.codeTasks+' заданий.</p>'+(examState.reviewStale?'<p class="feedback">Решения или проверки изменены. Этот разбор устарел — нажми «Обновить разбор».</p>':'')+'<div class="row"><button class="primary" onclick="renderAttempt()">Исправить решения и проверки</button><button onclick="buildExamReview()">Обновить разбор</button><button onclick="downloadExamReview()">Скачать разбор</button></div></div>'+(!r.codeTasks&&!r.compared&&!r.testsPassed?'<div class="feedback"><b>Пока мало данных для оценки.</b> Добавь решения в задания, выполни предложенные проверки и введи результаты. Отсутствие найденных ошибок не означает, что экзамен выполнен.</div>':'')+examTitles.map((title,i)=>{const list=findings.filter(f=>f.task===i);return '<section class="panel"><span class="badge">Задание '+(i+1)+'</span><h2>'+esc(title)+'</h2>'+(list.length?list.filter(f=>f.kind!=='missing').map(reviewCard).join('')+(list.some(f=>f.kind==='missing')?'<details><summary>Что ещё проверить: '+list.filter(f=>f.kind==='missing').length+'</summary>'+list.filter(f=>f.kind==='missing').map(reviewCard).join('')+'</details>':''):'<p>По предоставленным данным замечаний этих правил нет. Полнота и корректность реализации автоматически не подтверждены.</p>')+'</section>';}).join('')+'<div class="panel"><h2>План исправления</h2><ol><li>Начни с расхождений чисел и тестов, которые завершились ошибкой.</li><li>Проверь замечания к коду в указанном контексте.</li><li>Исправь решение в SSMS/Visual Studio и выполни повторный тест.</li><li>Замени текст решения и результаты в этой попытке, затем обнови разбор.</li></ol>'+(examState.reviewHistory?.length?'<p>Предыдущая проверка: '+examState.reviewHistory.at(-1).issues+' замечаний, '+examState.reviewHistory.at(-1).missing+' неподтверждённых пунктов. Уменьшение числа замечаний не гарантирует правильность программы.</p>':'')+'</div>');
 if(typeof window!=='undefined')window.scrollTo(0,0);
}
function downloadExamReview(){if(!examState.finished||!examState.review)return;downloadJson({format:'dem-exam-review-v1',stale:!!examState.reviewStale,variant:examState.variant,started:examState.started,finished:examState.finished,review:examState.review,history:examState.reviewHistory||[],notice:'Числовые сравнения и ограниченные правила; тесты отмечены пользователем. Не официальная оценка.'},'dem-error-review.json');}
const finishBeforeReview=finishAttempt;
finishAttempt=function(){if(!examState.finished)examState.finished=Date.now();saveExam();buildExamReview();};
const attemptBeforeReview=renderAttempt;
renderAttempt=function(){attemptBeforeReview();if(examState.finished)main.insertAdjacentHTML('afterbegin','<div class="panel"><h2>Попытка завершена — доступен разбор ошибок</h2><p>Измени код и результаты проверок в заданиях ниже, затем обнови разбор.</p><button class="primary" onclick="buildExamReview()">Обновить разбор ошибок</button><button onclick="showExamReview()">Открыть сохранённый разбор</button></div>');};
const hubBeforeReview=examHub;
examHub=function(){hubBeforeReview();if(examState.finished)main.insertAdjacentHTML('afterbegin','<div class="panel"><h2>Разбор последней попытки</h2><button class="primary" onclick="showExamReview()">Разобрать мои ошибки</button></div>');};
downloadExamReport=function(){ensureReviewData();downloadJson({...examState,notice:'Самопроверка, числовые сравнения и ограниченные правила. Текст решений включён в экспорт.'},'dem-attempt.json');};

