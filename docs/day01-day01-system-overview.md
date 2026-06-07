\# Day 1 调用链图



```mermaid

flowchart LR

&#x20; A\[直播间/旅行社/运营后台] --> B\[biz 云函数入口]

&#x20; B -->|moduleName + serviceName + funcName| C{模块路由}

&#x20; C --> D\[commodity 商品服务]

&#x20; C --> E\[trade-bff Web 服务]

&#x20; D --> F\[商品搜索与详情]

&#x20; E --> G\[订单列表/汇总/详情/导出]

&#x20; G --> H\[商品/订单/用户等下游服务]

&#x20; H --> I\[BFF 字段整合与结果组装]

