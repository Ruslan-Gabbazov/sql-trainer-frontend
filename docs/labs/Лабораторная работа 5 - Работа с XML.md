---
sidebar_position: 5
---

# Лабораторная работа 5 - Работа с XML (дополнительная)

**Получение данных из реляционных таблиц в формате XML**

## Урок 1: Создание XML с использованием FOR XML

**Цели:**

1. Объяснить назначение команды FOR XML.
2. Описать четыре режима запросов: RAW, AUTO, EXPLICIT, PATH и их синтаксис.
3. Показать, как использовать вложенные элементы в XML.

### Введение в FOR XML

В PostgreSQL XML поддерживается через функции для работы с текстом и встроенные операторы. PostgreSQL не имеет прямой
аналогии с FOR XML, но можно создавать XML вручную с помощью функций xmlforest, xmlelement, xmlagg и других.

### Основной синтаксис FOR XML

Для получения данных в XML-формате можно использовать функции xmlelement и xmlforest для создания элементов XML:

```sql
SELECT
    xmlelement(name customer,
        xmlattributes(c.id AS "CustomerID"),
        xmlelement(name type, c.type)
    )
FROM customers c;
```

### Режимы создания XML

1. **RAW** — аналогичен генерации элемента для каждой строки. В PostgreSQL для этого можно использовать xmlelement и
   xmlagg:

```sql
SELECT
    xmlelement(name row,
        xmlattributes(c.id AS "CustID", c.type AS "CustomerType"),
        xmlelement(name SalesOrderID, o.id)
    )
FROM customers c
JOIN orders o ON c.id = o.customer_id;
```

### Режим AUTO

Режим AUTO в SQL Server создаёт иерархическую структуру XML, где каждая таблица и её связанные данные представляются как
вложенные элементы. В PostgreSQL мы можем добиться похожего результата, используя комбинацию функций xmlelement,
xmlforest, xmlagg и LEFT JOIN для формирования иерархии.

Пример запроса для PostgreSQL, который имитирует FOR XML AUTO:

```sql
SELECT
    xmlelement(name Customer,
        xmlattributes(c.id AS "CustID", c.type AS "CustomerType"),
            xmlagg(
                xmlelement(name Order,
                xmlattributes(o.id AS "SalesOrderID")
            )
        )
    )
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.type;
```

В этом запросе:

- xmlelement создаёт элементы &lt;Customer&gt; и &lt;Order&gt;.
- xmlattributes добавляет атрибуты, такие как CustID и SalesOrderID.
- xmlagg собирает все &lt;Order&gt; элементы, связанные с каждым &lt;Customer&gt;, в один иерархический элемент.

### Режим EXPLICIT

Режим EXPLICIT позволяет настроить структуру XML вручную, используя универсальные таблицы с уникальными тегами и их
родительскими элементами. В PostgreSQL нет прямой аналогии, поэтому иерархию придется настраивать вручную, создавая
подзапросы для каждого уровня вложенности.

Пример запроса, имитирующего EXPLICIT:

```sql
SELECT
    xmlelement(name Invoice,
    xmlattributes(i.id AS "InvoiceNo"),
    xmlelement(name Date, i.date),
        xmlagg(
            xmlelement(name LineItem,
                xmlattributes(p.id AS "ProductID"),
                p.name
            )
        )
    )
FROM invoices i
JOIN line_items li ON i.id = li.invoice_id
JOIN products p ON li.product_id = p.id
GROUP BY i.id, i.date;
```

Этот запрос создаёт иерархический XML, где Invoice содержит вложенные элементы LineItem.

### Режим PATH

Режим PATH в SQL Server использует синтаксис, похожий на XPath, для создания вложенных структур XML с возможностью
добавлять атрибуты и элементы с произвольной вложенностью. В PostgreSQL аналогичный результат можно получить с помощью
xmlagg и xmlelement, применяя их для определения путей к узлам.

Пример, который иллюстрирует использование PATH:

```sql
SELECT
    xmlelement(name Employee,
        xmlattributes(e.id AS "EmpID"),
        xmlelement(name EmpName,
            xmlelement(name First, e.first_name),
            xmlelement(name Last, e.last_name)
        )
    )
FROM employees e;
```

Этот запрос создаёт XML-структуру, аналогичную результату FOR XML PATH в SQL Server:

