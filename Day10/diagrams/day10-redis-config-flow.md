Day10: Redis Config Read Flow

Full call chain

flowchart TD

&#x20;   A\["Request enters biz function"] --> B\["Run main event handler"]

&#x20;   B --> C\["Get Redis client instance"]

&#x20;   C --> D\["Read tokenKey from Redis Hash"]

&#x20;   D --> E{"Config value exists"}

&#x20;   E -->|Yes| F\["Store value in process environment"]

&#x20;   F --> G\["Continue dynamic routing"]

&#x20;   G --> H\["Run business service"]

&#x20;   E -->|No| I\["Handle missing critical config"]

&#x20;   I --> J\["Record error or stop request"]

简化版调用链

请求进入 biz/index.ts

→ 获取 Redis 实例

→ hget 读取 tokenKey

→ 写入 process.env.authorizationTokenInside

→ 继续路由和业务调用

中文讲解

请求先进入 biz/index.ts。

入口通过 SDK 获取 Redis 实例。

使用 hget 从 global:feature:config 中读取 tokenKey。

读取成功后写入当前进程环境变量。

后续业务方法可以使用该配置。

如果关键配置不存在，不能随便使用不安全默认值。

面试讲解重点

Redis 在当前代码证据中用于高频配置读取。

hget 表示读取 Redis Hash 中的一个字段。

Redis 是加速和状态支撑层，不是订单最终数据源。

关键配置缺失时需要明确处理。

Mermaid 节点使用英文，避免 GitHub 中文编码问题。

