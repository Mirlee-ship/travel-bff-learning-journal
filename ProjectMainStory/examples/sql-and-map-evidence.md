supplySource SQL 与返回映射证据

一、请求类型

supplySource?: SupplySource

二、枚举值

export enum SupplySource {

&#x20; SELF = '自营',

&#x20; AGENT = '代卖',

}



接口传入：



{

&#x20; "supplySource": "自营"

}



不是：



{

&#x20; "supplySource": "SELF"

}

三、SQL 条件

if (req.supplySource) {

&#x20; conditions.push('ISI.supplySource = ?')

&#x20; queryParams.push(req.supplySource)

}



说明：



ISI 是 ItemSearchInfo 的表别名。

使用参数占位符传入实际业务值。

四、SELECT 字段

SELECT

&#x20; ISI.id,

&#x20; ISI.itemName,

&#x20; ISI.supplySource

FROM ItemSearchInfo ISI



这是脱敏后的示意代码，仅保留与本次任务有关的字段。



五、queryResult 类型

type SearchItemQueryResult = {

&#x20; id: string

&#x20; itemName: string

&#x20; supplySource: string

}



项目真实类型还包含售价、标签、利润率和行程天数等字段。



六、map 返回映射

const data = queryResult.map((item) => {

&#x20; return {

&#x20;   id: item.id,

&#x20;   itemName: item.itemName,

&#x20;   supplySource: item.supplySource || '',

&#x20; }

})

七、完整字段链路

req.supplySource

→ queryParams

→ ISI.supplySource = ?

→ SELECT ISI.supplySource

→ queryResult.supplySource

→ map.supplySource

→ data.data\[].supplySource

八、为什么不能只改一处

只改 WHERE

可以按供给来源筛选，

但响应中可能没有 supplySource。

只改 SELECT

响应可能包含字段，

但前端不能按供给来源筛选。

不修改 map

数据库已经查询到字段，

但最终响应可能没有透传。

枚举值错误

前端传 SELF，

数据库保存“自营”，

查询结果可能为空。

九、安全说明



本文件只保留了和面试讲解有关的脱敏代码。



未包含：



真实数据库配置

真实测试域名

token

客户数据

公司完整业务代码

