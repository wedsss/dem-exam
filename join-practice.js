const joinExercises = {
  join: [
    {
      title: 'Подпиши каждый заказ именем клиента',
      task: 'Выведи OrderID и CustomerName. Начни с CustomerOrders o и присоедини Customers c. Одна строка результата соответствует одному заказу.',
      query: 'SELECT o.OrderID, c.CustomerName\nFROM dbo.CustomerOrders o\nINNER JOIN dbo.Customers c ON o.CustomerID = c.CustomerID;',
      hint: 'Номер клиента записан в обеих таблицах. Сравни эти два номера после ON.',
      result: '101 | Анна\n102 | Олег\n103 | Анна'
    },
    {
      title: 'Найди крупные заказы',
      task: 'Покажи CustomerName и TotalAmount для заказов на сумму от 500 рублей включительно. Начни с CustomerOrders o, добавь Customers c и поставь условие после соединения.',
      query: 'SELECT c.CustomerName, o.TotalAmount\nFROM dbo.CustomerOrders o\nINNER JOIN dbo.Customers c ON o.CustomerID = c.CustomerID\nWHERE o.TotalAmount >= 500;',
      hint: 'ON связывает заказ с клиентом. WHERE проверяет сумму каждого заказа. Заказ ровно на 500 тоже подходит.',
      result: 'Анна | 500\nОлег | 700'
    },
    {
      title: 'Собери отчёт по покупателям',
      task: 'Выведи CustomerID, CustomerName и сумму всех заказов каждого покупателя под именем OrderSum. Начни с Customers c, присоедини CustomerOrders o. Сгруппируй по номеру и имени клиента в этом порядке.',
      query: 'SELECT c.CustomerID, c.CustomerName, SUM(o.TotalAmount) AS OrderSum\nFROM dbo.Customers c\nINNER JOIN dbo.CustomerOrders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID, c.CustomerName;',
      hint: 'Сначала получи пары «клиент — заказ». Затем сложи суммы внутри группы клиента через SUM.',
      result: '7 | Анна | 700\n4 | Олег | 700'
    }
  ],
  left: [
    {
      title: 'Покажи всех клиентов',
      task: 'Выведи CustomerName и OrderID. Сохрани в списке даже клиента, который ещё ничего не заказал. Используй Customers c и CustomerOrders o.',
      query: 'SELECT c.CustomerName, o.OrderID\nFROM dbo.Customers c\nLEFT JOIN dbo.CustomerOrders o ON c.CustomerID = o.CustomerID;',
      hint: 'После FROM поставь таблицу, строки которой нужно сохранить целиком. Для Веры в столбце заказа получится NULL.',
      result: 'Анна | 101\nАнна | 103\nОлег | 102\nВера | NULL'
    },
    {
      title: 'Найди клиентов без заказов',
      task: 'Выведи только CustomerName клиентов без заказов. Используй Customers c, CustomerOrders o и проверку номера заказа после соединения.',
      query: 'SELECT c.CustomerName\nFROM dbo.Customers c\nLEFT JOIN dbo.CustomerOrders o ON c.CustomerID = o.CustomerID\nWHERE o.OrderID IS NULL;',
      hint: 'У строки без пары справа номер заказа равен NULL. Для проверки используй IS NULL.',
      result: 'Вера'
    },
    {
      title: 'Посчитай заказы, включая ноль',
      task: 'Выведи CustomerID и число заказов под именем OrdersCount для каждого клиента. Используй Customers c и CustomerOrders o. У Веры в отчёте должен стоять 0.',
      query: 'SELECT c.CustomerID, COUNT(o.OrderID) AS OrdersCount\nFROM dbo.Customers c\nLEFT JOIN dbo.CustomerOrders o ON c.CustomerID = o.CustomerID\nGROUP BY c.CustomerID;',
      hint: 'COUNT(*) учтёт сохранённую строку Веры. Какой столбец справа заполнен только у настоящего заказа?',
      result: '7 | 2\n4 | 1\n9 | 0'
    }
  ]
};

function joinPracticePanel(topic) {
  const drafts = sqlProgress.joinDrafts || {};
  const exercises = joinExercises[topic].map((ex, i) => {
    const key = topic + i;
    return `<article><h3>${i + 1}. ${esc(ex.title)}</h3><p>${esc(ex.task)}</p>
      <label for="join-${key}">Твой запрос</label>
      <textarea id="join-${key}" data-language="sql" spellcheck="false" oninput="saveJoinDraft('${key}', this.value)">${esc(drafts[key] || '')}</textarea>
      <button onclick="checkJoinExercise('${topic}', ${i})">Проверить запрос</button>
      <p id="check-${key}" role="status"></p>
      <details><summary>Подсказка</summary><p>${esc(ex.hint)}</p></details>
      <details><summary>Сверить результат и решение</summary><pre class="result">${esc(ex.result)}</pre><p>Строки могут идти в другом порядке.</p><pre data-language="sql">${esc(ex.query)}</pre></details></article>`;
  }).join('');
  return `<section class="panel"><h2>5. Самостоятельная практика</h2><p>Во всех трёх задачах используй эти учебные строки. Таблицы названы как в EnterpriseDB. Буквы c и o — короткие имена таблиц в запросе.</p>
    <h3>dbo.Customers · клиенты</h3><pre class="result">CustomerID   CustomerName
7            Анна
4            Олег
9            Вера</pre>
    <h3>dbo.CustomerOrders · заказы</h3><pre class="result">OrderID   CustomerID   TotalAmount
101       7            500
102       4            700
103       7            200</pre>
    <p>Для проверки по образцу используй порядок столбцов и имена из условия.</p>${exercises}</section>`;
}
function saveJoinDraft(key, value) {
  sqlProgress.joinDrafts ||= {};
  sqlProgress.joinDrafts[key] = value;
  document.getElementById('check-' + key).textContent = '';
  saveSql();
}
function joinPattern(sql) {
  return sqlTokens(sql).join(' ')
    .replace(/\binner join\b/g, 'join').replace(/\bleft outer join\b/g, 'left join')
    .replace(/\bdbo \. /g, '').replace(/\bas /g, '')
    .replace(/\bo \. customerid = c \. customerid\b/g, 'c . customerid = o . customerid');
}
function checkJoinExercise(topic, i) {
  const key = topic + i;
  const ex = joinExercises[topic][i];
  const sql = document.getElementById('join-' + key).value;
  let feedback;
  if (joinPattern(sql) === joinPattern(ex.query)) feedback = 'Верно. На этих данных получится:\n' + ex.result;
  else if (!sql.trim()) feedback = 'Начни с SELECT и перечисли столбцы, которые нужно увидеть в результате.';
  else if (topic === 'left' && !/\bleft\s+(outer\s+)?join\b/i.test(sql)) feedback = 'Нужно сохранить Веру, даже когда справа нет заказа. Добавь LEFT JOIN после таблицы клиентов.';
  else if (!/\bon\b/i.test(sql)) feedback = 'Укажи после ON, по каким столбцам заказ связан с клиентом.';
  else feedback = 'Запись отличается от учебного образца. ' + ex.hint + ' Сверь также список столбцов и короткие имена таблиц. Другую форму запроса можно проверить в SSMS.';
  const message = document.getElementById('check-' + key);
  message.style.whiteSpace = 'pre-line';
  message.textContent = feedback;
}
