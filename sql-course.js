const sqlModules=[['start','1. С нуля','Таблицы, значения и первый запуск'],['select','2. Запросы','От простого SELECT к условиям и вычислениям'],['report','3. Отчёты','Итоги, группы и связи'],['design','4. Своя база','Из текста задания в таблицы'],['exam','5. Модули SQL','Процедуры, триггеры и администрирование'],['transfer','6. Перенос навыков','Новая предметная область без готового ответа']];
const sqlCourse=[];
function unit(id,module,title,theory,example,lines,result,mistake,question,choices,correct,why,task,answer,hint,transfer){sqlCourse.push({id,module,title,theory,example,lines,result,mistake,question,choices,correct,why,task,answer,hint,transfer});}
unit('table','start','Таблица, строка и столбец',
['Представь список книг. Одна строка — одна книга, столбец — одно её свойство (номер, название, цена), значение — содержимое одной ячейки. Сначала всегда определяй, что означает одна строка.',
'SQL Server хранит данные и выполняет команды. SSMS — редактор, из которого отправляют команды серверу. SQL — язык этих команд; T-SQL — вариант для SQL Server.',
'SELECT читает данные. Результат тоже выглядит как таблица, но не меняет исходные записи. dbo — схема, то есть группа объектов внутри базы.'],
'SELECT Title\nFROM dbo.Books;',
['SELECT Title: какой столбец показать.','FROM dbo.Books: из какой таблицы взять строки.','; завершает инструкцию; перенос строки только улучшает чтение.'],
'Books: (1, Атлас, 500), (2, Сказки, 300).\nРезультат — столбец Title:\nАтлас\nСказки',
'Не пиши SELECT Books: имя таблицы ставится после FROM.',
'Четыре книги, три свойства каждой. Сколько строк данных?',['3','4','12'],1,'Каждая книга занимает одну строку.',
'Покажи все столбцы dbo.Books. Используй звёздочку.',
'SELECT * FROM dbo.Books;','Шаблон: SELECT что FROM откуда;',
'В поликлинике одна строка Patients — пациент, а одна строка Appointments — приём. Объясни разницу.');

unit('run','start','Первый запуск в SSMS',
['Подключись к учебному SQL Server, открой New Query («Создать запрос»). Имя сервера и имя базы — разные вещи. Базу выбирают в списке редактора или через USE.',
'F5 выполняет запрос. Если текст выделен, выполняется только выделенный фрагмент. Вкладка Results показывает строки, Messages — сообщения и ошибки.',
'SELECT может вычислять выражение без таблицы. GO разделяет пакеты в SSMS, но не является оператором T-SQL: в SqlCommand из C# GO передавать нельзя.'],
'SELECT 2 + 3 AS Result;',
['2 + 3 — выражение.','AS Result — имя столбца результата.','FROM не нужен: здесь нет таблицы.'],
'Result\n5',
'Invalid object name часто означает неверную базу или имя таблицы. Проверь SELECT DB_NAME(); и дерево объектов.',
'Что выполнится при F5, если выделена часть кода?',['Весь файл','Выделенный фрагмент','Ничего'],1,'SSMS выполняет выделение, если оно есть.',
'Вычисли 7 + 5 и назови столбец Result.',
'SELECT 7 + 5 AS Result;','SELECT выражение AS имя;',
'На чужом компьютере сначала проверь подключение и базу. Не запускай скрипт целиком, пока не понял каждый блок.');

unit('types','start','Текст, числа, даты, NULL',
['Числа пишутся без кавычек: 42, 19.50. Десятичный разделитель — точка. Текст пишется в одинарных кавычках; N перед строкой задаёт Unicode для русского текста.',
'int — целое, decimal(10,2) — точное десятичное число, nvarchar(100) — текст до 100 символов, date — дата. Для телефона выбирают текст: его не складывают и он может начинаться с +.',
'NULL — отсутствие известного значения. Это не ноль и не пустая строка. Пустая строка — известный текст длиной ноль.'],
"SELECT N'Москва' AS City, 19.50 AS Price;",
["N'Москва' — строковое значение.","19.50 — число.","Запятая разделяет столбцы результата."],
'City     Price\nМосква   19.50',
'19,50 будет восприниматься как два выражения. Апостроф внутри SQL-строки удваивают: N\'О\'\'Брайен\'.',
'Тип цены с копейками?',['int','decimal(10,2)','date'],1,'decimal хранит точные суммы с дробной частью.',
'Выведи Казань в столбце City как Unicode-строку.',
"SELECT N'Казань' AS City;","Используй N и одинарные кавычки.",
'Выбери тип для номера паспорта, числа мест и даты занятия. Объясни выбор без привязки к названиям столбцов.');

unit('columns','select','SELECT и псевдонимы',
['Сначала опиши требуемый результат словами: какие столбцы нужны? Затем перечисли их после SELECT через запятую.',
'FROM задаёт источник. Порядок столбцов в SELECT определяет их порядок в результате. * удобно для знакомства с таблицей, но явный список понятнее в приложении.',
'AS задаёт подпись в результате, не переименовывая исходный столбец. Заголовок с пробелами заключают в квадратные скобки.'],
'SELECT Title AS [Название книги], Price\nFROM dbo.Books;',
['Title — существующий столбец.','AS [Название книги] — подпись результата.','Price — второй столбец; перед ним запятая.'],
'Название книги   Price\nАтлас            500\nСказки           300',
'Перед FROM не должно быть лишней запятой.',
'AS меняет исходную структуру таблицы?',['Да','Нет','Удаляет столбец'],1,'Псевдоним существует только в результате запроса.',
'Выведи ProductName и Price из dbo.Products именно в таком порядке.',
'SELECT ProductName, Price FROM dbo.Products;','Запятая между столбцами, затем FROM.',
'В школьной базе вместо товара выбери ученика: сначала узнай реальные имена столбцов, потом составь запрос.');

