商品搜索字段扩展：5～10 分钟讲解稿

一、业务背景



我实习期间参与过一个比较完整的后端接口改造，发生在 TheVitality 项目的旅行社商品检索页。



这个页面主要检索跟团游和周边游商品，支持关键词、价格、行程天数、供给来源和排序等条件。



前端需要增加“供给来源”筛选，同时在搜索结果中返回供给来源，用来区分自营和代卖商品。



字段名是：



supplySource



业务值是：



自营

代卖

二、定位接口



带教给了我 searchItem 方法名。



方法位于：



src/cloud/functions/biz/commodity/service/search.ts



对外接口：



POST /commodity/search-item



内部路由：



moduleName = commodity

serviceName = search

funcName = searchItem



请求进入 biz/index.ts 后，会根据三个路由字段加载商品搜索 Service，再调用 searchItem。



三、请求参数



请求类型中定义：



supplySource?: SupplySource



枚举定义：



export enum SupplySource {

&#x20; SELF = '自营',

&#x20; AGENT = '代卖',

}



接口实际传入的是：



“自营”或“代卖”



而不是：



SELF 或 AGENT



如果前端传错枚举值，就可能导致数据库筛选不到数据。



四、SQL 查询条件



当请求包含供给来源时：



if (req.supplySource) {

&#x20; conditions.push('ISI.supplySource = ?')

&#x20; queryParams.push(req.supplySource)

}



ISI 是 ItemSearchInfo 的表别名。



问号是查询参数占位符，具体值通过 queryParams 传入。



因为字段是可选的，所以不传时不能影响原有搜索逻辑。



五、SELECT 查询字段



前端不仅要筛选，还要在结果中看到供给来源。



因此 SELECT 中也要查询：



ISI.supplySource



WHERE 和 SELECT 的职责不同：



WHERE 决定筛选哪些商品

SELECT 决定查询结果包含哪些字段

六、queryResult 和 map



SQL 执行后，结果进入：



queryResult



其中：



supplySource: string



项目不会直接把数据库结果原样返回，而是通过：



queryResult.map(...)



组装前端模型。



最终映射：



supplySource: item.supplySource || ''



完整链路：



请求参数

→ SQL WHERE

→ SQL SELECT

→ queryResult

→ map

→ 接口响应

七、测试和联调



修改后，我更新了接口测试 JSON，重新推送云函数，并在微信云函数测试环境执行。



重点测试：



不传 supplySource

传“自营”

传“代卖”

没有匹配数据

分页是否正常

返回字段是否存在



测试过程中我会查看：



请求参数

接口响应

云函数日志

queryResult

最终 result



前端联调期间出现过接口报错。



具体报错内容因为时间较久已经记不清，所以我不会虚构错误原因。



我可以确认自己的排查路径是：



测试 JSON

→ 枚举值

→ 云函数入口

→ searchItem

→ SQL

→ queryResult

→ map

→ 最终响应



最后代码通过带教 Review 和测试验证，同时补充了接口名称、请求参数和示例 JSON。



八、难点和收获



代码改动量不大，难点在于刚进入项目时不熟悉调用链。



我需要从 searchItem 的 result 反向找到：



云函数路由

请求参数

SQL 查询

queryResult

map

最终响应



这次任务让我理解了，后端增加字段不是只增加一行 SQL，而是要保证请求、查询和响应整条链路一致。



九、职责边界



我负责的是：



现有搜索接口中的字段扩展

测试

日志排查

接口文档

前端联调



我没有负责：



整个商品搜索系统设计

ItemSearchInfo 表结构设计

云函数基础设施搭建

完整 commodity 模块开发