- Employee становится корневым элементом.
- EmpID создается как атрибут с использованием xmlattributes.
- Вложенные элементы First и Last добавляются под EmpName, формируя структуру с вложенностью.

**Использование корневого элемента**

Чтобы добавить корневой элемент для всей структуры, можно обернуть запрос в ещё один xmlelement. Например:

```sql
SELECT
    xmlelement(name Employees,
        xmlagg(
            xmlelement(name Employee,
            xmlattributes(e.id AS "EmpID"),
                xmlelement(name EmpName,
                    xmlelement(name First, e.first_name),
                    xmlelement(name Last, e.last_name)
                )
            )
        )
    )
FROM employees e;
```

Здесь Employees становится корневым элементом, объединяя все &lt;Employee&gt; элементы, что аналогично опции ROOT в SQL
Server.

## Урок 2: Разбор XML с использованием OPENXML

Цели:

1. Объяснить назначение разборки XML-документа.
2. Показать, как выполнять разбор XML с помощью функций в PostgreSQL.
3. Описать альтернативные методы для работы с пространством имен XML.

### Введение в разбор XML

В PostgreSQL можно использовать встроенные функции для обработки XML, такие как xpath, xmltable, xpath_exists, для
извлечения данных из XML-документов и их преобразования в набор строк.

### Получение данных из XML с использованием xpath

Функция xpath позволяет выбрать узлы из XML-данного с использованием выражений XPath. Она возвращает массив значений,
соответствующих заданному пути.

Пример запроса, который имитирует поведение OPENXML:

```sql
SELECT unnest(xpath('//OrderDetail/@ProductID', xml_data::xml))::text AS ProductID,
       unnest(xpath('//OrderDetail/@Quantity', xml_data::xml))::text AS Quantity
FROM (VALUES ('<Customer CustomerID="1">
                    <Order SalesOrderID="43860" Status="5" OrderDate="2001-08-01">
                        <OrderDetail ProductID="761" Quantity="2"/>
                        <OrderDetail ProductID="770" Quantity="1"/>
                    </Order>
               </Customer>')) AS t(xml_data);
```

Этот запрос:

- Извлекает атрибуты ProductID и Quantity из элементов OrderDetail.
- Использует unnest для преобразования возвращаемого массива в строки, аналогично получению набора строк через OPENXML в
  SQL Server.

### Использование xmltable для преобразования XML в табличный вид

Функция xmltable позволяет создать набор строк из XML-документа, указав пути к узлам и соответствие столбцов.

Пример, аналогичный OPENXML с использованием xmltable:

```sql
SELECT x.productid::text AS ProductID,
       x.quantity::int AS Quantity
FROM xmltable(
       '//OrderDetail' PASSING xmlparse(document
       '<Customer CustomerID="1">
            <Order SalesOrderID="43860" Status="5" OrderDate="2001-08-01">
                <OrderDetail ProductID="761" Quantity="2"/>
                <OrderDetail ProductID="770" Quantity="1"/>
            </Order>
       </Customer>')
       COLUMNS
           productid text PATH '@ProductID',
           quantity int PATH '@Quantity'
) AS x;
```

В этом примере:

- xmlparse(document ...) создаёт XML-документ из текстового значения.
- xmltable определяет структуру, где каждый элемент OrderDetail представлен в виде строки с колонками ProductID и
  Quantity.

### Хранимые процедуры для работы с XML-деревьями в памяти

В SQL Server хранимые процедуры sp_xml_preparedocument и sp_xml_removedocument используются для подготовки XML-документа
к разбору и освобождения памяти после завершения. В PostgreSQL аналогов этим хранимым процедурам нет, так как PostgreSQL
не требует предварительной подготовки XML перед использованием функций для работы с XML. Весь XML может быть обработан
непосредственно с помощью встроенных функций.

### Использование пространств имен в XML

PostgreSQL поддерживает работу с пространствами имен XML при использовании выражений XPath, которые позволяют уточнить
путь к элементам и атрибутам, определённым в пространстве имен.

Пример использования пространств имен с функцией xpath:

```sql
SELECT xpath('declare namespace ns="http://example.com/ns";
              //ns:OrderDetail/@ProductID',
              xmlparse(document
              '<Customer xmlns="http://example.com/ns" CustomerID="1">
                   <Order SalesOrderID="43860" Status="5" OrderDate="2001-08-01">
                       <OrderDetail ProductID="761" Quantity="2"/>
                       <OrderDetail ProductID="770" Quantity="1"/>
                   </Order>
              </Customer>')
       ) AS ProductIDs;
```

В этом примере:

- declare namespace объявляет пространство имен ns.
- XPath-запрос выбирает атрибуты ProductID из элементов OrderDetail, используя префикс ns для работы с элементами,
  находящимися в пространстве имен.

### Извлечение данных из вложенных XML-структур с помощью xmltable

Для более сложных XML-структур можно использовать функцию xmltable, которая позволяет работать с пространством имен и
выполнять более глубокий разбор XML.

Пример:

```sql
SELECT x.customerid::int AS CustomerID,
       x.orderid::int AS OrderID,
       x.productid::int AS ProductID,
       x.quantity::int AS Quantity
FROM xmltable(
    'declare namespace ns="http://example.com/ns";
     //ns:Customer' PASSING xmlparse(document
     '<Customer xmlns="http://example.com/ns" CustomerID="1">
          <Order SalesOrderID="43860" Status="5" OrderDate="2001-08-01">
              <OrderDetail ProductID="761" Quantity="2"/>
              <OrderDetail ProductID="770" Quantity="1"/>
          </Order>
     </Customer>')
     COLUMNS
         customerid int PATH '@CustomerID',
         orderid int PATH 'Order/@SalesOrderID',
         productid int PATH 'Order/OrderDetail/@ProductID',
         quantity int PATH 'Order/OrderDetail/@Quantity'
) AS x;
```

В этом примере:

- Используется declare namespace для объявления пространства имен ns.
- xmltable создаёт табличное представление с колонками CustomerID, OrderID, ProductID, и Quantity, используя вложенные
  пути для извлечения значений из атрибутов XML.

Эти примеры дают аналог OPENXML для разбора XML и работы с пространствами имен в PostgreSQL.

## Урок 3: Использование типа данных xml в PostgreSQL

Цели:

1. Определить тип данных xml и его преимущества.
2. Показать, как использовать XQuery-подобные выражения для запросов к XML данным.
3. Объяснить методы для извлечения и модификации XML данных в PostgreSQL.

### Введение в тип данных xml

В PostgreSQL тип данных xml позволяет хранить XML-документы и фрагменты XML в колонках таблиц или в переменных. Это
упрощает интеграцию XML в реляционную базу данных и даёт возможность выполнять запросы к XML данным, извлекать значения
из элементов и атрибутов, а также модифицировать XML.

### Запросы к XML данным с использованием XPath

PostgreSQL поддерживает XPath для выполнения запросов к XML данным, что позволяет извлекать значения из узлов и
атрибутов XML. Основные функции для запросов к XML данным включают:

- xpath — возвращает массив узлов, соответствующих выражению XPath.
- xpath_exists — проверяет, существуют ли узлы, соответствующие выражению XPath.

Пример запроса к XML данным:

```sql
SELECT xpath('/InvoiceList/Invoice[@InvoiceNo=1000]', xml_data::xml)
FROM (VALUES ('<InvoiceList>
                   <Invoice InvoiceNo="1000">
                       <Customer>John Doe</Customer>
                       <Total>100.00</Total>
                   </Invoice>
               </InvoiceList>')) AS t(xml_data);
```

В этом примере:

- Запрос выбирает элемент Invoice с атрибутом InvoiceNo=1000.
- xpath возвращает массив XML-элементов, соответствующих указанному пути.

### Извлечение значений из XML с помощью xpath и преобразование в текст

Чтобы получить отдельные значения из XML-элементов, можно использовать функцию xpath и преобразовать результат в текст.
Это может быть полезно, если вам нужны значения отдельных атрибутов или элементов.

Пример:

```sql
SELECT (xpath('/InvoiceList/Invoice/Customer/text()', xml_data::xml))[1]::text AS CustomerName
FROM (VALUES ('<InvoiceList>
                   <Invoice InvoiceNo="1000">
                       <Customer>John Doe</Customer>
                       <Total>100.00</Total>
                   </Invoice>
               </InvoiceList>')) AS t(xml_data);
```

### Методы для работы с XML в PostgreSQL