unit('where','select','Условия WHERE',
['WHERE проверяет условие для каждой строки и оставляет строки, для которых оно истинно.',
'Операторы: = равно, <> не равно, > больше, < меньше, >= не меньше, <= не больше. «Не дешевле 500» означает >= 500, включая 500.',
'Порядок записи: SELECT, FROM, WHERE. Проверяй условие на значении ниже границы, точно на границе и выше неё.'],
'SELECT Title, Price FROM dbo.Books\nWHERE Price >= 500;',
['Указываем столбцы и таблицу.','Price >= 500 проверяет цену каждой книги.','Цена ровно 500 включается.'],
'Атлас 500 → да; Сказки 300 → нет; Словарь 900 → да.',
'Знаки > и >= дают разные результаты на границе.',
'Что пройдёт условие Price > 500?',['500 и 900','Только 900','300 и 500'],1,'Строгое сравнение исключает 500.',
'Покажи все dbo.Products с Price не больше 1000.',
'SELECT * FROM dbo.Products WHERE Price <= 1000;','«Не больше» — <=.',
'«Старше 18» и «от 18 лет» — разные границы. Переводи смысл, а не копируй знак из примера.');

unit('logic','select','AND, OR и скобки',
['AND требует выполнения обоих условий. OR достаточно одного. «В наличии и дешевле 500» — AND; «Москва или Казань» — OR.',
'AND выполняется раньше OR. Скобки явно объединяют варианты, чтобы ограничение цены относилось ко всем нужным категориям.',
'Проверь четыре случая: оба условия истинны, только первое, только второе, оба ложны. Так можно увидеть логическую ошибку до запуска.'],
"SELECT * FROM dbo.Products\nWHERE (Category = N'Книга' OR Category = N'Журнал')\nAND Price < 500;",
['Скобки объединяют допустимые категории.','Условие цены применяется к обеим категориям.','Другие категории не проходят даже при низкой цене.'],
'Книга 700 → нет; Книга 300 → да; Журнал 200 → да; Игрушка 100 → нет.',
'Price > 100 OR Price < 500 пропустит любое обычное число; диапазон требует AND.',
'AND означает:',['Хотя бы одно','Оба условия','Ни одного'],1,'Логическое «и» требует истинности обеих частей.',
'Покажи dbo.Products с Price от 100 до 500 включительно через >=, <= и AND.',
'SELECT * FROM dbo.Products WHERE Price >= 100 AND Price <= 500;','Одновременно нижняя и верхняя границы.',
'Для занятий сформулируй: дешевле 5000 и (утром или вечером). Сначала расставь скобки в русской фразе.');

unit('like','select','LIKE и IN',
['LIKE ищет по шаблону. % означает любое число символов, включая ноль; _ — ровно один символ.',
"N'Ан%' — начинается на Ан; N'%Ан%' — содержит Ан. Учёт регистра зависит от collation базы.",
'IN проверяет точное вхождение в список значений и заменяет несколько условий OR. Список записывают в круглых скобках.'],
"SELECT * FROM dbo.Readers\nWHERE City IN (N'Москва', N'Казань');",
['IN открывает набор допустимых значений.','Каждый город — отдельная строка.','Запятая разделяет значения.'],
'Москва → да; Казань → да; Калуга → нет.',
'% является шаблоном в LIKE; при = это обычный символ.',
'Шаблон для кот в любом месте строки?',['кот%','%кот%','_кот'],1,'% с обеих сторон допускает окружающий текст.',
'Найди dbo.Books, где Title начинается на Ат.',
"SELECT * FROM dbo.Books WHERE Title LIKE N'Ат%';","После Ат поставь %, перед Ат его не нужно.",
'Для поиска фамилии и названия товара действует один принцип: уточни «начинается» или «содержит».');

unit('null','select','Отсутствующие значения',
['Для NULL обычное сравнение не даёт истины. Условие Phone = NULL не найдёт строки без телефона.',
'Используй IS NULL для отсутствия, IS NOT NULL для наличия. N\'\' и N\'NULL\' — обычные строковые значения.',
'ISNULL(Phone, N\'Не указан\') заменяет отсутствие только в результате запроса, не изменяя таблицу.'],
"SELECT ReaderName, ISNULL(Phone, N'Не указан') AS Phone\nFROM dbo.Readers;",
['Первый аргумент ISNULL — проверяемое значение.','Второй — замена при NULL.','Известный телефон возвращается без изменения.'],
'Анна, NULL → Анна, Не указан\nОлег, 12345 → Олег, 12345',
'Не ставь = перед NULL.',
'Как найти отсутствие телефона?',['Phone = NULL','Phone IS NULL',"Phone = N'NULL'"],1,'IS NULL — специальная проверка отсутствия.',
'Выведи dbo.Readers с отсутствующим Phone.',
'SELECT * FROM dbo.Readers WHERE Phone IS NULL;','WHERE Phone IS NULL.',
'В библиотеке ReturnDate IS NULL может означать невозвращённую книгу. Сначала прочитай, как это определено в условии.');

unit('dates','select','Период и даты',
['date хранит дату, datetime2 — ещё и время. Верхняя граница «<= последний день» может потерять записи этого дня после полуночи.',
'Надёжный диапазон: >= начало и < начало следующего периода. Для июня 2026 это 20260601 и 20260701.',
'Формат YYYYMMDD удобен в SQL Server и не зависит от обычного порядка день/месяц в языке сеанса.'],
"SELECT * FROM dbo.Loans\nWHERE LoanDate >= '20260601'\nAND LoanDate < '20260701';",
['Начало июня включено.','Начало июля исключено.','Вечер 30 июня остаётся внутри диапазона.'],
'01.06 00:00 → да; 30.06 18:30 → да; 01.07 00:00 → нет.',
'MONTH(LoanDate) = 6 без года выбирает июнь всех лет.',
'Входит ли 1 июля в этот диапазон?',['Да','Нет','Только утром'],1,'Знак < исключает верхнюю границу.',
'Выведи dbo.Loans за январь 2027 по LoanDate, используя полуоткрытый диапазон.',
"SELECT * FROM dbo.Loans WHERE LoanDate >= '20270101' AND LoanDate < '20270201';",'Следующий месяц начинается 20270201.',
'Это же правило работает для даты заказа, оплаты, приёма и выдачи.');

