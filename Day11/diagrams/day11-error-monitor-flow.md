Day11: Logging and Error Monitoring Flow

Full call chain

flowchart TD

&#x20;   A\["Request enters biz function"] --> B\["Record request log"]

&#x20;   B --> C\["Start performance timer"]

&#x20;   C --> D\["Run business service"]

&#x20;   D --> E{"Execution success"}

&#x20;   E -->|Yes| F\["Calculate timeCost"]

&#x20;   F --> G\["Write success apiContext"]

&#x20;   G --> H\["Build success response"]

&#x20;   E -->|No| I\["Catch exception"]

&#x20;   I --> J\["Record error log"]

&#x20;   J --> K{"Expected business error"}

&#x20;   K -->|Yes| L\["Skip system alert"]

&#x20;   K -->|No| M\["Build alert context"]

&#x20;   M --> N\["Call warningFeiShu"]

&#x20;   L --> O\["Build failure response"]

&#x20;   N --> O

&#x20;   H --> P\["Destroy UserContext"]

&#x20;   O --> P

&#x20;   P --> Q\["Wait for log push"]

&#x20;   Q --> R\["Return response"]

简化版调用链

请求进入

→ 记录请求和开始时间

→ 执行业务方法

→ 成功：记录耗时和结果

→ 失败：记录错误并分类

→ 非预期异常发送飞书告警

→ 构造统一响应

→ 清理上下文

→ 等待日志推送

→ 返回前端

中文讲解

请求进入统一入口后先记录日志并开始计时。

业务方法成功时，记录耗时、结果和用户标识。

业务方法失败时，统一进入异常处理。

可预期业务异常不会作为系统故障重复告警。

未知异常会收集路由、参数、用户和堆栈信息。

系统调用日志云函数发送飞书告警。

无论成功失败，最后都会清理上下文并等待日志推送。

面试讲解重点

统一入口同时承担路由和可观测性职责。

apiContext 形成结构化接口日志。

异常分类可以减少告警噪音。

traceId 和函数名用于快速定位问题。

finally 保证上下文清理和日志收尾。