PostgreSQL предоставляет несколько функций для работы с данными XML, аналогичных методам query, value, и exist из SQL
Server:

1. **xpath** — используется как аналог метода query, возвращая массив XML-узлов, соответствующих выражению XPath.
2. **xpath_exists** — аналог метода exist, проверяющий, существует ли узел, соответствующий выражению XPath. Пример
   использования:

```sql
SELECT xpath_exists('/InvoiceList/Invoice[@InvoiceNo=1000]', xml_data::xml) AS InvoiceExists
FROM (VALUES ('<InvoiceList>
                   <Invoice InvoiceNo="1000">
                       <Customer>John Doe</Customer>
                       <Total>100.00</Total>
                   </Invoice>
               </InvoiceList>')) AS t(xml_data);
```

3. **xmlelement, xmlattributes и xmlconcat** — функции для создания и объединения XML-элементов и атрибутов, которые
   позволяют создавать XML-документы программно.

Эти функции обеспечивают основные возможности работы с XML-данными, включая проверку, выборку и создание XML в
PostgreSQL.

### Модификация XML данных с помощью xml функций в PostgreSQL

В отличие от SQL Server, который поддерживает метод modify для обновления данных XML с помощью XML DML (Data
Modification Language), PostgreSQL не имеет встроенного механизма для непосредственного изменения содержимого XML.
Поэтому, чтобы обновить, удалить или вставить элементы в XML-структуру, обычно применяются функции для преобразования
XML в текст, внесения изменений и последующего пересохранения XML.

### Вставка данных в XML с помощью xmlelement и xmlconcat

Для добавления новых узлов или атрибутов к существующему XML-значению можно использовать функции xmlconcat, xmlelement и
xmlattributes, комбинируя их для создания новых XML элементов.

Пример создания нового XML с добавленным элементом:

```sql
SELECT xmlconcat(
           xmlparse(document '<Order OrderID="1000" OrderDate="2021-10-01">
                                <LineItem ProductID="1" Price="19.99" Quantity="2" />
                              </Order>'),
           xmlelement(name "SalesPerson", 'Alice')
       ) AS UpdatedXML;
```

Этот запрос:

- Создаёт новый XML-элемент &lt;SalesPerson&gt; и добавляет его в XML-документ с помощью xmlconcat.

### Обновление значений в XML

Для обновления конкретного значения в XML можно использовать replace и другие текстовые функции PostgreSQL. Для этого
можно извлечь XML как текст, изменить нужный элемент и затем преобразовать обратно в XML.

Пример обновления значения атрибута:

```sql
WITH xml_data AS (
    SELECT xmlparse(document '<Order OrderID="1000" OrderDate="2021-10-01">
                                <LineItem ProductID="1" Price="19.99" Quantity="2" />
                              </Order>')::text AS xml_text
)
SELECT xmlparse(document regexp_replace(xml_text, 'Price="19.99"', 'Price="24.99"', 'g'))::xml AS UpdatedXML
FROM xml_data;
```

В этом примере:

- regexp_replace используется для изменения значения Price в тексте XML, заменяя 19.99 на 24.99.
- Результат преобразуется обратно в тип xml с помощью xmlparse.

### Удаление узлов из XML

Удаление узлов в PostgreSQL также достигается путём преобразования XML в текст и удаления нужного узла с помощью
регулярных выражений или функции regexp_replace.

Пример удаления элемента &lt;SalesPerson&gt; из XML:

```sql
WITH xml_data AS (
    SELECT xmlparse(document '<Order OrderID="1000" OrderDate="2021-10-01">
                                <LineItem ProductID="1" Price="19.99" Quantity="2" />
                                <SalesPerson>Alice</SalesPerson>
                              </Order>')::text AS xml_text
)
SELECT xmlparse(document regexp_replace(xml_text, '<SalesPerson>.*?</SalesPerson>', '', 'g'))::xml AS UpdatedXML
FROM xml_data;
```

Этот запрос:

- Использует регулярное выражение для удаления узла &lt;SalesPerson&gt;.
- Результат преобразуется обратно в xml.

Таким образом, в PostgreSQL обновление, добавление и удаление XML узлов выполняются с помощью преобразования XML в текст
и обратно, так как встроенные методы модификации отсутствуют.

### Извлечение данных из XML с помощью метода nodes в PostgreSQL

