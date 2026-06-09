Day12：异步任务、定时任务与 Trigger 调度

一、当天核心目标



Day12 学习后台任务的基本模型：



同步任务

异步任务

定时 Trigger

后台 Job

任务状态

分批处理

幂等

失败重试



一句话理解：



同步接口适合立即返回结果，

异步 Job 适合耗时、批量或定时执行的任务。

二、和前几天的关系

Day	内容

Day08	分片导出

Day09	整包文件导出

Day10	Redis 配置、状态和轻量队列

Day11	日志、异常和监控告警

Day12	异步 Job 与 Trigger 调度



这些能力可以串成：



用户创建导出任务

→ 后台 Job 分批处理

→ Redis 或数据库记录状态

→ 日志记录执行过程

→ 失败时告警

→ 成功后返回下载结果

三、Trigger 和 Job 的区别

Trigger



负责：



决定任务什么时候开始



例如：



每天凌晨执行

每隔十分钟执行

收到事件后执行

用户提交任务后执行

Job



负责：



任务开始后具体做什么



例如：



批量处理订单

生成导出文件

清理过期文件

发送通知

同步业务数据



可以记成：



Trigger 是闹钟

Job 是被叫醒后干活的人

四、异步任务完整链路

用户发起任务

→ 接口校验参数

→ 创建任务记录

→ 返回 taskId

→ Trigger 调度后台 Job

→ Job 分批执行

→ 更新任务状态和进度

→ 成功时保存结果

→ 失败时保存原因和重试次数

→ 前端根据 taskId 查询结果

五、任务状态



常见状态：



PENDING：已创建，等待处理

PROCESSING：正在处理

SUCCESS：处理成功

FAILED：处理失败



状态用于让前端判断：



是否继续等待

是否展示进度

是否允许下载

是否展示失败原因

六、任务记录常见字段

taskId

taskType

status

param

progress

processedCount

totalCount

result

errorMessage

retryCount

createdAt

startedAt

finishedAt

七、幂等和分布式锁

分布式锁



解决：



避免多个实例同时处理同一个任务

幂等



解决：



即使任务重复执行，也不产生重复副作用



记忆方式：



锁：尽量不重复执行

幂等：重复执行也保持正确

八、失败重试



适合重试：



网络超时

对象存储临时失败

下游服务短暂不可用

临时限流



不适合重试：



参数错误

没有权限

业务条件不满足

数据本身不存在



重试超过上限后，应将任务标记为失败并隔离处理。



九、Day12 必须掌握的 10 句话

同步接口会等待业务完成，异步接口可以先返回任务已受理。

Trigger 负责决定任务什么时候启动。

Job 负责执行具体后台业务。

异步任务通常需要唯一的 taskId。

常见状态包括 PENDING、PROCESSING、SUCCESS 和 FAILED。

大任务应该分批处理，避免超时和内存压力。

Trigger、网络重试或多实例可能造成任务重复执行。

分布式锁用于减少同一任务被多个实例同时处理。

幂等用于保证重复执行不会产生重复副作用。

失败任务需要限制重试次数，并记录错误和告警信息。

十、本日材料

类型	文件

学习记录	docs/day12-async-job-and-trigger.md

调用链图	diagrams/day12-async-job-flow.md

创建任务请求	examples/create-task-request.json

创建任务响应	examples/create-task-response.json

任务状态响应	examples/task-status-response.json

失败任务响应	examples/task-failed-response.json

幂等模拟代码	examples/job-idempotency-example.ts

面试笔记	interview/day12-async-job-interview-notes.md

十一、30 秒面试话术



Day12 我复盘的是异步任务和定时 Trigger 的基本模型。对于大批量导出、文件清理或批量通知等耗时任务，接口可以先创建任务并返回 taskId，再由 Trigger 调度后台 Job 分批执行。任务执行过程中记录状态、进度和结果，同时通过幂等、并发控制、有限重试、日志和告警保证任务稳定运行。

