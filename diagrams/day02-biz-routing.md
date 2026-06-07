\# Day 2：biz 统一入口调用链图



\## 一日聚订单列表调用链



```mermaid

flowchart TD

&#x20;   A\["后台页面发起订单查询"] --> B\["biz/index.ts 统一入口"]

&#x20;   B --> C\["读取 moduleName、serviceName、funcName"]

&#x20;   C --> D\["定位 trade-bff 模块"]

&#x20;   D --> E\["加载 web Service"]

&#x20;   E --> F\["执行 queryOrderForParty"]

&#x20;   F --> G\["业务方法返回 list 和 total"]

&#x20;   G --> H\["统一入口包装 success 和 data"]

&#x20;   H --> I\["返回前端页面"]



&#x20;   F -->|执行异常| J\["catch 记录错误日志"]

&#x20;   J --> K\["构造统一失败响应"]

&#x20;   K --> I



&#x20;   H --> L\["finally 清理请求上下文"]

&#x20;   K --> L

```



\## 路由字段示例



```text

moduleName = trade-bff

serviceName = web

funcName = queryOrderForParty

```



对应关系：



```text

trade-bff

→ service/web

→ queryOrderForParty(param, userContext)

```



\## 简化记忆



```text

前三个路由字段负责“找谁”

param 负责“让他做什么”

```



\## 统一入口和业务方法的职责



```text

统一入口：

路由、日志、异常、响应包装、上下文清理



queryOrderForParty：

处理订单筛选、查询列表和总数、补充数据、组装结果

```

