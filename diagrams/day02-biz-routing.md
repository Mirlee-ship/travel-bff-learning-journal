\# Day 2：biz 云函数动态路由



```mermaid

flowchart TD

&#x20;   A\[页面或外部系统发起请求] --> B\[biz main 统一入口]



&#x20;   B --> C{是否 HTTP 请求}



&#x20;   C -->|否| D\[从 event 读取 moduleName serviceName funcName param]

&#x20;   C -->|是| E\[从 URL path 解析 moduleName serviceName funcName]

&#x20;   E --> F\[组装 query 和 body]

&#x20;   

&#x20;   D --> G\[checkOffLineApi]

&#x20;   F --> G



&#x20;   G --> H\[switchService.initConfig]

&#x20;   H --> I\[调用 \_main]



&#x20;   I --> J{serviceName 是否为 main}



&#x20;   J -->|是| K\[加载 module/service.js]

&#x20;   J -->|否| L\[加载 module/service/serviceName.js]



&#x20;   K --> M\[兼容 default export]

&#x20;   L --> M



&#x20;   M --> N\[执行 service funcName]

&#x20;   N --> O{执行是否成功}



&#x20;   O -->|成功| P\[记录耗时和结果日志]

&#x20;   P --> Q\[包装成功响应或返回原始结果]



&#x20;   O -->|失败| R\[记录错误和发送告警]

&#x20;   R --> S\[包装失败响应]



&#x20;   Q --> T\[清理 UserContext 并等待日志推送]

&#x20;   S --> T



&#x20;   T --> U\[返回调用方]

```



\## 核心结论



1\. `main` 负责请求生命周期管理。

2\. `\_main` 负责动态加载 Service 并执行方法。

3\. `moduleName + serviceName + funcName` 共同组成动态路由地址。

4\. 普通请求使用统一响应包装，特殊 HTTP 回调可以返回原始结果。

5\. `try/catch/finally` 负责成功、失败、告警和上下文清理。

