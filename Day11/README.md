Day11：统一日志、异常处理与监控告警

一、当天核心目标



Day11 学习 biz/index.ts 中的公共治理能力：



日志记录

请求耗时统计

异常分类

统一失败响应

飞书告警

上下文清理



一句话理解：



前面的 Day 学业务接口如何执行，

Day11 学接口失败以后如何留下证据、返回错误并通知开发人员。

二、核心文件

src/cloud/functions/biz/index.ts



统一入口不仅负责动态路由，还负责：



记录请求

统计耗时

记录执行结果

捕获异常

区分业务异常和系统异常

发送监控告警

清理请求上下文

等待日志推送完成

三、正常调用链

请求进入 biz/index.ts

→ 记录请求日志

→ 开始计时

→ 执行业务方法

→ 计算 timeCost

→ 记录 apiContext

→ 包装 success + data

→ 清理 UserContext

→ 等待日志推送

→ 返回前端

四、异常调用链

业务方法抛出异常

→ catch 捕获异常

→ 记录错误日志

→ 判断异常类型

→ 判断是否需要飞书告警

→ 构造失败响应

→ finally 清理上下文

→ 等待日志推送

→ 返回前端

五、apiContext 的作用



apiContext 可以理解为一次接口调用的结构化档案。



它可能包含：



moduleName

serviceName

funcName

param

traceId

isSuccess

timeCost

result

openId

unionId



它可以帮助开发人员定位：



调用了哪个接口

请求参数是什么

接口执行了多久

是否成功

返回了什么

由哪个用户发起

六、异常分类

BizError



表示预期内的业务异常，例如：



参数校验失败

业务条件不满足

订单状态不允许操作



通常不需要作为系统故障告警。



SilenceError



表示需要向调用方返回错误，但不希望产生监控噪音。



例如：



旧接口已下线

请更新小程序版本

未知系统异常



例如：



数据库连接失败

空指针

下游服务异常

未知程序错误



这类异常更需要记录堆栈并发送告警。



七、飞书告警包含的信息



非预期异常可能收集：



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



然后调用：



log 云函数

→ monitor

→ warningFeiShu

八、Day11 必须掌握的 10 句话

biz/index.ts 不只负责路由，也负责统一日志和异常治理。

请求开始时会记录事件并统计执行耗时。

apiContext 保存路由、参数、traceId、耗时和执行结果。

成功请求会统一包装为成功响应。

业务方法异常会统一进入 catch。

BizError 通常是可预期业务异常。

SilenceError 用于降低无意义告警噪音。

非预期异常会携带参数和堆栈发送飞书告警。

finally 无论成功失败都会清理 UserContext。

logger.waitPushComplete 用于确保关键日志在函数结束前推送完成。

九、本日材料

类型	文件

学习记录	docs/day11-observability-and-error-handling.md

调用链图	diagrams/day11-error-monitor-flow.md

成功日志示例	examples/success-log-context.json

失败告警示例	examples/failure-alert-context.json

异常分类	examples/error-classification.md

面试笔记	interview/day11-observability-interview-notes.md

十、30 秒面试话术



Day11 我复盘的是 biz 统一入口中的日志和异常治理。请求进入时会记录路由、参数并统计耗时；业务成功后记录结构化结果，失败时统一进入 catch。项目会区分 BizError、SilenceError 和未知系统异常，对需要处理的异常发送飞书告警，最后在 finally 中清理请求上下文并等待日志推送完成。

