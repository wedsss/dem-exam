const memoryLessons = [
  {id:'columns',title:'Выбрать нужные столбцы',lang:'sql',why:'Представь результат как таблицу. После SELECT перечисли заголовки через запятую. После FROM укажи, где лежат строки.',piece:'FROM',
   pairs:[
     ['Из dbo.Books выведи название Title и цену Price в таком порядке.','SELECT Title, Price\nFROM dbo.Books;'],
     ['Для списка сотрудников выведи имя EmployeeName и отдел Department из dbo.Employees.','SELECT EmployeeName, Department\nFROM dbo.Employees;']]},
  {id:'where',title:'Отобрать строки по условию',lang:'sql',why:'Прочитай условие для одной строки. При цене 500 книга за 500 подходит под «от 500», поэтому знак включает равенство.',piece:'>=',
   pairs:[
     ['Выведи Title из dbo.Books для книг с Price от 500 включительно.','SELECT Title FROM dbo.Books\nWHERE Price >= 500;'],
     ['Выведи ProductName из dbo.Products для товаров с остатком Stock не больше 4.','SELECT ProductName FROM dbo.Products\nWHERE Stock <= 4;']]},
  {id:'null',title:'Найти пропущенные значения',lang:'sql',why:'Если телефон ещё не внесли, в столбце может храниться NULL. Слова IS NULL проверяют именно отсутствие значения.',piece:'IS NULL',
   pairs:[
     ['Выведи ReaderName из dbo.Readers для читателей, у которых Phone содержит NULL.','SELECT ReaderName FROM dbo.Readers\nWHERE Phone IS NULL;'],
     ['Выведи OrderID из dbo.Orders для заказов, у которых дата отправки ShippedAt уже заполнена.','SELECT OrderID FROM dbo.Orders\nWHERE ShippedAt IS NOT NULL;']]},
  {id:'group',title:'Посчитать заказы каждого клиента',lang:'sql',why:'У заказов 101, 102, 103, 104 номера клиентов 7, 4, 7, 7. GROUP BY собирает строки одного клиента. COUNT(*) даёт для клиента 7 число 3. HAVING оставляет группы, которые прошли проверку.',piece:'COUNT(*)',
   pairs:[
     ['Из dbo.Orders выведи CustomerID и число заказов с заголовком OrdersCount. Оставь клиентов, у которых хотя бы два заказа.','SELECT CustomerID, COUNT(*) AS OrdersCount\nFROM dbo.Orders\nGROUP BY CustomerID\nHAVING COUNT(*) >= 2;'],
     ['В dbo.Enrollments одна строка означает одну запись на курс. Выведи CourseID и число записей под именем StudentCount для курсов, где записей хотя бы три.','SELECT CourseID, COUNT(*) AS StudentCount\nFROM dbo.Enrollments\nGROUP BY CourseID\nHAVING COUNT(*) >= 3;']]},
  {id:'cs-type',title:'Объявить переменную',lang:'cs',why:'Читай строку слева направо: тип, имя, начальное значение. int хранит целое число. Точка с запятой завершает команду.',piece:'int',
   pairs:[
     ['Заведи целочисленный счётчик count и начни с нуля.','int count = 0;'],
     ['Объяви целую переменную remaining и запиши в неё 12.','int remaining = 12;']]},
  {id:'cs-grid',title:'Показать данные в таблице формы',lang:'cs',why:'Слева от знака = стоит свойство элемента формы, справа — данные для показа. Fill заполняет таблицу, затем DataSource связывает её представление с сеткой.',piece:'DataSource',
   pairs:[
     ['Адаптер adapter и таблица table уже созданы. Заполни table и покажи её DefaultView в ordersGrid.','adapter.Fill(table);\nordersGrid.DataSource = table.DefaultView;'],
     ['Через booksAdapter заполни booksTable. Покажи её DefaultView в каталоге booksGrid.','booksAdapter.Fill(booksTable);\nbooksGrid.DataSource = booksTable.DefaultView;']]},
  {id:'cs-sort',title:'Отсортировать строки на форме',lang:'cs',why:'Свойству Sort передают строку с именем столбца и направлением. DESC ставит большие числа первыми. ASC — маленькие первыми.',piece:'Sort',
   pairs:[
     ['Отсортируй ordersView по TotalAmount от большей суммы к меньшей.','ordersView.Sort = "TotalAmount DESC";'],
     ['В productsView расположи товары по Price от дешёвых к дорогим. Укажи направление явно.','productsView.Sort = "Price ASC";']]},
  {id:'cs-cell',title:'Подсветить найденную ячейку',lang:'cs',why:'У ячейки есть стиль Style. Его свойство BackColor задаёт цвет фона. Справа от = выбери цвет из Color.',piece:'BackColor',
   pairs:[
     ['Задай золотой фон ячейке cell через Color.Gold.','cell.Style.BackColor = Color.Gold;'],
     ['В другой форме найденная ячейка называется match. Установи ей светло-зелёный фон через Color.LightGreen.','match.Style.BackColor = Color.LightGreen;']]}
];
function memoryRecords() {
  return sqlProgress.memory || (sqlProgress.memory = {});
}
function memoryHub() {
  examMode = false;
  const records = memoryRecords();
  const cards = memoryLessons.map(unit => {
    const r = records[unit.id];
    const due = r?.due && r.due <= Date.now();
    const status = r?.due ? (due ? 'Пора повторить' : 'Повторить ' + new Date(r.due).toLocaleDateString('ru-RU')) : r ? 'Начато' : '';
    return '<article class="card"><small>'+ (unit.lang==='sql'?'SQL':'C#') +' · '+status+'</small><h3>'+unit.title+'</h3><button onclick="memoryOpen(\''+unit.id+'\')">'+(due?'Повторить по памяти':r?.stage?'Продолжить':'Открыть урок')+'</button></article>';
  });
  shell('<button onclick="home()">← Мой маршрут</button><h1>Код по памяти</h1><p>Начни с одной темы. Разбери пример, восстанови пропуск, затем закрой образец и реши две задачи. После прохождения вернись через день.</p><div class="cards">'+cards.join('')+'</div>');
}
let activeMemory;
function memoryOpen(id) {
  const unit = memoryLessons.find(x=>x.id===id);
  let r = memoryRecords()[id];
  if (!r) r = memoryRecords()[id] = {stage:0, round:0};
  if (r.stage===4) {r.stage=2; r.swap=!r.swap; r.draft='';}
  activeMemory = id;
  saveSql();
  memoryRender();
}
function memoryRender() {
  const u = memoryLessons.find(x=>x.id===activeMemory), r=memoryRecords()[u.id];
  const stage=r.stage;
  const pair=u.pairs[stage===3 ? (r.swap?0:1) : stage===2 && r.swap ? 1 : 0];
  const code=stage===1?pair[1].replace(u.piece,'____'):pair[1];
  const heading=['Разбери образец','Восстанови пропуск','Напиши с чистого листа','Реши на других данных'][stage];
  shell('<button onclick="memoryHub()">← Код по памяти</button><h1>'+u.title+'</h1><section class="panel"><small>Шаг '+(stage+1)+' из 4</small><h2>'+heading+'</h2><p>'+esc(pair[0])+'</p>'+
    (stage<2?'<pre data-language="'+u.lang+'">'+esc(code)+'</pre>':'')+
    (stage===0?'<p>'+esc(u.why)+'</p><button class="primary" onclick="memoryAdvance()">Скрыть образец и попробовать</button>':
    '<label for="memoryInput">'+(stage===1?'Введи только пропущенную часть':'Набери весь код самостоятельно')+'</label><textarea id="memoryInput" spellcheck="false" data-language="'+u.lang+'">'+esc(r.draft||'')+'</textarea><button class="primary" id="memoryCheck">Проверить</button> <button id="memoryHint">Подсказка</button><p id="memoryMessage" role="status"></p>')+'</section>');
  if(!stage)return;
  const field=document.getElementById('memoryInput'), message=document.getElementById('memoryMessage');
  field.oninput=()=>{r.draft=field.value;saveSql();message.textContent='';};
  document.getElementById('memoryHint').onclick=()=>{message.textContent=u.why;};
  document.getElementById('memoryCheck').onclick=()=>{
    const expected=stage===1?u.piece:pair[1];
    const tokens=s=>u.lang==='sql'?sqlTokens(s):s.match(/"(?:\\.|[^"\\])*"|[\w]+|==|>=|<=|\S/g)||[];
    const actual=tokens(field.value), wanted=tokens(expected);
    if(JSON.stringify(actual)===JSON.stringify(wanted)){
      message.textContent='Верно. ';
      const next=document.createElement('button');next.textContent=stage===3?'Завершить урок':'Следующий шаг';next.onclick=memoryAdvance;message.append(next);
    } else {
      let hint='';
      if(!field.value.trim()) hint='Попробуй написать хотя бы первую часть.';
      else if(u.id==='group' && /having\s*\(/i.test(field.value)) hint='После HAVING нужно указать, что сравниваем с числом. Заказы внутри группы считает COUNT(*).';
      else if(u.id==='group' && /select\s+\w+\s*,\s*(orderscount|studentcount)/i.test(field.value)) hint='Ты указала заголовок. Сначала посчитай строки через COUNT(*), затем дай числу имя через AS.';
      else {const i=wanted.findIndex((t,i)=>t!==actual[i]);hint=i<0?'После ответа осталась лишняя часть.':i===0?'Проверь начало. В учебном образце здесь '+wanted[0]+'.':'Проверь место после «'+wanted.slice(Math.max(0,i-3),i).join(' ')+'». Ожидается «'+wanted[i]+'».';}
      message.textContent=hint+' Исправь ответ и проверь ещё раз.';
    }
  };
}
function memoryAdvance(){
  const r=memoryRecords()[activeMemory];
  r.stage++;r.draft='';
  if(r.stage<4){saveSql();memoryRender();return;}
  if(!r.due||Date.now()>=r.due){r.due=Date.now()+[1,3,7][Math.min(r.round||0,2)]*86400000;r.round=(r.round||0)+1;}
  saveSql();
  shell('<h1>Урок пройден</h1><p>Ты написала код по условию и применила его в другой задаче. Следующее повторение — '+new Date(r.due).toLocaleDateString('ru-RU')+'. Оно начнётся с пустого редактора.</p><button class="primary" onclick="memoryHub()">К урокам на запоминание</button>');
}
if(location.hash==='#memory') memoryHub();

if(location.hash==='#exam') examHub();
