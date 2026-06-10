Day17: Data Consistency Flow

Local transaction flow

flowchart TD

&#x20;   A\[Receive business request] --> B\[Begin database transaction]

&#x20;   B --> C\[Update order status]

&#x20;   C --> D\[Create fulfillment record]

&#x20;   D --> E\[Create status log]

&#x20;   E --> F{All operations succeed}

&#x20;   F -->|Yes| G\[Commit transaction]

&#x20;   F -->|No| H\[Rollback transaction]

&#x20;   G --> I\[Publish business event]

&#x20;   H --> J\[Return business failure]

Cross service consistency flow

flowchart TD

&#x20;   A\[Commit core database transaction] --> B\[Create pending event]

&#x20;   B --> C\[Background worker reads event]

&#x20;   C --> D\[Call downstream service]

&#x20;   D --> E{Call succeeds}

&#x20;   E -->|Yes| F\[Mark event success]

&#x20;   E -->|No| G{Can retry}

&#x20;   G -->|Yes| H\[Schedule retry]

&#x20;   G -->|No| I\[Run compensation]

&#x20;   H --> C

&#x20;   I --> J\[Record final failure]

Idempotency flow

flowchart TD

&#x20;   A\[Receive request with idempotency key] --> B\[Check processing record]

&#x20;   B --> C{Record exists}

&#x20;   C -->|Success| D\[Return previous result]

&#x20;   C -->|Processing| E\[Return processing status]

&#x20;   C -->|No| F\[Create processing record]

&#x20;   F --> G\[Execute business operation]

&#x20;   G --> H{Operation succeeds}

&#x20;   H -->|Yes| I\[Save success result]

&#x20;   H -->|No| J\[Save failure result]

简化记忆

同库操作：

事务



重复请求：

幂等



临时故障：

有限重试



跨服务部分成功：

补偿



非核心副作用：

最终一致

面试讲解重点

本地事务只能覆盖同一个数据库边界。

远程服务不能由本地事务直接回滚。

重试必须建立在幂等基础上。

补偿是新的反向业务操作，不是事务回滚。

Outbox 可以降低业务提交成功但事件丢失的风险。

所有步骤都需要状态和日志记录。