unit('sort','select','ORDER BY и TOP',
['Без ORDER BY порядок строк не гарантирован. ASC — возрастание, DESC — убывание.',
'При одинаковых значениях добавь уникальный ключ вторым условием, чтобы порядок был однозначным.',
'TOP (2) ограничивает число строк. Для самых дорогих объектов обязательно нужна сортировка по цене DESC.'],
'SELECT TOP (2) Title, Price FROM dbo.Books\nORDER BY Price DESC, BookID ASC;',
['TOP (2): не больше двух строк.','Price DESC: сначала большие цены.','BookID ASC: порядок при одинаковой цене.'],
'Цены 300, 900, 500 → результат 900, 500.',
'TOP без ORDER BY не означает «самые большие».',
'Самые дорогие первыми:',['Price ASC','Price DESC','Title ASC'],1,'DESC располагает цены по убыванию.',
'Выведи все dbo.Products по возрастанию Price, явно указав ASC.',
'SELECT * FROM dbo.Products ORDER BY Price ASC;','ORDER BY после FROM и WHERE.',
'Для ближайших занятий сортируй по дате, для лучших результатов — по баллу. Определи критерий словами.');

unit('aggregate','report','Итоги COUNT, SUM, AVG',
['COUNT(*) считает строки. COUNT(Phone) — только известные значения Phone. SUM складывает значения, AVG вычисляет среднее по известным значениям.','Без GROUP BY получается общий итог. MIN и MAX возвращают минимум и максимум. Количество заказов, позиций и проданных штук — три разных показателя.','На пустой выборке COUNT(*) = 0, а SUM обычно NULL. ISNULL(SUM(Amount), 0) позволяет показать ноль.'],
'SELECT COUNT(*) AS OrdersCount,\nISNULL(SUM(Amount), 0) AS Total FROM dbo.Orders;',
['COUNT: сколько строк.','SUM: какова сумма.','ISNULL: что показать без строк.'],
'Суммы 100, 250, 150 → OrdersCount 3, Total 500.',
'COUNT(Amount) не складывает деньги.',
'COUNT(Amount) для 100, NULL, 300?',['3','2','400'],1,'NULL пропускается при подсчёте конкретного столбца.',
'Посчитай строки dbo.Loans как LoanCount.','SELECT COUNT(*) AS LoanCount FROM dbo.Loans;','Звёздочка внутри COUNT означает строки.','Для новой темы сначала реши, что именно считается: события, объекты или количество единиц.');

unit('group','report','GROUP BY и HAVING',
['GROUP BY собирает строки с одинаковым ключом в группы. Все заказы одного клиента становятся одной группой.','В SELECT остаются ключи группировки и агрегаты. Неагрегированный столбец обычно нужно включить в GROUP BY.','WHERE отбирает исходные строки, HAVING — уже рассчитанные группы. Условие по COUNT или SUM ставят в HAVING.'],
'SELECT CustomerID, COUNT(*) AS OrdersCount\nFROM dbo.Orders GROUP BY CustomerID\nHAVING COUNT(*) >= 2;',
['Группа — клиент.','COUNT считается внутри группы.','HAVING оставляет группы от двух строк.'],
'Ключи клиентов 1,1,2,3,3,3 → результат (1,2), (3,3).',
'WHERE COUNT(*) >= 2 не подходит: группы ещё не рассчитаны.',
'Где условие по сумме группы?',['WHERE','HAVING','FROM'],1,'HAVING проверяет агрегаты групп.',
'Посчитай строки dbo.Orders по CustomerID как OrdersCount.','SELECT CustomerID, COUNT(*) AS OrdersCount FROM dbo.Orders GROUP BY CustomerID;','Ключ группы нужен и в SELECT, и в GROUP BY.','Группой может стать читатель, мастер или курс. Определи это из требуемого результата.');

unit('join','report','INNER JOIN по ключам',
['В заказе находится CustomerID, а имя клиента — в Customers. JOIN связывает соответствующие строки по ключам.','Псевдонимы o и c — сокращённые имена таблиц. o.CustomerID точно указывает источник столбца.','INNER JOIN сохраняет совпавшие пары. Клиент с тремя заказами появляется в трёх строках: одна строка на заказ.'],
'SELECT c.CustomerName, o.Amount FROM dbo.Orders o\nJOIN dbo.Customers c ON c.CustomerID = o.CustomerID;',
['Orders — исходные заказы.','JOIN добавляет клиента.','ON сравнивает связанные ключи.'],
'Клиент (1, Анна); заказы (10,1,500), (11,1,200) → Анна 500; Анна 200.',
'Не соединяй по имени: имена могут повторяться.',
'Сколько строк даст клиент с тремя заказами?',['1','3','0'],1,'Каждый заказ даёт отдельную пару.',
'Запиши условие ON для Books b и Loans l по BookID.','b.BookID = l.BookID','Сравни ключи двух таблиц.','В новой схеме сначала найди внешние ключи; названия могут отличаться от учебных.');

unit('left','report','LEFT JOIN и нулевые итоги',
['LEFT JOIN сохраняет все строки слева. Если справа нет совпадения, столбцы справа получают NULL.','Для всех клиентов, включая клиентов без заказов, Customers должна быть слева.','Считай COUNT(o.OrderID), а не COUNT(*): строка без совпадения не является заказом.'],
'SELECT c.CustomerID, COUNT(o.OrderID) AS OrdersCount\nFROM dbo.Customers c LEFT JOIN dbo.Orders o ON o.CustomerID = c.CustomerID\nGROUP BY c.CustomerID;',
['Сохраняем клиентов.','COUNT ключа пропускает NULL.','Группа возвращает один итог клиента.'],
'Анна: два заказа → 2. Олег: нет заказов → 0.',
'WHERE o.Amount > 0 исключит клиентов без заказов. Продумай, должно ли условие быть в ON.',
'Как сохранить читателей без выдач?',['INNER JOIN','LEFT JOIN с Readers слева','CROSS JOIN'],1,'Левая таблица сохраняется целиком.',
'Напиши выражение подсчёта реальных заказов справа по o.OrderID.','COUNT(o.OrderID)','Не COUNT(*).','Тот же приём показывает товары без продаж и учеников без оценок.');