В SQL Server метод nodes используется для разбиения XML на набор строк, где каждый узел XML представляется как отдельная
строка. В PostgreSQL аналогичный функционал можно реализовать с помощью комбинации функций xmltable и xpath.

### Использование xmltable для преобразования XML в реляционное представление

Функция xmltable в PostgreSQL позволяет преобразовывать XML данные в табличное представление. Она извлекает узлы на
основании пути XPath и может возвращать несколько строк, имитируя поведение метода nodes.

Пример преобразования элементов XML в строки таблицы:

```sql
SELECT x.productid::int AS ProductID,
       x.price::numeric AS Price,
       x.quantity::int AS Quantity
FROM xmltable(
    '//LineItem' PASSING xmlparse(document
    '<Order OrderID="1000" OrderDate="2021-10-01">
         <LineItem ProductID="1" Price="19.99" Quantity="2" />
         <LineItem ProductID="2" Price="29.99" Quantity="1" />
     </Order>')
    COLUMNS
        productid int PATH '@ProductID',
        price numeric PATH '@Price',
        quantity int PATH '@Quantity'
) AS x;
```

В этом примере:

- xmltable разбивает каждый элемент LineItem на отдельные строки.
- Каждая строка содержит значения ProductID, Price, и Quantity.

### Использование xpath для извлечения данных из узлов и их атрибутов

Функция xpath также может быть использована для извлечения данных из XML с созданием массивов значений на основании
пути. Затем массив можно преобразовать в строки с помощью unnest.

Пример использования xpath для извлечения значений:

```sql
SELECT unnest(xpath('//LineItem/@ProductID', xml_data::xml))::text AS ProductID,
       unnest(xpath('//LineItem/@Price', xml_data::xml))::numeric AS Price,
       unnest(xpath('//LineItem/@Quantity', xml_data::xml))::int AS Quantity
FROM (VALUES (
    '<Order OrderID="1000" OrderDate="2021-10-01">
         <LineItem ProductID="1" Price="19.99" Quantity="2" />
         <LineItem ProductID="2" Price="29.99" Quantity="1" />
     </Order>'
)) AS t(xml_data);
```

Этот запрос:

- Извлекает атрибуты ProductID, Price, и Quantity для каждого элемента LineItem.
- Преобразует массивы, полученные из xpath, в строки с помощью unnest, что позволяет работать с каждым узлом LineItem в
  отдельной строке.

## Заключение

Использование xmltable, xpath, и unnest в PostgreSQL позволяет гибко работать с XML-данными, извлекая их в табличное
представление, что эквивалентно работе с nodes в SQL Server. Эти функции предоставляют мощные средства для разбора XML,
формирования запросов к данным и конвертации XML в реляционный формат, что делает PostgreSQL хорошей альтернативой для
работы с XML без необходимости использования SQL Server.

---

## Практика: Получение данных из реляционных таблиц формата XML в PostgreSQL

**Цель работы:** приобретение навыков трансформации данных из реляционного формата в формат XML в среде PostgreSQL.

**Введение**

В PostgreSQL для получения данных в формате XML можно использовать функцию FOR XML, которая позволяет преобразовывать
результат SQL-запросов в XML-структуру. В PostgreSQL есть функции для работы с XML, такие как xmlagg(), xmlelement() и
другие. Преобразование данных в XML позволяет управлять выводом с помощью различных опций, например, с использованием
тегов для структурирования документа.

**Задание**

Выполнив пункты 1–12, нужно выяснить назначение каждого из режимов и опций работы с XML, а затем выполнить задания 13-16
для получения XML-документов в заданном формате.

**Запросы в PostgreSQL с использованием XML-функций**

1. Выполнить запрос в режиме RAW (с использованием xmlagg):

```sql
SELECT xmlagg(
           xmlelement(name "Customer",
                      Cust.CustomerID AS CustID,
                      Cust.CustomerType,
                      [Order].SalesOrderID)
       ) AS xml_output
FROM Sales.Customer Cust
JOIN Sales.SalesOrderHeader [Order]
ON Cust.CustomerID = [Order].CustomerID
ORDER BY Cust.CustomerID;
```

2. Выполнить запрос с добавлением опции ELEMENTS:

