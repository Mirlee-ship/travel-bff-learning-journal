Day14: API Debugging Flow

Full debugging flow

flowchart TD

&#x20;   A\["User operates the page"] --> B{"Network request sent"}

&#x20;   B -->|No| C\["Check frontend event and validation"]

&#x20;   B -->|Yes| D\["Check route fields"]

&#x20;   D --> E{"Route fields correct"}

&#x20;   E -->|No| F\["Fix module service or function name"]

&#x20;   E -->|Yes| G\["Check business parameters"]

&#x20;   G --> H{"Parameters correct"}

&#x20;   H -->|No| I\["Fix type enum time or pagination"]

&#x20;   H -->|Yes| J\["Check API response"]

&#x20;   J --> K{"Response type"}

&#x20;   K -->|Success with data| L\["Check frontend rendering"]

&#x20;   K -->|Success empty| M\["Check filters pagination and permission"]

&#x20;   K -->|Business failure| N\["Check message and errorCode"]

&#x20;   K -->|System failure| O\["Collect traceId and requestId"]

&#x20;   O --> P\["Search backend logs"]

&#x20;   P --> Q\["Locate service or downstream failure"]

&#x20;   L --> R{"Page renders correctly"}

&#x20;   R -->|No| S\["Check field binding and formatting"]

&#x20;   R -->|Yes| T\["Finish verification"]

简化版联调步骤

页面操作

→ 是否发出请求

→ 路由字段是否正确

→ param 是否正确

→ 响应属于哪一类

→ 页面是否正确展示

→ 系统异常时查 traceId

→ 构造最小复现

→ 提交完整 Bug

中文讲解

先确认用户在页面做了什么。

检查 Network 是否出现接口请求。

检查 moduleName / serviceName / funcName。

检查业务参数、类型、枚举、时间和分页。

判断响应属于成功有数据、成功空结果、业务失败还是系统失败。

响应正确但页面异常时，检查前端字段绑定。

系统异常时记录 traceId 和 requestId。

通过日志定位具体业务方法或下游服务。

最终形成可复现的问题记录。

面试讲解重点

联调不能只看页面结果。

HTTP 200 不等于业务成功。

空结果和系统异常要区分。

请求正确、响应正确、页面错误时优先排查前端。

系统失败需要结合 traceId 和日志定位。

复杂条件问题使用最小复现方法。

