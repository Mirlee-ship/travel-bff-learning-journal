\# Day 2：biz 统一入口、动态路由与响应处理



\## 1. 今日学习目标



今天主要理解一个页面请求如何经过 `biz/index.ts`，最终找到并执行具体业务函数。



本节重点掌握：



1\. `biz/index.ts` 的作用

2\. `moduleName`、`serviceName`、`funcName` 的含义

3\. 一日聚订单查询如何定位到 `queryOrderForParty`

4\. 成功、有数据，成功但无数据，以及接口执行失败的区别

5\. 统一入口为什么要负责日志、异常和响应包装



\---



\## 2. biz/index.ts 是什么



可以把 `biz/index.ts` 理解为整个后端系统的“统一前台”。



页面请求不会自己寻找具体业务文件，而是先进入统一入口。入口读取请求中的路由字段，再把请求转交给正确的业务模块和方法。



简化调用链如下：



```text

页面请求

→ biz/index.ts 统一入口

→ 解析路由字段

→ 加载对应 Service

→ 执行具体业务函数

→ 包装响应

→ 返回前端

```



\---



\## 3. 三个核心路由字段



一日聚订单查询的脱敏请求示例：



```json

{

&#x20; "moduleName": "trade-bff",

&#x20; "serviceName": "web",

&#x20; "funcName": "queryOrderForParty",

&#x20; "param": {

&#x20;   "categoryList": \["ONE\_SECOND\_PARTY"],

&#x20;   "pageIndex": 0,

&#x20;   "pageSize": 10

&#x20; }

}

```



三个字段分别表示：



\### moduleName



```text

trade-bff

```



表示进入交易后台 BFF 模块。



\### serviceName



```text

web

```



表示进入该模块下服务于后台页面的 Web Service。



\### funcName



```text

queryOrderForParty

```



表示最终执行一日聚订单列表查询方法。



可以简单记忆为：



```text

moduleName：去哪个业务模块

serviceName：去模块中的哪个服务文件

funcName：执行服务中的哪个函数

param：业务函数真正使用的查询参数

```



\---



\## 4. 一日聚订单查询如何找到业务函数



当请求携带：



```text

moduleName = trade-bff

serviceName = web

funcName = queryOrderForParty

```



统一入口会完成以下操作：



```text

找到 trade-bff 模块

→ 加载 web 服务

→ 找到 queryOrderForParty 方法

→ 将 param 和 userContext 传入方法

→ 执行订单查询

```



可以简化理解为：



```text

trade-bff

→ service/web

→ queryOrderForParty(param, userContext)

```



\---



\## 5. main 和 \_main 的区别



\### main()



`main()` 负责一次请求的完整生命周期：



```text

接收请求

→ 解析请求

→ 记录日志和耗时

→ 调用业务方法

→ 捕获异常

→ 包装响应

→ 清理请求上下文

```



\### \_main()



`\_main()` 主要负责动态路由：



```text

加载业务文件

→ 找到业务函数

→ 执行业务函数

```



可以概括为：



```text

main = 请求总管

\_main = 动态路由执行器

```



\---



\## 6. 接口返回的三种情况



\### 情况一：接口成功并查到数据



```json

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "list": \[

&#x20;     {

&#x20;       "orderId": "demo-order-001",

&#x20;       "itemName": "脱敏示例商品"

&#x20;     }

&#x20;   ],

&#x20;   "total": 1

&#x20; }

}

```



说明接口正常执行，并且存在符合条件的数据。



\### 情况二：接口成功但没有数据



```json

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "list": \[],

&#x20;   "total": 0

&#x20; }

}

```



这里仍然是 `success=true`。



因为查询过程正常完成，只是没有符合筛选条件的数据。



因此：



```text

没有查到数据，不等于接口执行失败。

```



前端可以根据空列表正常显示“暂无数据”。



\### 情况三：接口执行失败



```json

{

&#x20; "success": false,

&#x20; "message": "查询条件不合法",

&#x20; "errorCode": -1

}

```



这表示请求执行过程中出现了参数错误、程序异常或下游服务异常。



\---



\## 7. 为什么需要统一响应结构



具体业务函数可能只返回：



```json

{

&#x20; "list": \[],

&#x20; "total": 0

}

```



统一入口会把业务结果包装为：



```json

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "list": \[],

&#x20;   "total": 0

&#x20; }

}

```



前端可以统一按照下面的方式判断：



```text

success = true

→ 使用 data



success = false

→ 展示错误信息

```



这样不同业务接口不需要设计不同的成功和失败判断方式。



\---



\## 8. try、catch、finally 的作用



可以简单记忆为：



```text

try = 尝试执行业务

catch = 出错后进行处理

finally = 无论成功失败都执行收尾

```



简化逻辑如下：



```ts

try {

&#x20; const result = await executeBusiness()

&#x20; response = buildSuccess(result)

} catch (error) {

&#x20; logger.error(error)

&#x20; response = buildFailure(error.message)

} finally {

&#x20; clearUserContext()

&#x20; await waitLogPushComplete()

}

```



\### try



调用具体业务函数，成功后构造统一成功结果。



\### catch



业务执行出错后：



```text

记录错误日志

→ 判断是否需要监控告警

→ 构造统一失败结果

```



\### finally



无论请求成功还是失败，都会执行：



```text

清理本次请求上下文

→ 等待日志推送完成

```



\---



\## 9. 统一入口的价值



统一入口集中处理以下公共能力：



\- 动态路由

\- 请求日志

\- 执行耗时统计

\- 异常处理

\- 监控告警

\- 成功和失败响应包装

\- 请求上下文清理



具体业务函数只需要关注自身业务。



例如 `queryOrderForParty` 主要负责：



\- 将页面参数转换为订单查询条件

\- 查询订单列表和总数

\- 补充相关用户和订单信息

\- 组装 `list + total`



\---



\## 10. 我的职责边界



统一入口和动态路由机制属于项目已有架构，并不是我个人独立设计的。



我在开发和联调过程中需要：



\- 根据三个路由字段定位具体业务方法

\- 理解页面参数如何传入 BFF

\- 检查接口返回结构

\- 根据日志和请求参数定位问题



\---



\## 11. 面试口述



\### 20 秒版本



项目使用统一的 biz 云函数入口。请求通过 `moduleName`、`serviceName` 和 `funcName` 定位具体业务方法，入口统一负责日志、异常和响应包装，具体 Service 只关注业务逻辑。



\### 60 秒版本



项目的请求会先进入 biz 云函数统一入口。以一日聚订单列表为例，请求中的路由信息是 `trade-bff / web / queryOrderForParty`，入口会加载交易 BFF 的 Web 服务并执行该方法。业务方法返回 `list` 和 `total` 后，由入口包装成统一的成功响应；如果执行异常，入口会记录日志并返回标准失败结构。这样公共能力集中在入口层，具体业务代码只需要关注订单查询和数据组装。



\---



\## 12. 今日总结



Day 2 最重要的结论是：



```text

页面请求先进入 biz 统一入口，

入口根据 moduleName、serviceName 和 funcName，

找到并执行具体业务函数。

```



一日聚订单列表的路由是：



```text

trade-bff

→ web

→ queryOrderForParty

```



接口正常执行但没有数据时：



```text

success = true

list = \[]

total = 0

```



真正执行异常时：



```text

success = false

message = 错误信息

```