```sql
SELECT xmlagg(
           xmlelement(name "Customer",
                      xmlelement(name "CustID", Cust.CustomerID),
                      xmlelement(name "CustomerType", Cust.CustomerType),
                      xmlelement(name "SalesOrderID", [Order].SalesOrderID)
           )
       ) AS xml_output
FROM Sales.Customer Cust
JOIN Sales.SalesOrderHeader [Order]
ON Cust.CustomerID = [Order].CustomerID
ORDER BY Cust.CustomerID;
```

3. Выполнить запрос, изменив структуру XML:

```sql
SELECT xmlelement(name "Orders",
           xmlagg(
               xmlelement(name "Order",
                          Cust.CustomerID AS CustID,
                          Cust.CustomerType,
                          [Order].SalesOrderID)
           )
       ) AS xml_output
FROM Sales.Customer Cust
JOIN Sales.SalesOrderHeader [Order]
ON Cust.CustomerID = [Order].CustomerID
ORDER BY Cust.CustomerID;
```

**Получение вложенных XML-документов**

4. Выполните запрос с использованием объединения JOIN:

```sql
SELECT xmlagg(
           xmlelement(name "Customer",
                      xmlelement(name "CustID", Cust.CustomerID),
                      xmlelement(name "CustomerType", Cust.CustomerType),
                      xmlelement(name "SalesOrderID", [Order].SalesOrderID)
           )
       ) AS xml_output
FROM Sales.Customer Cust
JOIN Sales.SalesOrderHeader [Order]
ON Cust.CustomerID = [Order].CustomerID
ORDER BY Cust.CustomerID;
```

5. Использование подзапроса с опцией TYPE:

```sql
SELECT xmlagg(
           xmlelement(name "Category",
                      Category.Name AS CategoryName,
                      (
                          SELECT xmlagg(
                                     xmlelement(name "SubCategory",
                                                SubCategory.Name AS SubCategoryName
                                     )
                          )
                          FROM Production.ProductSubCategory SubCategory
                          WHERE SubCategory.ProductCategoryID = Category.ProductCategoryID
                          FOR XML PATH, TYPE
                      )
           )
       ) AS xml_output
FROM Production.ProductCategory Category;
```

**Задания на вывод данных в формате XML:**

6. Выведите информацию об авторах книг в формате:

```xml
<Authors>
  <Author ID="1" First="Alex" Last="Pushkin"/>
  <Author ID="2" First="Nikolay" Last="Gogol"/>
  ...
</Authors>
```

Пример запроса:

```sql
SELECT xmlelement(name "Authors",
       xmlagg(
           xmlelement(name "Author",
                      xmlelement(name "ID", AuthorID),
                      xmlelement(name "First", FirstName),
                      xmlelement(name "Last", LastName)
           )
       )
) AS xml_output
FROM Authors;
```

7. Выведите информацию об авторах книг в следующем формате:

```xml
<Authors>
  <Author>
    <ID>1</ID>
    <First>Alex</First>
    <Last>Pushkin</Last>
  </Author>
  ...
</Authors>
```

Пример запроса:

```sql
SELECT xmlelement(name "Authors",
       xmlagg(
           xmlelement(name "Author",
                      xmlelement(name "ID", AuthorID),
                      xmlelement(name "First", FirstName),
                      xmlelement(name "Last", LastName)
           )
       )
) AS xml_output
FROM Authors;
```

8. Выведите информацию об авторах в следующем формате:

```xml
<Author ID="1">
  <First>Alex</First>
  <Last>Pushkin</Last>
</Author>
```

Пример запроса:

```sql
SELECT xmlelement(name "Author",
       xmlelement(name "ID", AuthorID),
       xmlelement(name "First", FirstName),
       xmlelement(name "Last", LastName)
) AS xml_output
FROM Authors;
```

9. Выведите информацию о книгах и их авторах в следующем формате:

```xml
<book>
  <bookID>1</bookID>
  <title>Eugeniy Onegin</title>
  <author>Pushkin</author>
</book>
```

Пример запроса:

```sql
SELECT xmlelement(name "book",
       xmlelement(name "bookID", BookID),
       xmlelement(name "title", BookTitle),
       xmlelement(name "author", AuthorName)
) AS xml_output
FROM Books
JOIN Authors ON Books.AuthorID = Authors.AuthorID;
```

**Завершение работы**

После выполнения всех шагов сохраните скрипт лабораторной работы для отчёта.
