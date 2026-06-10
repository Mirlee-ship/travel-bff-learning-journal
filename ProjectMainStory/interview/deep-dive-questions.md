商品搜索字段扩展：高频追问

Q1：你具体修改了哪些位置？



答：



请求类型

供给来源枚举

SQL WHERE 条件

SELECT 查询字段

queryResult 类型

map 返回结构

响应类型

测试 JSON

接口文档



面试时可以说“修改或确认”，不要把原本已存在的代码全部说成自己新增。



Q2：为什么 WHERE 和 SELECT 都要处理？



答：



WHERE 决定按照供给来源筛选哪些商品。



SELECT 决定查询结果是否包含供给来源。



只改 WHERE，前端可能能够筛选，但拿不到字段。



只改 SELECT，前端能看到字段，但不能按字段筛选。



Q3：为什么只改 SQL 还不够？



答：



SQL 结果还会进入 queryResult，再经过 queryResult.map 组装前端响应。



如果 map 没有透传字段，数据库已经查到的字段仍然不会出现在最终响应中。



Q4：为什么传“自营”，不是 SELF？



答：



SELF 是 TypeScript 枚举键，对应的实际枚举值是“自营”。



接口传输和数据库比较使用枚举值，所以请求应该传“自营”或“代卖”。



Q5：ISI 是什么？



答：



ISI 是 MySQL 表 ItemSearchInfo 的查询别名。



SQL 中：



ISI.supplySource



表示查询 ItemSearchInfo 表的 supplySource 字段。



Q6：问号有什么作用？



答：



ISI.supplySource = ?



中的问号是参数占位符。



实际值通过 queryParams 传入，避免直接把用户输入拼接到 SQL 字符串中。



Q7：queryResult 是什么？



答：



queryResult 是 SQL 执行后返回的原始商品列表。



项目为查询结果定义 TypeScript 类型，然后通过 map 转成前端需要的响应结构。



Q8：为什么写 item.supplySource || 空字符串？



答：



用于处理字段为空的情况，保证前端得到字符串，而不是直接得到 undefined。



更严格的实现也可以根据业务区分字段缺失和空字符串。



Q9：你怎么测试？



答：



使用内部云函数调用 JSON：



moduleName = commodity

serviceName = search

funcName = searchItem



在 param 中加入：



supplySource

pageIndex

pageSize



推送云函数后，在微信云函数测试环境执行，并查看响应和日志。



Q10：测试了哪些场景？



答：



不传 supplySource

传“自营”

传“代卖”

传非法值

没有匹配数据

分页正常

响应字段存在



非法值是否已在生产代码中严格校验，需要以真实源码为准。



Q11：接口报错怎么查？



答：



具体报错已经记不清，不能虚构。



可以确认排查路径：



检查测试 JSON

→ 检查枚举值

→ 查看云函数日志

→ 确认是否进入 searchItem

→ 检查 SQL

→ 检查 queryResult

→ 检查 map

→ 检查最终响应

Q12：这个任务最难的地方是什么？



答：



最难的不是 SQL 本身，而是刚进入项目时不熟悉分层。



需要从 searchItem 的 result 逐层找到云函数路由、SQL、queryResult 和 map，确认字段应该在哪些位置处理。



Q13：这个任务代码量很少，有什么价值？



答：



代码量确实不大，但覆盖了一次完整后端开发闭环：



需求理解

代码定位

SQL 修改

类型和返回映射

云函数测试

日志排查

前端联调

文档

Review



我不会把它包装成大型架构设计，但可以讲清楚每一步为什么做、怎么验证。



Q14：你设计了 ItemSearchInfo 吗？



答：



没有。



ItemSearchInfo、云函数路由和商品搜索整体结构是项目已有能力。



我参与的是现有搜索链路中的具体字段扩展、测试和联调。



Q15：为什么这个接口不是一日聚订单接口？



答：



searchItem 属于 commodity 商品模块，并固定查询跟团游和周边游商品。



一日聚订单后台使用的是订单链路，例如：



trade-bff / web / queryOrderForParty



两者属于不同业务链路。

