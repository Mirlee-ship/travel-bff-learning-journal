searchItem 商品搜索接口 supplySource 字段扩展

一、业务背景



旅行社商品检索页用于查询：



跟团游

周边游



页面支持：



关键词

售价范围

行程天数

供给来源

排序

分页



本次需求是在搜索接口中增加或完善：



供给来源筛选

供给来源返回字段



字段名称：



supplySource



业务值：



自营

代卖

二、代码入口



核心文件：



src/cloud/functions/biz/commodity/service/search.ts



核心方法：



commoditySearchService.searchItem



服务导出：



export default commoditySearchService



请求类型文件：



src/cloud/functions/biz/commodity/service/types.d.ts

三、接口路由



对外 HTTP：



POST /commodity/search-item



为了保护公司信息，仓库中不保存真实测试环境域名。



内部云函数调用：



{

&#x20; "moduleName": "commodity",

&#x20; "serviceName": "search",

&#x20; "funcName": "searchItem",

&#x20; "param": {}

}



统一入口根据：



moduleName

serviceName

funcName



定位到 searchItem。



四、请求类型



字段定义：



supplySource?: SupplySource



枚举：



export enum SupplySource {

&#x20; /\*\* 自营 \*/

&#x20; SELF = '自营',



&#x20; /\*\* 代卖 \*/

&#x20; AGENT = '代卖',

}



需要注意：



SELF 和 AGENT 是 TypeScript 枚举键。



接口实际传输的是枚举值：

“自营”或“代卖”。



错误示例：



{

&#x20; "supplySource": "SELF"

}



正确示例：



{

&#x20; "supplySource": "自营"

}

五、SQL 筛选条件



当请求包含 supplySource 时：



if (req.supplySource) {

&#x20; conditions.push('ISI.supplySource = ?')

&#x20; queryParams.push(req.supplySource)

}



含义：



ISI 是 ItemSearchInfo 的表别名。



问号是查询参数占位符。



具体值通过 queryParams 传入。



这样只有在前端传入供给来源时，才增加该条件。



没有传入时，不影响原有查询。



六、SQL 查询字段



数据库表：



ItemSearchInfo



字段：



supplySource



SQL 的 SELECT 中需要包含：



ISI.supplySource



WHERE 和 SELECT 的职责不同：



WHERE：

决定筛选哪些商品



SELECT：

决定查询结果中包含哪些字段

七、queryResult



SQL 执行结果进入：



queryResult



它可以理解为：



MySQL 返回的原始商品列表



结果类型中包含：



{

&#x20; id: string

&#x20; itemName: string

&#x20; categoryOne: string

&#x20; categoryTwo: string

&#x20; itemSalePrice: number

&#x20; itemTags: string

&#x20; itemFeatures: string

&#x20; storeSettlementPrice: number

&#x20; storeProfitRate: number

&#x20; isTravelAgent: number

&#x20; supplySource: string

&#x20; travelDays: number

}



supplySource 类型为：



string

八、map 返回映射



查询结果不会直接原样返回前端。



项目会执行：



queryResult.map((item) => {

&#x20; return {

&#x20;   supplySource: item.supplySource || '',

&#x20; }

})



这里完成：



数据库查询结果

→ 前端响应模型



使用：



item.supplySource || ''



可以在字段为空时返回空字符串，避免前端直接拿到 undefined。



九、响应结构



最终响应结构可以理解为：



{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "data": \[

&#x20;     {

&#x20;       "id": "demo-item-id",

&#x20;       "supplySource": "自营"

&#x20;     }

&#x20;   ],

&#x20;   "total": 100

&#x20; },

&#x20; "message": "success",

&#x20; "requestId": "demo-request-id"

}



其中：



data.data：

当前页商品列表



data.total：

符合条件的商品总数

十、测试过程



修改完成后：



1\. 更新云函数测试 JSON

2\. 推送云函数

3\. 在微信云函数测试环境调用

4\. 查看接口响应

5\. 查看云函数日志

6\. 配合前端联调

7\. 提交带教 Review

8\. 由测试验证



重点测试：



不传 supplySource

传“自营”

传“代卖”

传非法枚举值

没有匹配数据

分页是否正常

最终响应是否包含 supplySource

十一、接口报错排查



由于时间较久，具体错误内容已经记不清，因此面试时不能虚构错误原因。



可以确认的排查路径：



检查测试 JSON

→ 检查 supplySource 枚举值

→ 查看请求是否进入 searchItem

→ 查看 SQL 是否正常执行

→ 查看 queryResult 是否包含字段

→ 查看 map 是否正确返回

→ 查看最终响应

十二、为什么这个任务有代表性



这个需求覆盖了一次完整后端开发闭环：



需求理解

→ 代码定位

→ 动态路由理解

→ 请求类型修改

→ SQL 条件和字段

→ 查询结果类型

→ 返回模型映射

→ 云函数测试

→ 日志排查

→ 前端联调

→ 接口文档

→ Review 和验收



代码改动不大，但能够证明我真实参与过项目，并理解字段如何从数据库贯通到前端

