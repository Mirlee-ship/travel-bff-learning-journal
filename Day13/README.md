Day13：用户身份上下文、鉴权与权限边界

一、当天核心目标



Day13 学习请求进入 BFF 后，系统如何识别：



当前是谁在调用

当前用户有哪些身份信息

用户可以访问哪些数据

业务方法如何获取身份上下文

请求结束后为什么必须清理上下文



一句话理解：



param 决定查什么，

userContext 决定谁在查、能查哪些数据。

二、和前几天的关系

Day	内容

Day02	统一入口和动态路由

Day07	订单详情聚合

Day10	Redis 和内部服务 token

Day11	日志、异常与 UserContext 清理

Day13	用户身份上下文和权限边界



完整关系：



请求进入 biz 入口

→ 识别调用者身份

→ 构造 userContext

→ 路由到业务方法

→ 业务方法结合 param 和 userContext 执行

→ 记录用户和调用日志

→ 请求结束后清理上下文

三、param 和 userContext



业务方法可以理解为：



service\[funcName](param, userContext)

param



表示前端传入的业务条件：



订单状态

商品名称

时间范围

分页

tradeOrderId



它回答：



这次请求想做什么？

userContext



表示系统识别出的可信身份信息：



当前用户

openId

unionId

后台员工身份

所属门店

角色

权限范围



它回答：



是谁在操作？

可以操作哪些数据？

四、认证与授权

认证 Authentication



解决：



你是谁？



例如：



解析登录态

获取 openId 或 unionId

查询后台员工账号

授权 Authorization



解决：



你能做什么？



例如：



能否查看订单

能否导出数据

能否修改状态

能否访问其他门店



记忆方式：



认证确认身份

授权确认权限

五、用户身份和服务身份

用户身份



用于说明：



哪个用户正在操作



常见信息：



openId

unionId

employeeId

storeId

role

内部服务身份



项目中存在：



authorizationTokenInside



它用于说明：



BFF 是否有资格调用内部下游服务



记忆方式：



userContext 代表用户

authorizationTokenInside 代表服务

六、为什么不能相信前端权限参数



前端请求可以被修改。



例如前端传入：



{

&#x20; "storeId": "store-B"

}



但当前员工实际属于：



store-A



如果后端直接相信前端的 storeId，可能造成跨门店越权。



正确原则：



前端表达想查什么

后端决定用户能查什么

七、为什么必须清理 UserContext



云函数实例可能被重复使用。



如果上一次请求的身份没有清理，可能造成：



用户信息残留

日志用户错误

查询范围错误

权限污染

跨用户越权



所以请求级上下文必须做到：



每次创建

每次使用

每次销毁

八、Day13 必须掌握的 10 句话

param 决定查什么，userContext 决定谁在查。

UserContext 保存当前请求的用户和权限信息。

OPENID 用于识别某个微信应用中的用户。

UNIONID 可以用于同一开放平台体系下的统一用户识别。

认证解决“你是谁”，授权解决“你能做什么”。

前端传入的门店、角色和权限信息不能直接相信。

真正的数据权限必须由后端根据可信身份判断。

用户身份和内部服务 token 是两类不同的身份凭证。

内部服务 token 不能返回给前端或完整写入日志。

请求结束后必须清理 UserContext，防止身份污染。

九、本日材料

类型	文件

学习记录	docs/day13-user-context-and-authorization.md

调用链图	diagrams/day13-user-context-flow.md

用户上下文示例	examples/user-context-example.json

订单权限模拟	examples/order-permission-example.ts

内部 token 示例	examples/internal-token-example.ts

权限失败响应	examples/permission-denied-response.json

面试笔记	interview/day13-auth-context-interview-notes.md

十、30 秒面试话术



Day13 我复盘的是项目中的用户身份上下文和权限边界。统一入口识别当前调用者，将 openId、unionId 或后台员工身份整理到 UserContext，再把 param + userContext 一起传给业务方法。param 决定查什么，userContext 决定谁在查以及能查哪些数据。请求结束后会销毁上下文，避免云函数实例复用造成身份污染。

