Day12: Async Job and Trigger Flow

Full call chain

flowchart TD

&#x20;   A\["User submits a long running task"] --> B\["Validate task parameters"]

&#x20;   B --> C\["Create task record"]

&#x20;   C --> D\["Return taskId and PENDING"]

&#x20;   C --> E\["Trigger schedules background Job"]

&#x20;   E --> F\["Job acquires task lock"]

&#x20;   F --> G{"Lock acquired"}

&#x20;   G -->|No| H\["Skip duplicate worker"]

&#x20;   G -->|Yes| I\["Check idempotency status"]

&#x20;   I --> J{"Task already completed"}

&#x20;   J -->|Yes| K\["Return existing result"]

&#x20;   J -->|No| L\["Update status to PROCESSING"]

&#x20;   L --> M\["Process data in batches"]

&#x20;   M --> N\["Update progress"]

&#x20;   N --> O{"All batches completed"}

&#x20;   O -->|No| M

&#x20;   O -->|Yes| P\["Save task result"]

&#x20;   P --> Q\["Update status to SUCCESS"]

&#x20;   M --> R{"Batch failed"}

&#x20;   R -->|Retryable| S\["Increase retryCount"]

&#x20;   S --> T{"Retry limit reached"}

&#x20;   T -->|No| M

&#x20;   T -->|Yes| U\["Update status to FAILED"]

&#x20;   R -->|Not retryable| U

&#x20;   U --> V\["Record error and send alert"]

简化版调用链

用户创建任务

→ 返回 taskId 和 PENDING

→ Trigger 调度后台 Job

→ Job 获取锁并检查幂等

→ 更新为 PROCESSING

→ 分批处理并更新进度

→ 成功后更新为 SUCCESS

→ 失败时有限重试

→ 超过上限后更新为 FAILED 并告警

中文讲解

用户提交一个耗时任务。

接口先创建任务记录并快速返回 taskId。

Trigger 调度后台 Job 执行任务。

Job 通过锁减少多个实例同时处理同一任务。

执行前检查幂等状态，避免重复产生结果。

任务分批处理，并持续更新进度。

成功后保存结果并更新为 SUCCESS。

失败时区分是否可以重试。

超过重试上限后标记为 FAILED 并记录告警。

面试讲解重点

异步接口不让用户一直等待。

Trigger 负责调度，Job 负责执行。

任务状态用于前端查询进度和结果。

分布式锁和幂等解决的问题不同。

重试必须有次数限制。

示例属于学习模型，具体实现以真实源码为准。