unit('calc','report','Вычисления и CASE',
['Стоимость позиции = количество × цена единицы. Сначала определи, что означает строка: заказ целиком или позиция.','Деление целых отбрасывает дробную часть: 5 / 2 = 2. Для дроби используй 5.0 / 2.','CASE выбирает значение: WHEN условие THEN результат ELSE другой результат END.'],
"SELECT Quantity * UnitPrice AS LineTotal,\nCASE WHEN Quantity > 10 THEN N'Опт' ELSE N'Розница' END AS SaleType\nFROM dbo.OrderLines;",
['Умножение считается для каждой строки.','CASE классифицирует количество.','AS задаёт имена столбцов.'],
'3 единицы по 120 → 360, Розница.',
'Не умножай общую сумму заказа повторно на количество его позиций.',
'Результат 5 / 2 с целыми операндами?',['2.5','2','3'],1,'Целочисленное деление отбрасывает дробную часть.',
'Выведи Quantity * UnitPrice как LineTotal из dbo.OrderLines.','SELECT Quantity * UnitPrice AS LineTotal FROM dbo.OrderLines;','Между множителями знак *.','Для работ это часы × тариф; для материалов — расход × цена единицы. Проверь единицы измерения.');

unit('design','design','Из текста в сущности и связи',
['Выпиши объекты из документов и определи, что означает одна строка каждого. Клиент, заказ и позиция заказа — разные сущности.','Свойство должно зависеть от ключа своей таблицы. Адрес клиента относится к клиенту; количество товара в заказе — к позиции заказа.','Многие-ко-многим оформляют связующей таблицей. Заказ содержит много товаров, товар встречается в разных заказах.'],
'Customers(CustomerID, CustomerName)\nOrders(OrderID, CustomerID, OrderDate)\nProducts(ProductID, ProductName)\nOrderLines(OrderID, ProductID, Quantity)',
['Заказ ссылается на клиента.','Позиция связывает заказ и товар.','Количество зависит от пары заказ–товар.'],
'Клиент 1 → N заказов; заказы M ↔ N товары через позиции.',
'Список товаров через запятую в одной ячейке мешает проверять связи и считать позиции.',
'Где количество товара в заказе?',['Customers','Products','OrderLines'],2,'Количество зависит от товара в конкретном заказе.',
'Студент посещает много курсов, курс посещают многие студенты. Назови связь: многие-ко-многим.','многие-ко-многим','Нужна связующая Enrollments.','Нарисуй связи новой предметной области до написания CREATE TABLE.');

unit('normal','design','Три нормальные формы',
['1НФ: одно значение в ячейке, никаких повторяющихся групп Товар1, Товар2, Товар3.','2НФ: неключевые свойства зависят от всего составного ключа. Количество позиции зависит от (OrderID, ProductID); имя товара зависит только от ProductID и хранится в Products.','3НФ: неключевые свойства не определяются через другие неключевые свойства. Данные клиента хранятся у клиента, заказ содержит ссылку. Исторический адрес доставки может быть отдельным фактом заказа, если это требует условие.'],
'Orders(OrderID, CustomerID, OrderDate)\nCustomers(CustomerID, CustomerName, City)',
['В заказе ссылка.','Данные клиента один раз.','Город не нужно исправлять в каждом заказе.'],
'Пять заказов одного клиента → одна запись его имени в Customers.',
'Не выноси каждое поле в отдельную таблицу без анализа зависимостей.',
'Что не нужно повторять в каждой позиции?',['Количество','ProductID','Название товара'],2,'Название зависит от товара, а не позиции.',
'Какой ключ связывает Orders с Customers в примере?','CustomerID','Это внешний ключ заказа.','Объясни зависимости между преподавателем, группой и занятием. Не копируй схему производства.');

unit('create','design','CREATE TABLE и ограничения',
['PRIMARY KEY однозначно определяет строку. IDENTITY выдаёт номера, но само по себе не заменяет первичный ключ.','NOT NULL требует значение; CHECK проверяет правило; UNIQUE запрещает повтор; REFERENCES проверяет существование родительской строки.','Сначала создавай и заполняй родительские таблицы, затем дочерние.'],
'CREATE TABLE dbo.Books (\n BookID int IDENTITY PRIMARY KEY,\n Title nvarchar(100) NOT NULL,\n Price decimal(10,2) NOT NULL CHECK (Price >= 0)\n);',
['Запятые разделяют столбцы.','Последняя строка без запятой.','NOT NULL и CHECK решают разные задачи.'],
'Цена -1 → отказ; 0 → разрешено; NULL → отказ.',
'CHECK без NOT NULL не запрещает отсутствие значения.',
'Что запрещает NULL?',['IDENTITY','NOT NULL','AS'],1,'NOT NULL делает поле обязательным.',
'Напиши CHECK, разрешающий Quantity строго больше нуля.','CHECK (Quantity > 0)','Ноль не включается.','Ограничения выводятся из условий нового задания.');

unit('write','design','INSERT, UPDATE, DELETE',
['INSERT добавляет строку: значения должны соответствовать списку столбцов. IDENTITY обычно пропускают.','UPDATE меняет строки через SET, DELETE удаляет. WHERE ограничивает затронутые записи.','Перед изменением проверь SELECT с тем же WHERE. Для обучения используй отдельную базу и транзакцию с откатом.'],
"INSERT INTO dbo.Books(Title, Price) VALUES (N'Атлас', 500);\nUPDATE dbo.Books SET Price = 550 WHERE BookID = 1;",
['INSERT создаёт строку.','SET задаёт значение.','WHERE выбирает строку по ключу.'],
'Книга 1 меняет цену на 550, остальные существующие книги не меняются.',
'UPDATE без WHERE меняет все строки; DELETE без WHERE удаляет все строки.',
'UPDATE без WHERE затронет:',['Первую строку','Все строки','Ни одной'],1,'Без фильтра множество изменений не ограничено.',
'Установи Price = 700 для BookID = 3 в dbo.Books.','UPDATE dbo.Books SET Price = 700 WHERE BookID = 3;','UPDATE таблица SET значение WHERE условие;','Используй уникальный ключ новой сущности, а не имя человека.');

