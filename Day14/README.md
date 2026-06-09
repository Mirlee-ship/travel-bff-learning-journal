Day14：接口测试、前后端联调与错误定位

一、当天核心目标



Day14 学习接口联调和问题定位。



重点包括：



检查页面操作

查看 Network 请求

核对路由字段

核对业务参数

判断响应类型

检查前端展示

根据 traceId 查询日志

构造最小复现

提交完整 Bug



一句话理解：



先看请求，再看响应，然后看页面，最后看日志。

二、联调检查的标准步骤

第一步：确认页面操作



确认：



用户点击了什么按钮

选择了哪些筛选条件

页面期望出现什么结果

第二步：确认是否发出请求



打开浏览器开发者工具：



F12

→ Network

→ Fetch/XHR



重新操作页面，检查是否出现对应请求。



如果没有请求，优先排查前端按钮事件、表单校验或前端报错。



第三步：核对路由字段



检查：



moduleName

serviceName

funcName



例如：



trade-bff

web

queryOrderForParty



三个字段负责定位具体业务方法。



第四步：核对 param



检查：



字段是否遗漏

字段名是否拼错

字段类型是否正确

枚举值是否正确

时间单位是否正确

分页下标是否正确

筛选条件是否与页面一致

第五步：判断响应类型



响应通常分成四类：



成功且有数据

成功但为空

业务失败

系统失败

第六步：检查前端渲染



如果接口响应正确但页面不显示，需要检查：



前端是否读取 data.list

字段名是否匹配

组件是否正确绑定

渲染条件是否拦截

格式化逻辑是否有错误

第七步：使用日志定位



系统异常时记录：



traceId

requestId

moduleName

serviceName

funcName

发生时间

请求参数摘要

错误信息



然后根据 traceId 或 requestId 查询后端日志。



第八步：构造最小复现



先保留必要参数，再逐个增加筛选条件，定位从哪个条件开始出错。



第九步：整理 Bug 记录



Bug 至少应包含：



环境

操作步骤

请求接口

请求参数

实际结果

预期结果

发生时间

traceId 或 requestId

是否稳定复现

截图或响应

三、核心接口示例

moduleName: trade-bff

serviceName: web

funcName: queryOrderForParty



请求示例：



{

&#x20; "moduleName": "trade-bff",

&#x20; "serviceName": "web",

&#x20; "funcName": "queryOrderForParty",

&#x20; "param": {

&#x20;   "statusList": \["PENDING\_FOR\_SUPPLIER"],

&#x20;   "categoryList": \["ONE\_SECOND\_PARTY"],

&#x20;   "pageIndex": 0,

&#x20;   "pageSize": 20

&#x20; }

}

四、四种响应类型

成功且有数据

success = true

list 有数据

total 大于 0

成功但为空

success = true

list = \[]

total = 0



这通常是正常业务空结果，不是系统异常。



业务失败

success = false

存在明确 message 和业务 errorCode



例如参数错误、权限不足或业务条件不允许。



系统失败

success = false

errorCode 通常为系统错误

可能包含 requestId 或 traceId



需要结合后端日志继续定位。



五、前端和后端问题的初步判断

表现	优先排查

点击后没有请求	前端事件、校验、报错

页面选择和 Payload 不一致	前端参数映射

请求正确但响应数据错误	BFF、查询条件、下游服务

响应正确但页面不展示	前端字段绑定和渲染

返回系统异常	根据 traceId 查后端日志



问题归属必须以证据判断，不能凭感觉。



六、Day14 必须掌握的 10 句话

联调要按照页面、请求、参数、响应、展示和日志逐层检查。

moduleName / serviceName / funcName 决定调用哪个业务方法。

param 决定业务方法具体查询什么。

HTTP 200 不代表业务一定成功。

success=true、list=\[]、total=0 通常是正常空结果。

业务失败和系统失败需要分开判断。

分页下标、时间单位和枚举值是常见参数问题。

复杂问题应构造最小可复现请求。

traceId 和 requestId 可以帮助查询后端日志。

Bug 描述必须包含操作、参数、实际结果和预期结果。

七、本日材料

类型	文件

学习记录	docs/day14-api-testing-and-debugging.md

调用链图	diagrams/day14-api-debug-flow.md

请求示例	examples/order-query-request.json

响应分类	examples/api-response-cases.md

Bug 模板	examples/bug-report-template.md

最小复现	examples/minimal-reproduction.md

面试笔记	interview/day14-api-debug-interview-notes.md

八、30 秒面试话术



Day14 我复盘的是接口测试和前后端联调。我会先通过 Network 确认页面是否发出请求，再检查 moduleName / serviceName / funcName 和 param 是否正确，然后判断响应属于成功有数据、成功空结果、业务失败还是系统失败。如果请求和响应正常但页面异常，就排查前端字段映射；如果接口系统失败，就根据 traceId 和 requestId 查询后端日志。

