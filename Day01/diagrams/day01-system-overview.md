```mermaid
flowchart LR
    A["直播间 / 旅行社 / 运营后台"] --> B["biz 云函数统一入口"]
    B --> C{"根据 moduleName + serviceName + funcName 动态路由"}
    C --> D["commodity 商品服务"]
    C --> E["trade-bff Web 服务"]
    D --> F["商品搜索与商品详情"]
    E --> G["订单列表 / 汇总 / 详情 / 导出"]
    G --> H["商品服务 / 订单服务 / 用户服务 / 履约服务"]
    H --> I["BFF 参数转换、服务编排、字段聚合"]
    I --> J["包装页面需要的返回结果"]
    J --> A