unit('parameter','exam','Переменные, параметры, цикл',
['DECLARE объявляет переменную, её имя начинается с @. SET присваивает значение. Тип задаёт допустимые операции.','WHILE повторяет BEGIN…END, пока условие истинно. Счётчик обязательно изменять.','Параметры меняют входные данные без переписывания алгоритма. В C# используй SqlParameter для значений пользователя. Имена объектов требуют отдельного формирования с QUOTENAME.'],
'DECLARE @i int = 1;\nWHILE @i <= 3\nBEGIN\n PRINT @i;\n SET @i = @i + 1;\nEND;',
['Начало с 1.','Проверка перед итерацией.','Увеличение счётчика.'],
'В Messages: 1, 2, 3.',
'Имя переменной внутри кавычек становится обычным текстом.',
'Если не увеличивать @i:',['Цикл остановится сам','Он не завершится при истинном условии','Тело пропустится'],1,'Условие будет оставаться истинным.',
'Объяви @Count типа int со значением 0.','DECLARE @Count int = 0;','DECLARE имя тип = значение;','Вынеси даты, пороги и число пользователей в параметры нового алгоритма.');

unit('procedure','exam','Процедуры и представления',
['VIEW — сохранённый запрос, читаемый как таблица. Обычное представление не является архивной копией результатов.','Процедура принимает параметры и выполняет команды. Её запускают EXEC.','Сначала проверь обычный SELECT, затем оберни в процедуру. Проверь нормальные входные данные, пустой результат и неверный период.'],
'CREATE OR ALTER PROCEDURE dbo.BooksFromPrice\n @MinPrice decimal(10,2)\nAS\nBEGIN\n SET NOCOUNT ON;\n SELECT * FROM dbo.Books WHERE Price >= @MinPrice;\nEND;\nGO\nEXEC dbo.BooksFromPrice @MinPrice = 500;',
['После имени идут параметры.','AS отделяет тело.','EXEC запускает объект.'],
'Возвращаются книги от переданной цены.',
'Создание процедуры не равно её вызову.',
'Для отчёта с изменяемыми датами:',['Процедура с параметрами','Фиксированная строка','Список в ячейке'],0,'Параметры меняют входные условия.',
'Вызови dbo.BooksFromPrice с @MinPrice = 700.','EXEC dbo.BooksFromPrice @MinPrice = 700;','EXEC имя @параметр = значение;','В новой теме используй путь: выборка → проверка → параметры → процедура.');

unit('trigger','exam','Триггер обрабатывает набор',
['Триггер автоматически запускается при INSERT, UPDATE, DELETE. inserted содержит новые строки, deleted — старые.','Одна команда может менять несколько строк. Нельзя считать, что inserted содержит ровно одну запись.','При перемещении позиции между заказами пересчитываются старый и новый заказы. Нужны ключи из inserted и deleted.'],
'SELECT OrderID FROM inserted\nUNION\nSELECT OrderID FROM deleted;',
['UNION объединяет ключи без повторов.','inserted описывает новое состояние.','deleted описывает прежнее.'],
'Позиция перемещена из заказа 1 в 2 → пересчитать оба.',
'Проверка одной вставкой не доказывает работу для пакетных изменений.',
'Может ли inserted содержать несколько строк?',['Да','Нет','Только DELETE'],0,'Триггер обрабатывает всю команду.',
'Назови служебную таблицу со старыми значениями.','deleted','Новые — inserted.','Проверь вставку нескольких позиций, изменение количества и удаление последней позиции.');

unit('transaction','exam','Транзакция и архив',
['BEGIN TRANSACTION объединяет изменения. COMMIT сохраняет, ROLLBACK отменяет.','Архив: сначала копирование, потом удаление именно скопированных ключей. Учитывай зависимые позиции и внешние ключи.','При ошибке нужен откат. В рабочем скрипте используют TRY/CATCH и XACT_ABORT. Не отключай ключи ради обхода ошибки.'],
'BEGIN TRANSACTION;\nUPDATE dbo.Books SET Price = 700 WHERE BookID = 3;\nSELECT * FROM dbo.Books WHERE BookID = 3;\nROLLBACK;',
['Начинаем транзакцию.','Внутри видим изменение.','Откат возвращает прежнее состояние.'],
'До: 500 → внутри: 700 → после отката: 500.',
'Отбор по номеру месяца без года захватывает другие годы.',
'Что подтверждает изменения?',['ROLLBACK','COMMIT','SELECT'],1,'COMMIT сохраняет.',
'Напиши команду начала транзакции.','BEGIN TRANSACTION;','BEGIN TRANSACTION.','Такая согласованность нужна для списания склада, перевода и записи на курс.');

unit('access','exam','LOGIN, USER и права',
['LOGIN позволяет подключиться к серверу, USER существует внутри базы. Для SQL-аутентификации требуется соответствующий режим сервера.','CREATE USER связывает пользователя базы с логином. db_datareader даёт чтение, db_datawriter — изменение данных.','Проверяй ограничения под созданным пользователем, не под sa. Видеть имя базы не означает читать её таблицы.'],
'USE BD1;\nCREATE USER user1 FOR LOGIN user1;\nALTER ROLE db_datareader ADD MEMBER user1;',
['Выбор базы.','Связь с существующим логином.','Роль в этой базе.'],
'user1 читает разрешённые таблицы BD1; чтение таблиц BD2 должно быть запрещено.',
'Не выдавай sysadmin, чтобы скрыть ошибку доступа: это разрушит изоляцию.',
'Где существует USER?',['В конкретной базе','Только Windows','Только редактор'],0,'USER — субъект доступа базы.',
'Переключись на BD1.','USE BD1;','USE выбирает базу.','Перед автоматизацией выпиши соответствия логин → база.');

