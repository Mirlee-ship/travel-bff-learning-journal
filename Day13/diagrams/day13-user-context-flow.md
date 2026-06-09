Day13: User Context and Authorization Flow

Full call chain

flowchart TD

&#x20;   A\["Frontend sends request"] --> B\["Request enters biz function"]

&#x20;   B --> C\["Read trusted identity information"]

&#x20;   C --> D\["Build request UserContext"]

&#x20;   D --> E\["Read module service function and param"]

&#x20;   E --> F\["Route to business service"]

&#x20;   F --> G\["Pass param and UserContext"]

&#x20;   G --> H\["Build business query conditions"]

&#x20;   H --> I\["Apply user data scope"]

&#x20;   I --> J{"Permission allowed"}

&#x20;   J -->|Yes| K\["Query or modify business data"]

&#x20;   K --> L\["Build success response"]

&#x20;   J -->|No| M\["Build permission denied response"]

&#x20;   L --> N\["Record request identity and result"]

&#x20;   M --> N

&#x20;   N --> O\["Destroy UserContext"]

&#x20;   O --> P\["Return response"]

简化版调用链

请求进入 biz

→ 获取可信用户身份

→ 构造 UserContext

→ 路由到具体方法

→ 传入 param + userContext

→ 后端判断数据权限

→ 返回成功或权限失败

→ 清理 UserContext

中文讲解

前端发起业务请求。

统一入口从可信登录态中获取用户身份。

系统构造当前请求的 UserContext。

param 和 userContext 一起传给业务方法。

业务方法将页面筛选条件和用户权限范围组合。

有权限时查询或修改数据。

无权限时返回明确的业务错误。

请求结束后销毁用户上下文。

面试讲解重点

param 表达业务需求。

userContext 表达调用者身份和数据范围。

权限范围不能直接相信前端参数。

前端隐藏按钮不能代替后端权限校验。

用户身份和内部服务凭证需要分开。

请求结束后必须清理身份上下文。

