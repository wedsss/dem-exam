const designPractice = {
  design: [
    ['Найди владельца данных', 'В документе указаны название изделия и количество штук в заказе. Введи названия двух таблиц через запятую: сначала где хранится название, затем где хранится количество.', 'Products, OrderItems', 'Изделие можно назвать ещё до появления первого заказа. Количество появляется в позиции конкретного заказа.'],
    ['Проведи связь на диаграмме', 'У клиента может быть несколько заказов. Запиши связь в формате Таблица.Поле = Таблица.Поле. Слева укажи ключ Customers, справа — ссылку из CustomerOrders.', 'Customers.CustomerID = CustomerOrders.CustomerID', 'На стороне «много» повторяется номер клиента. Номер самого заказа уникален.'],
    ['Свяжи изделие с материалом', 'Корпус содержит сталь и болты. Болты также используются в панели. Запиши два внешних ключа ProductMaterials и столбец нормы через запятую в порядке «изделие, материал, расход».', 'ProductID, MaterialID, Quantity', 'Одна строка состава описывает расход одного материала на одно изделие. Для второй пары понадобится ещё одна строка.']
  ],
  normal: [
    ['Раздели список в ячейке', 'Для заказа 15 записали изделия «2, 3» и количества «4, 1». Восстанови две строки позиции в формате (OrderID, ProductID, Quantity), сначала для изделия 2.', '(15, 2, 4), (15, 3, 1)', 'Номер заказа повторится. Для каждого изделия возьми соответствующее ему количество.'],
    ['Проверь зависимость от ключа', 'В ProductOperations ключ состоит из ProductID и OperationID. Выпиши два поля из списка PricePerHour, TimeNorm, Quantity, которые зависят от всей пары. Сохрани порядок списка.', 'TimeNorm, Quantity', 'Цена часа определена самой операцией. Норма времени и число операций задаются для конкретного изделия.'],
    ['Устрани повтор адреса', 'В заказах клиента 7 повторяется текущий Address из его карточки. Запиши через запятую таблицу, где хранить адрес, и поле заказа, по которому можно его получить.', 'Customers, CustomerID', 'Если клиент переедет, текущий адрес достаточно обновить в его карточке. В заказе останется ссылка на клиента.']
  ],
  create: [
    ['Запиши правило для цены', 'Для CREATE TABLE dbo.Materials напиши определение столбца PricePerUnit. Нужны decimal(10,2), обязательное значение и проверка цены от нуля включительно. Используй порядок «имя, тип, обязательность, проверка».', 'PricePerUnit decimal(10,2) NOT NULL CHECK (PricePerUnit >= 0)', 'Ноль допустим, отрицательная цена и NULL должны быть отклонены.'],
    ['Добавь внешний ключ', 'Таблица dbo.Customers уже создана. Напиши определение поля CustomerID для CustomerOrders: целый обязательный номер со ссылкой на CustomerID в dbo.Customers. Запиши REFERENCES в строке столбца.', 'CustomerID int NOT NULL REFERENCES dbo.Customers(CustomerID)', 'Если клиента 999 нет, вставка заказа с CustomerID = 999 должна завершиться ошибкой внешнего ключа.'],
    ['Создай таблицу состава', 'ProductionOrders и Products уже существуют в dbo. Напиши весь CREATE TABLE для dbo.ProductionItems. По порядку задай ProductionOrderID и ProductID (оба int NOT NULL со ссылками на одноимённые ключи в dbo), Quantity (int NOT NULL, больше нуля) и составной PRIMARY KEY из первых двух полей.', 'CREATE TABLE dbo.ProductionItems (\n  ProductionOrderID int NOT NULL REFERENCES dbo.ProductionOrders(ProductionOrderID),\n  ProductID int NOT NULL REFERENCES dbo.Products(ProductID),\n  Quantity int NOT NULL CHECK (Quantity > 0),\n  PRIMARY KEY (ProductionOrderID, ProductID)\n);', 'Проверь три правила: оба родителя существуют, количество положительное, одна и та же пара номеров встречается лишь раз.']
  ],
  write: [
    ['Заполни справочник', 'Одним INSERT INTO добавь три изделия в dbo.Products. Заполни только ProductName: Корпус, Панель, Крышка в этом порядке. Используй N перед каждой строкой.', "INSERT INTO dbo.Products (ProductName) VALUES (N'Корпус'), (N'Панель'), (N'Крышка');", 'После VALUES у каждой строки свои скобки. Можно пропустить ProductID и необязательное описание.'],
    ['Исправь норму расхода', 'Для изделия 1 увеличь норму материала 4 с 8 до 10. Напиши UPDATE dbo.ProductMaterials. Присвой Quantity значение 10. В WHERE укажи сначала ProductID, затем MaterialID.', 'UPDATE dbo.ProductMaterials SET Quantity = 10 WHERE ProductID = 1 AND MaterialID = 4;', 'Один болт используется в разных изделиях. Два условия через AND выбирают конкретную пару.'],
    ['Удали одну ошибочную позицию', 'В копии базы есть позиции OrderItemID 5 и 6 одного заказа. Позицию 6 ввели ошибочно. Напиши DELETE FROM для dbo.OrderItems так, чтобы позиция 5 и сам заказ сохранились.', 'DELETE FROM dbo.OrderItems WHERE OrderItemID = 6;', 'OrderID общий у нескольких строк. Собственный ключ позиции — OrderItemID. После удаления строка 5 остаётся.']
  ]
};

function designPracticePanel(topic) {
  const exercises = designPractice[topic].map(([title, task, answer, hint], i) => {
    const key = topic + i;
    const isSql = topic === 'create' || topic === 'write';
    return `<article><h3>${i+1}. ${esc(title)}</h3><p>${esc(task)}</p>
      <label for="design-${key}">${isSql ? 'Твой SQL' : 'Твой ответ'}</label>
      <textarea id="design-${key}" ${isSql ? 'data-language="sql"' : ''} spellcheck="false" oninput="saveDesignDraft('${key}', this.value)">${esc(sqlProgress.designDrafts?.[key] || '')}</textarea>
      <button onclick="checkDesignPractice('${topic}', ${i})">Проверить ответ</button>
      <p id="feedback-${key}" role="status"></p>
      <details><summary>Подсказка</summary><p>${esc(hint)}</p></details>
      <details><summary>Свериться с образцом</summary><pre ${isSql ? 'data-language="sql"' : ''}>${esc(answer)}</pre></details></article>`;
  }).join('');
  return '<section class="panel"><h2>5. Практика к заданию 4 ДЭ</h2><p>Пиши по условию, затем проверяй ответ. Проверка учитывает указанный формат и порядок полей. Другие варианты SQL можно выполнить в SSMS.</p>'+exercises+'</section>';
}
function saveDesignDraft(key, value) {
  sqlProgress.designDrafts ||= {};
  sqlProgress.designDrafts[key] = value;
  document.getElementById('feedback-' + key).textContent = '';
  saveSql();
}
function checkDesignPractice(topic, i) {
  const key = topic + i;
  const value = document.getElementById('design-' + key).value;
  const [, , answer, hint] = designPractice[topic][i];
  const feedback = document.getElementById('feedback-' + key);
  feedback.textContent = sameSql(value, answer) ? 'Верно. ' + hint :
    value.trim() ? 'Пока отличается от образца. ' + hint : 'Введи ответ по условию задания.';
}
if (location.hash === '#design-lessons') sqlLesson('design');