unit('backup','exam','Шифрование и резервная копия',
['Шифрование обратимо при наличии ключа. Хеш не позволяет расшифровать пароль и не заменяет задание 2.','Сертификат может защищать симметричный ключ. Открой ключ, зашифруй значения, проверь расшифровку и закрой ключ.','BACKUP сохраняет базу, RESTORE восстанавливает. Путь относится к серверу. VERIFYONLY проверяет читаемость, но не заменяет пробное восстановление в отдельную базу.'],
"BACKUP DATABASE BD TO DISK = N'C:\\Backup\\BD_backup.bak' WITH CHECKSUM;",
['BD — база.','TO DISK — файл на сервере.','CHECKSUM — контрольные суммы.'],
'Результат: .bak и сообщение об успешном копировании.',
'Наличие .bak не доказывает возможность восстановления; учитывай доступ к ключам.',
'Что восстанавливает базу?',['BACKUP DATABASE','RESTORE DATABASE','SELECT'],1,'RESTORE восстанавливает.',
'Назови функцию расшифровки при открытом симметричном ключе.','DecryptByKey','Encrypt шифрует, Decrypt расшифровывает.','Планируй восстановление в отдельную базу: уточни логические имена и пути файлов, не копируй WITH REPLACE вслепую.');

unit('debug','exam','Отладка и проверка смысла',
['Синтаксис: проверь скобки, кавычки и запятую перед указанным сервером местом.','Логика: JOIN заказа с тремя позициями повторит сумму заказа три раза. Запрос выполнится, но сумма будет неверной.','Проверяй по частям: строки → JOIN → WHERE → агрегаты. Создай маленькие данные с ответом, который считаешь вручную.'],
'SELECT o.OrderID, o.Amount, l.ProductID\nFROM dbo.Orders o JOIN dbo.OrderLines l ON l.OrderID = o.OrderID;',
['Одна строка на позицию.','Сумма заказа повторяется.','SUM после JOIN может завысить итог.'],
'Заказ 1000 с тремя позициями → наивная сумма 3000 вместо 1000.',
'SUM(DISTINCT Amount) не исправление: разные заказы могут иметь равные суммы.',
'Два разных заказа по 500: итог?',['500','1000','0'],1,'Одинаковая сумма не делает заказы одинаковыми.',
'Посчитай строки dbo.Orders как TotalOrders.','SELECT COUNT(*) AS TotalOrders FROM dbo.Orders;','Считай заказы до соединения с позициями.','Проверь пустую выборку, одинаковые имена, несколько позиций и границы дат.');

unit('library','transfer','Новая тема: библиотека',
['Readers(ReaderID, ReaderName), Books(BookID, Title), Loans(LoanID, ReaderID, BookID, LoanDate, ReturnDate). Строка Loans — одна выдача.','Назови строку результата, выбери таблицу, найди связи, переведи условия и проверь на примере.','Невозвращённая выдача: ReturnDate IS NULL. Для имени читателя добавь JOIN с Readers, для названия — с Books.'],
'SELECT * FROM dbo.Loans WHERE ReturnDate IS NULL;',
['Исходная таблица — выдачи.','Проверка отсутствия возврата.','Для списка событий группировка не нужна.'],
'Выдача без возврата включена; с датой возврата — исключена.',
'Не переноси CustomerID из старой схемы: здесь другие ключи.',
'Где факт выдачи?',['Books','Readers','Loans'],2,'Loans хранит события.',
'Покажи невозвращённые выдачи dbo.Loans.','SELECT * FROM dbo.Loans WHERE ReturnDate IS NULL;','IS NULL, не = NULL.','Самостоятельно добавь ReaderName и Title через два JOIN, затем посчитай невозвращённые книги каждого читателя.');

