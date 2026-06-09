Day11 学习记录：统一日志、异常处理与监控告警

一、今天学什么



今天学习 biz/index.ts 中的统一治理能力。



重点包括：



日志记录

接口耗时

结构化上下文

异常分类

监控告警

失败响应

上下文清理

二、为什么要统一处理



如果每个业务接口各自实现日志和异常逻辑，容易出现：



日志格式不一致

错误响应不一致

有的接口告警，有的不告警

重复代码很多

线上问题难以统一排查



因此项目把这些公共能力放在 biz 统一入口。



三、请求开始阶段



入口会记录原始请求：



logger.info(event)



并记录开始时间：



const begin = performance.now()



作用：



保存请求入口证据

为后续计算 timeCost 做准备

四、成功执行阶段



业务方法执行：



const result = await \_main(

&#x20; moduleName,

&#x20; serviceName,

&#x20; funcName,

&#x20; param,

&#x20; userContext,

)



计算耗时：



const timeCost = Number(

&#x20; (performance.now() - begin).toFixed(0),

)



成功日志会补充：



timeCost

result

unionId

openId

isSuccess = 1



然后通过：



logger.pushObject(apiContext)



写入结构化日志。



五、apiContext



apiContext 可以理解为一次接口调用的档案：



{

&#x20; "moduleName": "trade-bff",

&#x20; "serviceName": "web",

&#x20; "funcName": "queryOrderForParty",

&#x20; "param": {},

&#x20; "traceId": "demo-trace-id",

&#x20; "isSuccess": 1,

&#x20; "timeCost": 280

}



它可以用于：



按接口搜索日志

按 traceId 追踪链路

分析慢请求

定位具体请求参数

确认调用是否成功

六、requestId 和 traceId

requestId



通常由云函数平台为一次执行生成。



作用：



定位某一次具体的云函数执行

traceId



用于串联一整条业务链路。



作用：



串联前端、BFF、下游服务和日志



简单记忆：



requestId：定位一次执行

traceId：追踪整条链路

七、异常捕获



业务方法抛出异常后进入：



catch (e) {

&#x20; logger.error('biz 云函数调用失败', e)

}



统一入口会：



记录错误日志

判断异常类型

判断是否发送告警

标记 isSuccess = 0

构造失败响应

八、为什么要区分异常类型

业务异常



例如：



参数不合法

订单状态不允许操作

商品不存在

业务条件不满足



这类异常不一定表示系统故障。



系统异常



例如：



数据库连接失败

空指针

未知异常

下游服务不可用



这类异常更需要告警和排查。



如果所有异常都告警，会造成：



告警过多

真正故障被淹没

开发人员逐渐忽视告警

九、SilenceError



项目中有：



throw new SilenceError('请更新小程序版本')



它表示：



本次请求需要失败

但不需要作为系统故障告警



典型作用是：



旧接口下线降噪

十、BizError



BizError 表示可预期的业务异常。



例如：



业务条件不满足

库存不足

状态不允许操作

参数校验失败



它通常应该返回前端明确错误信息，但不需要当作系统故障发送告警。



十一、飞书告警链路



非预期异常会构造告警参数：



cloudFunction

traceId

moduleName

serviceName

funcName

funcParam

unionId

openId

error.message

error.stack



调用链：



biz 捕获未知异常

→ 收集请求和错误上下文

→ 调用 log 云函数

→ monitor / warningFeiShu

→ 开发人员收到飞书告警

十二、告警降噪



项目会排除一些不需要告警的场景，例如：



SilenceError

BizError

部分微信爬虫请求

部分开发者工具请求

特定已知公众号 API 错误



告警的目标不是数量多，而是：



让收到的告警具有可行动性

十三、飞书事件为什么重新抛出异常



代码中对 feishu-event HTTP 回调有特殊处理。



如果处理失败后仍返回普通成功结构，飞书可能认为事件已经处理成功。



重新抛出异常可以让外部平台知道：



本次回调没有成功处理



从而触发平台的重试机制。



十四、HTTP 原始响应



部分外部回调要求原样返回：



OK

success

固定 JSON



因此统一入口不会对所有 HTTP 回调都包装成：



{

&#x20; "success": true,

&#x20; "data": "OK"

}



这体现了：



内部接口使用统一协议

外部回调遵守对方协议

十五、finally 的作用



无论业务成功还是失败，finally 都会执行。



它主要负责：



清理 UserContext

等待日志推送完成

清理 UserContext



云函数实例可能被复用。



如果请求上下文不清理，可能导致：



上一次请求的用户信息残留

污染下一次请求

产生错误日志或权限问题

等待日志推送



如果云函数提前结束，异步日志可能来不及发出。



因此调用：



await logger.waitPushComplete()



保证重要排障日志尽量完整。



十六、日志脱敏



日志中可能包含：



手机号

身份证号

token

openId

订单信息

联系人信息



生产环境日志应该考虑：



敏感字段脱敏

token 不落日志

限制大结果体

日志访问权限

日志保留周期



这是合理的安全改进方向，不代表当前项目所有环节都已完整实现。



十七、职责边界



安全表述：



我理解和参与的是统一入口的日志、异常分类、

响应包装和接口排障链路。



避免夸大为：



我独立搭建了完整监控平台和日志基础设施。

十八、Day11 核心结论



biz/index.ts 通过统一入口记录请求、耗时和结果，异常时区分业务错误与系统错误，对非预期异常发送飞书告警，并在 finally 中清理上下文和等待日志推送，从而形成完整的线上排障证据链。

