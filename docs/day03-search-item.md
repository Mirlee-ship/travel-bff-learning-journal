\# Day 3：旅行社商品统一检索接口 searchItem



\## 一、当天学习目标



Day 3 学习旅行社商品检索接口 `searchItem`。



该接口通过一套统一参数，承接：



\- 关键词搜索

\- 标签筛选

\- 零售价筛选

\- 结算价筛选

\- 行程天数筛选

\- 供给来源筛选

\- 多种排序

\- 分页查询

\- 商品关联信息补充



核心目标是理解一个页面请求如何从查询参数，最终转换成前端需要的 `data + total`。



\---



\## 二、业务背景



旅行社商品页面需要支持关键词、价格、行程天数、供给来源和排序等多种查询操作。



如果为每种操作分别设计接口，前端需要维护多套协议，组合条件也会变得复杂。



因此项目使用统一商品检索接口，由同一个 `searchItem` 根据参数组合处理不同查询场景。



接口示例：



```text

POST /commodity/search-item

```



核心实现位置：



```text

src/cloud/functions/biz/commodity/service/search.ts

```



核心方法：



```text

searchItem

```



\---



\## 三、关键入参



```text

keyword

tagId

minSalePrice

maxSalePrice

minSettlementPrice

maxSettlementPrice

minCostDays

maxCostDays

isTravelAgent

supplySource

sortType

pageIndex

pageSize

```



参数与数据库字段的部分对应关系：



```text

minSalePrice / maxSalePrice

→ itemSalePrice



minSettlementPrice / maxSettlementPrice

→ storeSettlementPrice



minCostDays / maxCostDays

→ travelDays

```



\---



\## 四、核心调用链



```text

旅行社商品页面

→ POST /commodity/search-item

→ searchItem(req)

→ 根据关键词或标签获得候选商品 ID

→ 动态组装筛选条件

→ 构建列表 SQL 和总数 SQL

→ 添加排序与分页

→ Promise.all 并行查询列表和总数

→ 批量补充商品头图与关联城市

→ 解析标签并计算利润

→ 返回 data + total

```



\---



\## 五、分页默认值



```ts

const pageIndex = req.pageIndex || 0

const pageSize = req.pageSize || 10

```



含义：



```text

未传 pageIndex

→ 默认第 0 页



未传 pageSize

→ 默认每页 10 条

```



分页从 0 开始：



```text

第 1 页：pageIndex = 0

第 2 页：pageIndex = 1

第 3 页：pageIndex = 2

```



分页偏移量：



```text

offset = pageIndex × pageSize

```



\---



\## 六、关键词为什么先转换成商品 ID



关键词不会直接在主 SQL 中写成简单的 `itemName LIKE`。



代码先复用已有搜索服务：



```text

keyword

→ commonSearchItem

→ 候选商品 ID

```



例如：



```text

“云南”

→ item-001

→ item-003

→ item-008

```



之后再在候选商品中继续执行价格、行程天数和来源筛选。



这是一种两阶段查询：



```text

第一阶段：

文本搜索确定候选商品范围



第二阶段：

结构化条件进一步过滤

```



如果关键词没有命中任何商品，则直接返回：



```json

{

&#x20; "data": \[],

&#x20; "total": 0

}

```



\---



\## 七、标签为什么也转换成商品 ID



标签和商品之间可能通过独立的关系数据维护。



查询流程：



```text

tagId

→ 查询标签记录

→ 得到 itemIdList

→ 使用 Set 去重

→ 得到候选商品 ID

```



候选集为空时提前返回，可以避免后续无意义数据库查询。



\---



\## 八、动态查询条件



代码使用两个数组：



```ts

const conditions: string\[] = \[]

const queryParams: any\[] = \[]

```



`conditions` 保存 SQL 条件模板：



```ts

\[

&#x20; "ISI.itemSalePrice BETWEEN ? AND ?",

&#x20; "ISI.travelDays BETWEEN ? AND ?",

&#x20; "ISI.supplySource = ?"

]

```



`queryParams` 保存实际参数值：



```ts

\[

&#x20; 100000,

&#x20; 500000,

&#x20; 3,

&#x20; 7,

&#x20; "DEMO\_SOURCE"

]

```



这样可以根据用户实际传入的参数，动态组合查询条件。



\---



\## 九、参数化查询



查询条件使用占位符：



```ts

conditions.push("ISI.supplySource = ?")

queryParams.push(req.supplySource)

```



而不是直接把用户输入拼接到 SQL。



作用：



\- 查询结构与用户数据分离

\- 降低 SQL 注入风险

\- 更容易维护动态条件



\---



\## 十、区间筛选



价格、结算价和行程天数都支持三种形式。



同时有最小值和最大值：



```sql

BETWEEN ? AND ?

```



只有最小值：



```sql

>= ?

```



只有最大值：



```sql

<= ?

```



例如：



```text

minSalePrice = 100000

maxSalePrice = 500000

```



对应：



```sql

ISI.itemSalePrice BETWEEN ? AND ?

```



\---



\## 十一、排序方式



接口支持：



```text

SALE\_PRICE\_ASC

SALE\_PRICE\_DESC

SETTLEMENT\_PRICE\_ASC

SETTLEMENT\_PRICE\_DESC

PROFIT\_ASC

PROFIT\_DESC

```



利润计算：



```text

利润 = 零售价 - 结算价

```



利润降序对应：



```sql

ORDER BY

&#x20; (ISI.itemSalePrice - ISI.storeSettlementPrice)

&#x20; DESC

```



没有传排序，或排序值无法识别时，默认：



```sql

ORDER BY ISI.itemSalePrice DESC

```



\---



\## 十二、分页



分页 SQL：



```text

LIMIT pageIndex × pageSize, pageSize

```



