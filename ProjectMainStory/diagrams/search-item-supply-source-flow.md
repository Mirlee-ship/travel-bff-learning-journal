Search Item Supply Source Flow

Full call chain

flowchart TD

&#x20;   A\["Travel agency search page"] --> B\["POST commodity search item"]

&#x20;   B --> C\["Biz cloud function entry"]

&#x20;   C --> D\["Read module service and function"]

&#x20;   D --> E\["Load commodity search service"]

&#x20;   E --> F\["Call searchItem"]

&#x20;   F --> G\["Read supplySource request"]

&#x20;   G --> H{"supplySource exists"}

&#x20;   H -->|No| I\["Keep original query conditions"]

&#x20;   H -->|Yes| J\["Add ISI supplySource condition"]

&#x20;   J --> K\["Push value into queryParams"]

&#x20;   I --> L\["Build SQL query"]

&#x20;   K --> L

&#x20;   L --> M\["Query ItemSearchInfo"]

&#x20;   M --> N\["Receive queryResult"]

&#x20;   N --> O\["Map database rows"]

&#x20;   O --> P\["Return supplySource field"]

&#x20;   P --> Q\["Build data and total response"]

&#x20;   Q --> R\["Frontend renders search result"]

简化调用链

旅行社商品搜索页

→ POST /commodity/search-item

→ biz 云函数统一入口

→ commodity / search / searchItem

→ 读取 supplySource

→ SQL WHERE 筛选

→ SQL SELECT 查询字段

→ queryResult

→ map

→ 最终响应

→ 前端展示

字段透传链路

请求字段：

supplySource = 自营



SQL 条件：

ISI.supplySource = ?



SQL 查询：

ISI.supplySource



查询结果：

queryResult.supplySource



返回映射：

supplySource: item.supplySource || ''



最终响应：

data.data\[].supplySource

面试讲解重点

请求值是“自营”或“代卖”。

WHERE 负责筛选，SELECT 负责查询字段。

queryResult 是 MySQL 原始查询结果。

map 负责转换成前端响应模型。

只修改 SQL 不一定能让前端获得字段。

任务通过云函数测试、日志、联调和 Review 完成。

