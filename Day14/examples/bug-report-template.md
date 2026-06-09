Day14 Bug 记录模板

环境

测试环境 / 预发布环境 / 生产环境

页面

一日聚订单列表

操作步骤

1\. 进入一日聚订单页

2\. 选择“待供应商确认”

3\. 输入商品名称“露营”

4\. 点击查询

接口

moduleName: trade-bff

serviceName: web

funcName: queryOrderForParty

请求参数

{

&#x20; "statusList": \["PENDING\_FOR\_SUPPLIER"],

&#x20; "categoryList": \["ONE\_SECOND\_PARTY"],

&#x20; "itemName": "露营",

&#x20; "pageIndex": 0,

&#x20; "pageSize": 20

}

实际结果

接口 success=true，但 list=\[]、total=0。

预期结果

测试数据中应存在一条符合条件的订单。

定位信息

发生时间：2026-06-01 10:00

traceId：demo-trace-id-014

requestId：demo-request-id-014

是否必现：是

附件

Network Payload 截图

Response 截图

页面结果截图

数据安全

截图和请求内容必须脱敏，

不能包含真实手机号、证件号、token 和用户标识。