例如：



```text

pageIndex = 0

pageSize = 10

```



对应：



```sql

LIMIT 0, 10

```



第二页：



```sql

LIMIT 10, 10

```



第三页：



```sql

LIMIT 20, 10

```



\---



\## 十三、为什么同时查询列表和总数



列表查询返回当前页商品。



总数查询返回所有符合条件的商品数量。



例如：



```json

{

&#x20; "data": \[

&#x20;   "当前页 10 条商品"

&#x20; ],

&#x20; "total": 87

}

```



前端依靠 `total` 计算总页数和分页状态。



列表 SQL 包含：



```text

ORDER BY

LIMIT

```



总数 SQL 使用：



```sql

SELECT COUNT(\*) AS count

```



两条查询使用相同的筛选条件。



\---



\## 十四、Promise.all 并行查询



列表查询和总数查询没有相互依赖，因此使用：



```ts

const \[queryResult, countResult] = await Promise.all(\[

&#x20; executeQuery(listSql, queryParams, true),

&#x20; executeQuery(countSql, queryParams, true),

])

```



并行查询可以减少总体等待时间。



注意：



```text

Promise.all 不是只查询一次

而是让两次独立查询同时开始

```



\---



\## 十五、空结果处理



查询正常完成，但没有商品时返回：



```json

{

&#x20; "data": \[],

&#x20; "total": 0

}

```



这属于正常业务结果，不属于接口异常。



最终外层响应可能是：



```json

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "data": \[],

&#x20;   "total": 0

&#x20; }

}

```



\---



\## 十六、批量补充头图



主查询得到当前页商品后，先收集全部商品 ID：



```ts

const resultItemIds = queryResult.map((item) => item.id)

```



然后通过一次批量查询获取头图。



这样避免：



```text

10 个商品

→ 分别查询 10 次头图

```



而是：



```text

10 个商品 ID

→ 一次查询全部头图

```



\---



\## 十七、批量补充城市



城市信息通过批量服务调用获取：



```text

queryItemRelatedCity({

&#x20; itemIds: resultItemIds

})

```



得到商品 ID 到城市列表的映射，再合并进最终商品结构。



头图和城市都使用批量查询，可以避免 N+1 查询问题。



\---



\## 十八、标签解析



数据库中的标签可能是分号分隔字符串：



```text

亲子游;纯玩;六日游

```



服务层会：



```text

按分号切分

→ 去除空格

→ 删除空字符串

→ 转换为数组

```



返回：



```json

\[

&#x20; "亲子游",

&#x20; "纯玩",

&#x20; "六日游"

]

```



\---



\## 十九、利润计算



```text

profit = itemSalePrice - storeSettlementPrice

```



如果计算结果小于 0，页面返回值会处理为 0。



需要注意：



```text

SQL 排序使用原始利润值

页面展示可能将负利润处理为 0

```



排序口径与展示口径可能存在细微差异。



\---



\## 二十、最终返回字段



最终列表主要包括：



```text

id

headPic

itemName

categoryOne

categoryTwo

tags

cities

salePrice

settlementPrice

profit

profitRate

isTravelAgent

supplySource

travelDays

```



业务函数最终返回：



```json

{

&#x20; "data": \[],

&#x20; "total": 0

}

```



\---



\## 二十一、完整脱敏案例



请求：



```json

{

&#x20; "keyword": "云南",

&#x20; "minSalePrice": 100000,

&#x20; "maxSalePrice": 500000,

&#x20; "minCostDays": 3,

&#x20; "maxCostDays": 7,

&#x20; "supplySource": "DEMO\_SOURCE",

&#x20; "sortType": "PROFIT\_DESC",

&#x20; "pageIndex": 0,

&#x20; "pageSize": 10

}

```



执行过程：



```text

“云南”

→ 搜索服务得到候选商品 ID



候选商品 ID

\+ 价格区间

\+ 行程天数

\+ 供给来源

→ 动态 SQL



列表查询

\+ COUNT 查询

→ Promise.all 并行执行



当前页商品

→ 批量查询头图

→ 批量查询城市

→ 解析标签

→ 计算利润



最终返回

→ data + total

```



\---



\## 二十二、技术价值



该接口不只是简单 CRUD，而是包含：



\- 关键词候选集查询

\- 标签关系查询

\- 动态 SQL 条件

\- 参数化查询

\- 多种业务排序

\- 分页

\- 列表和总数并行查询

\- 头图批量查询

\- 城市跨服务补充

\- 标签格式转换

\- 利润计算

\- 页面模型组装



更准确的定位是：



```text

面向旅行社商品页面的检索与数据聚合服务

```



\---



\## 二十三、潜在优化点



\- 关键词候选集最多先取固定数量，可能存在截断

\- 候选商品 ID 过多时，IN 条件可能过长

\- 分页参数需要数值和最大值校验

\- 标签与关键词同时存在时，需要明确交集或覆盖语义

\- 负利润排序口径与页面展示口径可能不同



这些属于代码理解和优化思考，不代表本人已经完成相关改造。



\---



\## 二十四、职责边界



可以说明：



\- 参与商品检索接口开发和联调

\- 理解参数组合与动态筛选

\- 处理排序、分页和返回字段组装

\- 验证成功、空结果等接口场景

\- 通过代码和请求证据复盘调用链



不能夸大为：



\- 独立设计整个搜索平台

\- 独立设计数据库搜索架构

\- 实现完整搜索引擎

\- 重构全部商品系统



\---



\## 二十五、Day 3 核心结论



```text

先通过关键词或标签确定候选商品

→ 再执行价格、天数和来源筛选

→ 按业务字段排序

→ 查询当前页和总数

→ 批量补充关联信息

→ 返回 data + total

```

