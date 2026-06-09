Day14 学习记录：接口测试、联调与错误定位

一、今天学什么



今天学习如何验证接口和定位问题。



核心路径：



页面操作

→ 网络请求

→ 路由字段

→ 业务参数

→ 后端响应

→ 页面展示

→ 日志定位

二、第一步：确认页面操作



首先记录：



进入哪个页面

点击哪个按钮

选择哪些筛选条件

页面预期展示什么



例如：



进入一日聚订单页

选择待供应商确认

输入商品名“露营”

点击查询

预期出现符合条件的订单

三、第二步：查看 Network



浏览器中按：



F12



打开：



Network

→ Fetch/XHR



重新点击查询。



检查是否存在对应请求。



如果没有新请求，优先排查：



按钮点击事件

表单校验

前端 JavaScript 报错

按钮禁用状态

四、第三步：核对路由字段



统一入口通过三个字段定位业务方法：



moduleName

serviceName

funcName



例如：



trade-bff

web

queryOrderForParty



常见问题：



funcName 拼错

serviceName 错误

调用了错误模块

复制了旧接口名称

五、第四步：核对业务参数



重点检查：



参数有没有遗漏

参数名有没有拼错

字符串和数字类型是否正确

枚举值是否正确

时间是秒还是毫秒

pageIndex 从 0 还是 1 开始

筛选条件是否与页面一致

分页问题



例如：



pageIndex = 9

pageSize = 20

total = 15



接口可能返回：



{

&#x20; "list": \[],

&#x20; "total": 15

}



因为当前页已经超出数据范围。



时间问题

1710000000



是秒级时间戳。



1710000000000



是毫秒级时间戳。



两者相差 1000 倍。



六、第五步：判断响应类型

成功有数据

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "list": \[

&#x20;     {

&#x20;       "orderNo": "demo-order-001"

&#x20;     }

&#x20;   ],

&#x20;   "total": 1

&#x20; }

}



说明接口和业务查询正常。



成功空结果

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "list": \[],

&#x20;   "total": 0

&#x20; }

}



说明接口正常执行，但当前条件没有匹配数据。



业务失败

{

&#x20; "success": false,

&#x20; "message": "无权查看该订单",

&#x20; "errorCode": 40301,

&#x20; "data": null

}



表示系统正常运行，但业务条件不允许。



系统失败

{

&#x20; "success": false,

&#x20; "message": "Internal service error",

&#x20; "errorCode": -1,

&#x20; "requestId": "demo-request-id"

}



需要使用日志继续定位。



七、第六步：检查前端展示



如果响应中有数据，但页面没有展示，需要检查：



是否读取 data.list

是否错误读取 response.list

字段名称是否一致

表格列绑定是否正确

渲染条件是否错误

格式化函数是否抛出异常



例如后端返回：



{

&#x20; "data": {

&#x20;   "list": \[]

&#x20; }

}



前端却读取：



response.list



就会拿不到正确数据。



八、第七步：通过日志定位



系统异常时记录：



发生时间

traceId

requestId

moduleName

serviceName

funcName

参数摘要

错误信息



根据 traceId 搜索日志，可以查看：



请求是否进入 biz

是否成功路由

业务方法是否执行

哪个下游调用失败

catch 捕获了什么错误

是否发送监控告警

九、第八步：构造最小复现



复杂请求：



{

&#x20; "statusList": \["PENDING\_FOR\_SUPPLIER"],

&#x20; "categoryList": \["ONE\_SECOND\_PARTY"],

&#x20; "itemName": "露营",

&#x20; "contactMobile": "13800000000",

&#x20; "createdAt": \[1710000000000, 1711000000000],

&#x20; "pageIndex": 0,

&#x20; "pageSize": 20

}



先减少到：



{

&#x20; "categoryList": \["ONE\_SECOND\_PARTY"],

&#x20; "pageIndex": 0,

&#x20; "pageSize": 20

}



确认正常后，依次加入：



statusList

itemName

contactMobile

createdAt



定位加入哪个条件后开始异常。



十、接口间口径验证

列表和详情



核对：



订单号

商品名称

状态

数量

金额

联系人

列表和导出



核对：



类目条件

状态条件

时间条件

商品条件

门店范围

导出总量

状态和金额格式



列表当前页数量不需要等于导出总量。



需要比较的是整体筛选口径。



十一、有效 Bug 的组成



一个完整 Bug 应包含：



环境

页面

操作步骤

接口路由

请求参数

实际结果

预期结果

发生时间

traceId 或 requestId

是否稳定复现

截图或响应



不要只写：



接口有问题

页面没数据

订单不对

十二、沟通原则



不要先说：



这是前端问题

这是后端问题



应该说：



页面选择的是待供应商确认，

但请求 Payload 中传的是 COMPLETED，

建议先检查状态映射。



或者：



请求参数正常，响应中 list 有两条，

但页面没有渲染，建议检查 data.list 的读取位置。



核心原则：



用请求和响应证据沟通

不要凭感觉甩锅

十三、数据脱敏



GitHub、截图和日志示例中不能出现：



真实手机号

身份证号

token

openId

unionId

真实订单号

真实下载地址

客户姓名



应该使用：



138\*\*\*\*0000

masked-open-id

demo-order-001

example.invalid

脱敏联系人

十四、职责边界



安全表述：



我参与的是接口参数核对、返回结构验证、

问题复现和日志证据整理。



避免夸大为：



我搭建了完整自动化测试平台。

十五、Day14 核心结论



接口联调要先确认页面动作和网络请求，再检查路由字段、业务参数、响应结构和页面渲染。系统异常通过 traceId 和 requestId 查询日志，复杂问题通过最小复现缩小范围，最终形成可重复、可定位的 Bug 记录。

