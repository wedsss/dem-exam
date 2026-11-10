const queryTasks = [
 ['Список заказов','Выведи номера всех заказов и их суммы, в таком порядке.','Какой столбец обозначает сам заказ?','Возьми OrderID и TotalAmount из CustomerOrders.','SELECT OrderID, TotalAmount FROM dbo.CustomerOrders'],
 ['Заказы от 500 рублей','Покажи номера заказов на сумму от 500 рублей включительно.','Попадёт ли в список заказ ровно на 500?','Проверь TotalAmount в WHERE.','SELECT OrderID FROM dbo.CustomerOrders WHERE TotalAmount >= 500'],
 ['Самые дорогие сверху','Покажи номер и сумму каждого заказа от большей суммы к меньшей. При равной сумме первым поставь меньший номер.','Какой столбец задаёт основной порядок?','В ORDER BY можно указать два поля и направление для каждого.','SELECT OrderID, TotalAmount FROM dbo.CustomerOrders ORDER BY TotalAmount DESC, OrderID',true],
 ['Подписи для формы','Выведи номер каждого заказа и имя его клиента.','Где хранится имя, а где номер заказа?','Обе таблицы содержат CustomerID. Сравни эти поля в ON.','SELECT o.OrderID, c.CustomerName FROM dbo.CustomerOrders o JOIN dbo.Customers c ON o.CustomerID=c.CustomerID'],
 ['Покупатели из Калуги','Выведи имена клиентов из Калуги ровно по одному разу для каждого клиента, даже если у него несколько заказов. Включи клиентов без покупок.','Нужны ли вообще строки заказов?','Город уже хранится в Customers. Строковые значения пишут в одинарных кавычках.',"SELECT CustomerName FROM dbo.Customers WHERE City='Калуга'"],
 ['Заказов у каждого клиента','Выведи имя и число заказов каждого клиента. У клиента без покупок должно стоять 0. Группируй по клиенту, даже если имена совпадут.','Что должно получиться у Веры?','Начни с Customers. После LEFT JOIN считай заполненные OrderID.','SELECT c.CustomerName, COUNT(o.OrderID) FROM dbo.Customers c LEFT JOIN dbo.CustomerOrders o ON c.CustomerID=o.CustomerID GROUP BY c.CustomerID,c.CustomerName'],
 ['Кому ещё не отгружали','Выведи номера клиентов без единого заказа.','У какого клиента справа отсутствует пара?','После LEFT JOIN проверь o.OrderID IS NULL.','SELECT c.CustomerID FROM dbo.Customers c LEFT JOIN dbo.CustomerOrders o ON c.CustomerID=o.CustomerID WHERE o.OrderID IS NULL'],
 ['Повторные покупки','Выведи номер клиента и число его заказов только для клиентов с двумя заказами или больше.','Когда становится известно число заказов клиента?','Сгруппируй по CustomerID и проверь число строк в HAVING.','SELECT CustomerID, COUNT(*) FROM dbo.CustomerOrders GROUP BY CustomerID HAVING COUNT(*) >= 2'],
 ['Выручка по клиентам','Покажи номер каждого клиента и сумму его заказов. При отсутствии заказов выведи 0.','Что вернёт SUM, если у клиента нет ни одного значения?','Оберни SUM в COALESCE с заменой на 0.','SELECT c.CustomerID, COALESCE(SUM(o.TotalAmount),0) FROM dbo.Customers c LEFT JOIN dbo.CustomerOrders o ON c.CustomerID=o.CustomerID GROUP BY c.CustomerID'],
 ['Заказы за июнь','Для отчёта выведи номер клиента и сумму его заказов за июнь 2026 года. Включи только покупателей за этот месяц.','Должен ли заказ от 1 июля войти в отчёт?','Возьми даты от 2026-06-01 включительно до 2026-07-01 исключительно.',"SELECT CustomerID, SUM(TotalAmount) FROM dbo.CustomerOrders WHERE OrderDate >= '2026-06-01' AND OrderDate < '2026-07-01' GROUP BY CustomerID"]
];
const querySeed = `ATTACH ':memory:' AS dbo;
CREATE TABLE dbo.Customers(CustomerID INTEGER PRIMARY KEY, CustomerName TEXT, City TEXT);
CREATE TABLE dbo.CustomerOrders(OrderID INTEGER PRIMARY KEY, CustomerID INTEGER, TotalAmount INTEGER, OrderDate TEXT);
INSERT INTO dbo.Customers VALUES(7,'Анна','Калуга'),(4,'Олег','Тула'),(9,'Вера','Калуга');
INSERT INTO dbo.CustomerOrders VALUES(101,7,500,'2026-06-01'),(102,4,700,'2026-06-30'),(103,7,200,'2026-07-01');`;
const queryExtra = `INSERT INTO dbo.Customers VALUES (11,'Анна','Калуга');
INSERT INTO dbo.CustomerOrders VALUES (104,11,700,'2026-05-31'),(105,4,100,'2026-06-15');`;
function queryTable(result){
 if (!result.values.length) return '<p>0 строк</p>';
 return '<div style="overflow-x:auto"><table><thead><tr>'+result.columns.map(v=>'<th>'+esc(v)+'</th>').join('')+'</tr></thead><tbody>'+result.values.slice(0,50).map(row=>'<tr>'+row.map(v=>'<td>'+esc(String(v??'NULL'))+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
function queryLab(n=0){
 examMode=false;
 const [title,task,h1,h2,ref]=queryTasks[n];
 shell(`<h1>Из условия в код</h1><label>Задание <select onchange="queryLab(Number(this.value))">${queryTasks.map(([t],i)=>`<option value="${i}" ${i===n?'selected':''}>${i+1}. ${esc(t)}</option>`).join('')}</select></label>
 <section class="panel"><h2>${esc(title)}</h2><p>${esc(task)}</p><details open><summary>Учебные данные</summary><pre>dbo.Customers
CustomerID  CustomerName  City
7           Анна          Калуга
4           Олег          Тула
9           Вера          Калуга

dbo.CustomerOrders
OrderID  CustomerID  TotalAmount  OrderDate
101      7           500          2026-06-01
102      4           700          2026-06-30
103      7           200          2026-07-01</pre></details>
 <label for="query-input">Твой SELECT</label><textarea id="query-input" data-language="sql" oninput="sqlProgress.queryDrafts ||= {}; sqlProgress.queryDrafts[${n}]=this.value;saveSql()">${esc(sqlProgress.queryDrafts?.[n]||'')}</textarea>
 <button class="primary" onclick="runLab(${n})">Выполнить и проверить</button>
 <div id="query-result" role="status"></div><details><summary>С чего начать?</summary><p>${esc(h1)}</p><details><summary>Следующая подсказка</summary><p>${esc(h2)}</p></details></details><details><summary>Разобрать решение</summary><pre data-language="sql">${esc(ref)}</pre></details></section>
 <small>Запрос выполняется в SQLite прямо в браузере. Для дат используй формат ГГГГ-ММ-ДД. Здесь доступны SELECT и WITH. Итог сравнивается по значениям и порядку столбцов.</small>`);
}
function labWorker(){
 self.onmessage=async ({data})=>{
  try{
   const engine=await initSqlJs();
   const db=new engine.Database();
   function run(sql){
    const it=db.iterateStatements(sql);
    const first=it.next();
    if(first.done)throw Error('Введи запрос.');
    const st=first.value, columns=st.getColumnNames(), values=[];
    while(st.step()){values.push(st.get());if(values.length>500)throw Error('В результате больше 500 строк. Проверь соединение.');}
    if(!it.next().done)throw Error('Введи один запрос.');
    return {columns,values};
   }
   function compare(){
    const actual=run(data.sql),expected=run(data.ref);
    const rows=r=>{const a=r.values.map(v=>JSON.stringify(v));return JSON.stringify(data.sorted?a:a.sort());};
    return {actual,expected,ok:actual.columns.length===expected.columns.length && rows(actual)===rows(expected)};
   }
   db.exec(data.seed+'PRAGMA query_only=ON;');
   const first=compare();
   db.exec('PRAGMA query_only=OFF;'+data.extra+'PRAGMA query_only=ON;');
   const extraOk=first.ok && compare().ok;
   db.close();self.postMessage({...first,extraOk});
  }catch(e){self.postMessage({error:String(e.message||e)})}
 };
}
function runLab(n){
 const sql=document.getElementById('query-input').value.trim(), out=document.getElementById('query-result');
 if(!/^(select|with)\b/i.test(sql)){out.textContent='Начни с SELECT или WITH.';return;}
 if(out.worker)out.worker.terminate();
 const url=URL.createObjectURL(new Blob(['('+sqliteForPractice.toString()+')();('+labWorker.toString()+')();'],{type:'text/javascript'}));
 const worker=new Worker(url);URL.revokeObjectURL(url);out.worker=worker;out.textContent='Выполняется…';
 const timeout=setTimeout(()=>{worker.terminate();if(out.worker===worker)out.textContent='Запрос занял слишком много времени. Проверь условия соединения.';},12000);
 worker.onerror=()=>{clearTimeout(timeout);worker.terminate();out.textContent='Ошибка запуска SQLite. Обнови страницу и повтори.';};
 worker.onmessage=({data})=>{clearTimeout(timeout);worker.terminate();
 if(data.error){out.textContent='SQLite: '+data.error;return;}
 const verdict=data.extraOk?'Верно на обоих наборах данных.':data.ok?'На этих строках верно. Проверь случай с двумя клиентами по имени Анна, равными суммами и заказом в мае.':'Результат отличается. Сравни строки ниже.';
 out.innerHTML='<h3>Твой результат</h3>'+queryTable(data.actual)+'<p>'+verdict+'</p>'+(data.ok?'':'<h3>Ожидалось</h3>'+queryTable(data.expected));
 if(n===5 && !data.ok)out.innerHTML+='<p>После LEFT JOIN у Веры остаётся строка с NULL в OrderID. COUNT(*) считает и эту строку. COUNT(o.OrderID) пропускает NULL и возвращает 0.</p>';
 };
 worker.postMessage({sql,ref:queryTasks[n][4],sorted:!!queryTasks[n][5],seed:querySeed,extra:queryExtra});
}
if(location.hash==='#query-lab')queryLab();