unit('school','transfer','Новая тема: учебный центр',
['Students(StudentID, StudentName), Courses(CourseID, CourseName), Enrollments(StudentID, CourseID, EnrollDate). Один студент посещает несколько курсов.','Enrollments связывает многие-ко-многим. Если повторная запись запрещена, пара StudentID, CourseID должна быть уникальна.','Для числа записей по курсу нужен GROUP BY CourseID. Для пустых курсов — LEFT JOIN от Courses.'],
'SELECT CourseID, COUNT(*) AS StudentCount\nFROM dbo.Enrollments GROUP BY CourseID;',
['Считаем записи.','Группируем по курсу.','Пустые курсы пока не показаны.'],
'Записи (1,10), (2,10), (1,20) → курс 10: 2; курс 20: 1.',
'Число строк Courses — число курсов, а не учащихся.',
'Как добавить пустые курсы?',['LEFT JOIN от Courses','Убрать WHERE','SUM(CourseID)'],0,'Слева должны быть все курсы.',
'Посчитай записи dbo.Enrollments по CourseID как StudentCount.','SELECT CourseID, COUNT(*) AS StudentCount FROM dbo.Enrollments GROUP BY CourseID;','Ключ группы и COUNT(*).','Спроектируй ограничение вместимости. Объясни, почему внешнего ключа недостаточно.');
const originalCatalog=catalog, originalHome=home, quickExam=exam;
let sqlProgress={answers:{},last:'table',notes:{}};
try {const p=JSON.parse(localStorage.getItem('dem-sql-v2')||'null');if(p&&p.answers&&p.notes)sqlProgress=p;}catch{}
let sqlCurrent='table';
const sqlDone=u=>!!(sqlProgress.answers[u.id]?.concept&&sqlProgress.answers[u.id]?.code);
function saveSql(){try{localStorage.setItem('dem-sql-v2',JSON.stringify(sqlProgress));}catch{const n=document.getElementById('notice');if(n)n.textContent='Прогресс не сохраняется браузером. Скачайте резервную копию.';}}
function sqlTokens(s){const tokens=s.trim().match(/N?'(?:''|[^'])*'|--[^\n]*|>=|<=|<>|!=|[A-Za-z_@][A-Za-z_0-9@]*|[0-9]+(?:\.[0-9]+)?|\S/gi)||[];while(tokens.at(-1)===';')tokens.pop();return tokens.filter(t=>!t.startsWith('--')).map(t=>/^N?'/i.test(t)?t.replace(/^n'/,"N'"):t.toLowerCase());}
function sameSql(a,b){return JSON.stringify(sqlTokens(a))===JSON.stringify(sqlTokens(b));}
catalog=function(type){if(type!=='SQL')return originalCatalog(type);sqlCatalog();};
function sqlCatalog(){examMode=false;shell('<span class="tag">Полный SQL-маршрут · начинаем без подготовки</span><h1>Понимать. Писать.<br>Решать самостоятельно.</h1><p>'+sqlCourse.length+' подробных уроков, по две проверяемые задачи и самостоятельная практика в каждом. Названия таблиц меняются: учимся видеть общую структуру.</p><div class="panel"><b>Пройдено '+sqlCourse.filter(sqlDone).length+' из '+sqlCourse.length+'</b><progress max="'+sqlCourse.length+'" value="'+sqlCourse.filter(sqlDone).length+'"></progress><button class="primary" onclick="sqlLesson(sqlProgress.last)">Продолжить SQL →</button> <button onclick="memoryHub(&quot;sql&quot;)">Код по памяти · SQL</button> <button onclick="orderReportPractice()">Собрать отчёт в SSMS</button> <button onclick="sqlMistakes()">Повторить трудное</button> <a href="practice.sql" download>Учебные таблицы для SSMS ↓</a></div>'+sqlModules.map(([id,title,desc])=>'<section><h2>'+title+'</h2><p>'+desc+'</p><div class="cards">'+sqlCourse.filter(u=>u.module===id).map(u=>'<article class="card"><span class="badge">'+(sqlDone(u)?'✓ Две задачи решены':'15–25 минут')+'</span><h3>'+esc(u.title)+'</h3><button onclick="sqlLesson(\''+u.id+'\')">Изучить →</button></article>').join('')+'</div></section>').join('')+'<details><summary>Краткие уроки первой версии</summary><p>Старый прогресс сохранён. Основной маршрут теперь расположен выше.</p>'+lessons.map((l,i)=>l[0]==='SQL'?'<button onclick="lesson('+i+')">'+esc(l[2])+'</button>':'').join(' ')+'</details>');}
function sqlLesson(id){
 const u=sqlCourse.find(x=>x.id===id)||sqlCourse[0];sqlCurrent=u.id;sqlProgress.last=u.id;saveSql();examMode=false;
 const p=sqlProgress.answers[u.id]||{},i=sqlCourse.indexOf(u);
 shell('<button onclick="sqlCatalog()">← SQL-маршрут</button><p class="tag">Урок '+(i+1)+' / '+sqlCourse.length+' · '+sqlModules.find(m=>m[0]===u.module)[1]+'</p><h1>'+esc(u.title)+'</h1><button onclick="memoryHub(&quot;sql&quot;)">Код по памяти · SQL</button>'+(u.id==='group'?'<button onclick="orderReportPractice()">Собрать отчёт в SSMS</button>':'')+(typeof memoryLessons!=='undefined' && memoryLessons.some(m=>m.id===u.id)?'<button onclick="memoryOpen(&quot;'+u.id+'&quot;)">Отработать тему по памяти</button>':'')+'<div class="panel"><h2>1. Сначала пойми смысл</h2>'+u.theory.map(t=>'<p>'+esc(t)+'</p>').join('')+'</div><div class="panel"><h2>2. Прочитай пример по частям</h2><pre data-language="sql">'+esc(u.example)+'</pre><ol>'+u.lines.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ol><h3>Какой результат ожидаем</h3><pre class="result">'+esc(u.result)+'</pre><div class="feedback"><b>Частая ошибка</b><br>'+esc(u.mistake)+'</div></div><div class="panel"><h2>3. Проверь понимание '+(p.concept?'✓':'')+'</h2><p>'+esc(u.question)+'</p><div class="row">'+u.choices.map((t,n)=>'<button onclick="sqlConcept('+n+')">'+esc(t)+'</button>').join('')+'</div><div id="concept-feedback" role="status"></div></div><div class="panel"><h2>4. Напиши сам '+(p.code?'✓':'')+'</h2><p>'+esc(u.task)+'</p><label for="sql-answer">Твой SQL или короткий ответ</label><textarea data-language="sql" id="sql-answer" spellcheck="false" placeholder="Набери ответ, не копируя пример"></textarea><div class="row"><button class="primary" onclick="sqlCheck()">Проверить</button><button onclick="sqlHint()">Подсказка</button></div><div id="sql-feedback" role="status"></div><details><summary>Показать эталон и объяснение</summary><pre data-language="sql">'+esc(u.answer)+'</pre><p>'+esc(u.hint)+'</p><p>Закрой эталон и повтори по памяти, затем поменяй условие. Просмотр ответа сам по себе не отмечает урок пройденным.</p></details><small>Проверка по учебному шаблону: пробелы и регистр команд не важны. Эквивалентный SQL с другой структурой может не распознаться. Для проверки выполнения используй SSMS.</small></div>'+(u.id==='table'?firstOrderPractice():['join','left'].includes(u.id)?joinPracticePanel(u.id):'<div class="panel"><h2>5. Перенеси навык на новую тему</h2><p>'+esc(u.transfer)+'</p><label for="sql-note">Объясни свой подход и запиши результат проверки в SSMS</label><textarea id="sql-note" oninput="sqlNote(this.value)" placeholder="Какие таблицы нужны? Как проверить ответ?">'+esc(sqlProgress.notes[u.id]||'')+'</textarea><small>Это самостоятельная практика. Запись в дневнике не означает, что решение проверено.</small></div>')+'<div class="row">'+(i?'<button onclick="sqlLesson(\''+sqlCourse[i-1].id+'\')">← Предыдущий</button>':'')+(i<sqlCourse.length-1?'<button onclick="sqlLesson(\''+sqlCourse[i+1].id+'\')">Следующий →</button>':'<button onclick="exam()">Перейти к репетиции КИМа →</button>')+'</div>');
}
function sqlNote(v){sqlProgress.notes[sqlCurrent]=v;saveSql();}
function sqlConcept(n){const u=sqlCourse.find(u=>u.id===sqlCurrent),ok=n===u.correct,p=sqlProgress.answers[u.id]||{};p.concept=ok;p.mistake=!ok||!!p.mistake;if(ok&&p.code)p.mistake=false;sqlProgress.answers[u.id]=p;saveSql();document.getElementById('concept-feedback').innerHTML='<div class="feedback '+(ok?'ok':'')+'">'+(ok?'✓ Верно. ':'Попробуй ещё раз. ')+esc(u.why)+'</div>';}
function sqlHint(){document.getElementById('sql-feedback').innerHTML='<div class="feedback">'+esc(sqlCourse.find(u=>u.id===sqlCurrent).hint)+'</div>';}
function sqlCheck(){
 const u=sqlCourse.find(u=>u.id===sqlCurrent),v=document.getElementById('sql-answer').value,f=document.getElementById('sql-feedback');
 if(!v.trim()){f.innerHTML='<p class="feedback">Сначала напиши ответ. Подсказка поможет начать.</p>';return;}
 const ok=sameSql(v,u.answer),p=sqlProgress.answers[u.id]||{};p.code=ok;p.mistake=!ok||!!p.mistake;if(ok&&p.concept)p.mistake=false;sqlProgress.answers[u.id]=p;saveSql();
 let detail=u.hint;
 if(!ok){const a=sqlTokens(v),b=sqlTokens(u.answer),j=b.findIndex((t,i)=>a[i]!==t);detail+=j>=0?' Первое отличие от шаблона: часть '+(j+1)+'. Ожидалось «'+b[j]+'», получено «'+(a[j]||'конец ответа')+'».':' В ответе есть лишние части после ожидаемого завершения.';}
 f.innerHTML='<div class="feedback '+(ok?'ok':'')+'">'+(ok?'✓ Ответ совпал. '+(p.concept?'Обе задачи урока решены. Теперь выполни перенос навыка.':'Осталось проверить понимание выше.'):'Пока не совпало. '+esc(detail))+'</div>';
}
function sqlMistakes(){const units=sqlCourse.filter(u=>sqlProgress.answers[u.id]?.mistake);shell('<h1>Повторяем трудное</h1><p>Вернись к объяснению и реши обе задачи. После этого урок исчезнет из списка.</p>'+ (units.length?units.map(u=>'<div class="panel"><h3>'+esc(u.title)+'</h3><button onclick="sqlLesson(\''+u.id+'\')">Повторить</button></div>').join(''):'<div class="panel">Ошибок в новом SQL-курсе пока нет.</div>'));}
const originalReview=review;review=function(){originalReview();main.insertAdjacentHTML('afterbegin','<div class="panel"><h2>Новый SQL-курс</h2><button onclick="sqlMistakes()">Ошибки подробного курса →</button></div>');};
home=function(){originalHome();main.insertAdjacentHTML('afterbegin','<div class="panel"><span class="badge">Обновлённый курс</span><h2>Научись решать новый вариант</h2><p>'+sqlCourse.length+' подробных SQL-уроков: смысл → разбор → результат → практика → новая предметная область.</p><div class="row"><button class="primary" onclick="sqlCatalog()">Начать SQL с нуля</button><button onclick="memoryHub()">Код по памяти · SQL и C#</button><button onclick="exam()">Репетиция по КИМу</button></div></div>');};
const originalExport=exportProgress;
exportProgress=function(){downloadJson({format:'dem-trainer-v2',legacy:state,sql:sqlProgress,exam:examState},'dem-progress.json');};
importProgress=async function(input){try{const v=JSON.parse(await input.files[0].text());const legacy=v.format==='dem-trainer-v2'?v.legacy:v;if(!legacy||!Array.isArray(legacy.done)||!Array.isArray(legacy.wrong)||![...legacy.done,...legacy.wrong].every(i=>Number.isInteger(i)&&i>=0&&i<lessons.length))throw Error();if(v.format==='dem-trainer-v2'&&(!v.sql||typeof v.sql.answers!=='object'||!v.sql.notes))throw Error();state={...legacy,last:Number.isInteger(legacy.last)&&legacy.last>=0&&legacy.last<lessons.length?legacy.last:0};if(v.format==='dem-trainer-v2'){sqlProgress=v.sql;if(v.exam&&Array.isArray(v.exam.checks)&&typeof v.exam.notes==='object')examState=v.exam;}save();saveSql();saveExam();home();}catch{alert('Неверный файл прогресса. Выбери JSON, скачанный из тренажёра.');}};
function downloadJson(value,name){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}


function firstOrderPractice(){
 return `<section class="panel"><h2>5. Найди номера заказов для формы</h2>
 <p>В EnterpriseDB одна строка таблицы dbo.CustomerOrders — один заказ. У заказа есть свой номер OrderID и номер клиента CustomerID. На форме нужно показать номера заказов.</p>
 <pre>OrderID   CustomerID
      1            1
      2            2
      3            3</pre>
 <label for="order-practice">Напиши запрос, который выведет только OrderID из dbo.CustomerOrders.</label>
 <textarea data-language="sql" id="order-practice" spellcheck="false"></textarea>
 <button class="primary" onclick="checkFirstOrders()">Проверить запрос</button>
 <details><summary>Подсказка</summary><p>После SELECT напиши имя нужного столбца. После FROM — имя таблицы вместе со схемой dbo.</p></details>
 <div id="order-check" role="status"></div></section>`;
}
function checkFirstOrders(){
 const answer=document.getElementById('order-practice').value;
 const parts=sqlTokens(answer);
 const ok=sameSql(answer,'SELECT OrderID FROM dbo.CustomerOrders');
 let feedback='Начни с SELECT. Затем укажи столбец, FROM и таблицу dbo.CustomerOrders.';
 if(ok) feedback='Верно. Получится один столбец OrderID с номерами 1, 2 и 3. Каждый номер соответствует одному заказу.';
 else if(parts[1]==='*') feedback='Звёздочка выводит все столбцы. Здесь форме нужен только номер заказа. Чем заменить звёздочку?';
 else if(parts[1]==='customerid') feedback='CustomerID показывает, кто сделал заказ. Для номера самого заказа выбери OrderID.';
 else if(parts[1]==='orderid') feedback='Столбец выбран верно. Проверь оставшуюся часть: FROM dbo.CustomerOrders.';
 document.getElementById('order-check').textContent=feedback;
}
