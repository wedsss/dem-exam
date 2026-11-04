-- Автономные учебные данные: выполняйте весь файл одним пакетом в SSMS.
-- Временные таблицы существуют только в этом подключении и не меняют EnterpriseDB.
-- В упражнениях сайта dbo.Books заменяйте на #Books и аналогично для других таблиц.
CREATE TABLE #Books (BookID int PRIMARY KEY, Title nvarchar(100), Price decimal(10,2));
INSERT #Books VALUES (1,N'Атлас',500),(2,N'Сказки',300),(3,N'Словарь',900);
CREATE TABLE #Products (ProductID int PRIMARY KEY, ProductName nvarchar(100), Category nvarchar(30), Price decimal(10,2));
INSERT #Products VALUES (1,N'Атлас',N'Книга',500),(2,N'Мир',N'Журнал',200),(3,N'Мяч',N'Игрушка',100);
CREATE TABLE #Readers (ReaderID int PRIMARY KEY, ReaderName nvarchar(100), City nvarchar(50), Phone nvarchar(30));
INSERT #Readers VALUES (1,N'Анна',N'Москва',NULL),(2,N'Олег',N'Казань',N'12345'),(3,N'Ирина',N'Калуга',NULL);
CREATE TABLE #Loans (LoanID int PRIMARY KEY, ReaderID int, BookID int, LoanDate datetime2, ReturnDate date NULL);
INSERT #Loans VALUES (1,1,1,'20260601',NULL),(2,1,2,'20260630 18:30','20260702'),(3,2,3,'20260701',NULL);
CREATE TABLE #Customers (CustomerID int PRIMARY KEY, CustomerName nvarchar(100));
INSERT #Customers VALUES (1,N'Анна'),(2,N'Олег'),(3,N'Ирина');
CREATE TABLE #Orders (OrderID int PRIMARY KEY, CustomerID int, OrderDate date, Amount decimal(10,2));
INSERT #Orders VALUES (10,1,'20260601',500),(11,1,'20260602',200),(12,3,'20260701',500);
CREATE TABLE #OrderLines (OrderID int, ProductID int, ProductName nvarchar(100), Quantity int, UnitPrice decimal(10,2));
INSERT #OrderLines VALUES (10,1,N'Атлас',1,500),(11,2,N'Мир',1,200),(12,1,N'Атлас',1,500);
CREATE TABLE #Students (StudentID int PRIMARY KEY, StudentName nvarchar(100));
INSERT #Students VALUES (1,N'Анна'),(2,N'Олег'),(3,N'Ирина');
CREATE TABLE #Courses (CourseID int PRIMARY KEY, CourseName nvarchar(100));
INSERT #Courses VALUES (10,N'SQL'),(20,N'C#'),(30,N'Тестирование');
CREATE TABLE #Enrollments (StudentID int, CourseID int, EnrollDate date, PRIMARY KEY(StudentID,CourseID));
INSERT #Enrollments VALUES (1,10,'20260601'),(2,10,'20260601'),(1,20,'20260602');

-- Проверки с известными ответами
SELECT COUNT(*) AS BookCount, SUM(Price) AS TotalPrice FROM #Books; -- 3, 1700
SELECT c.CustomerID, COUNT(o.OrderID) AS OrdersCount
FROM #Customers c LEFT JOIN #Orders o ON o.CustomerID=c.CustomerID
GROUP BY c.CustomerID; -- 1:2, 2:0, 3:1
SELECT CourseID,COUNT(*) AS StudentCount FROM #Enrollments GROUP BY CourseID; -- 10:2, 20:1
-- Пишите свои SELECT ниже. Повторный запуск CREATE в том же окне потребует нового подключения.
