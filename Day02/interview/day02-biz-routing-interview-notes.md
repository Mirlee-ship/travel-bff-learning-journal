\# Day 2：biz 统一入口与动态路由面试笔记



\## 1. Day 2 核心结论



页面不会直接调用具体业务函数。



页面请求首先进入 `biz/index.ts`，统一入口根据：



```text

moduleName

serviceName

funcName



找到并执行具体业务方法。



2\. 一日聚订单调用链

后台页面发起订单查询

→ biz/index.ts 的 main()

→ 读取 moduleName、serviceName、funcName

→ 调用 \_main()

→ 加载 trade-bff/service/web

→ 执行 queryOrderForParty

→ 返回 list + total

→ 入口统一包装响应

→ 返回前端

3\. 三个路由字段

moduleName = trade-bff

serviceName = web

funcName = queryOrderForParty



含义：



moduleName：决定进入哪个业务模块

serviceName：决定加载哪个服务文件

funcName：决定执行服务中的哪个函数

param：具体业务参数

4\. main 和 \_main 的区别

main()



负责完整请求生命周期：



解析请求

初始化公共配置

检查接口是否下线

调用业务方法

统计耗时

记录日志

捕获异常

包装响应

清理上下文

\_main()



负责动态路由：



加载业务文件

取得业务方法

执行业务方法



可以记成：



main = 请求总管

\_main = 动态路由执行器

5\. 动态加载规则



如果：



serviceName = main



则加载：



模块根目录的 service



如果：



serviceName != main



则加载：



模块/service/具体服务文件



一日聚订单对应：



trade-bff

→ service/web

→ queryOrderForParty

6\. 成功、空结果和失败

成功并有数据

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "list": \[{}],

&#x20;   "total": 1

&#x20; }

}

成功但没有数据

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "list": \[],

&#x20;   "total": 0

&#x20; }

}

执行失败

{

&#x20; "success": false,

&#x20; "message": "查询条件不合法",

&#x20; "errorCode": -1

}



关键结论：



没有数据不等于接口失败。

7\. try、catch、finally

try：

执行正常业务逻辑



catch：

捕获异常、记录日志、判断是否告警、构造失败响应



finally：

无论成功失败，都清理上下文并等待日志推送

8\. 统一入口的技术价值

公共逻辑集中处理

业务代码只关注业务

接口路由规则统一

成功失败结构统一

便于通过 traceId 和日志排查问题

可以统计接口耗时

支持特殊 HTTP 回调原样返回

9\. 30 秒面试话术



项目使用 biz 云函数作为统一入口。请求通过 moduleName、serviceName 和 funcName 动态定位业务方法。例如一日聚订单列表会定位到 trade-bff 的 web Service，并执行 queryOrderForParty。业务方法返回 list 和 total 后，入口统一负责日志、耗时统计、异常处理和响应包装。



10\. 90 秒面试话术



项目的请求首先进入 biz 云函数统一入口。普通请求会直接携带 moduleName、serviceName、funcName 和 param，入口先准备公共配置并构造日志上下文，然后通过 \_main 动态加载对应 Service。



以一日聚订单列表为例，请求是 trade-bff、web、queryOrderForParty，因此会加载 trade-bff/service/web 并执行 queryOrderForParty。业务方法完成订单查询和页面模型组装后返回 list 和 total，入口再记录接口耗时并包装为统一成功响应。



如果业务执行异常，入口会在 catch 中记录日志，对未知系统异常触发监控告警，并构造统一失败响应。finally 无论成功还是失败都会清理请求上下文并等待日志推送完成。



11\. 职责边界



这套统一入口架构不是我个人独立设计的。



我在项目开发和联调中的职责是：



按照路由协议定位业务方法

理解页面请求参数

实现或联调具体 BFF 接口

检查返回结构

根据 traceId、funcName 和参数定位问题

12\. 高频追问

Q1：为什么不让页面直接调用 queryOrderForParty？



因为统一入口需要集中处理日志、异常、响应格式、上下文和监控等公共能力。



Q2：动态路由有什么好处？



路由规则统一，新增业务方法时可以按照模块、服务和函数组织，入口不需要为每个接口重复编写公共处理逻辑。



Q3：动态路由有什么风险？



函数名和文件路径在运行时解析，错误可能在运行时才暴露；动态 require 也降低了静态分析能力。



Q4：为什么空列表还是 success=true？



查询本身正常完成，只是没有符合条件的数据。无结果属于业务结果，不属于系统异常。



Q5：finally 为什么要清理上下文？



云函数实例可能被复用，如果不清理请求上下文，存在把上一次请求信息带到下一次请求的风险。

