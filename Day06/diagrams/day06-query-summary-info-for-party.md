# Day06：订单汇总接口调用链

## 完整调用链

```mermaid
flowchart TD
    A["后台订单页面"] --> B["用户选择筛选条件"]
    B --> C["请求 querySummaryInfoForParty"]
    C --> D["进入 biz/index.ts 统一入口"]
    D --> E["读取 moduleName、serviceName、funcName"]
    E --> F["定位 trade-bff 模块"]
    F --> G["加载 web Service"]
    G --> H["执行 querySummaryInfoForParty"]
    H --> I["读取类目、状态、时间等条件"]
    I --> J["结合 userContext 数据权限"]
    J --> K["构造汇总查询条件"]
    K --> L["查询订单数量和金额汇总"]
    L --> M["按页面口径组装汇总结果"]
    M --> N["统一入口包装 success 响应"]
    N --> O["前端展示订单汇总"]
```

## 简化版调用链

```text
后台选择筛选条件
→ 请求 querySummaryInfoForParty
→ biz 统一入口
→ trade-bff / web
→ 构造汇总条件
→ 查询数量和金额
→ 组装汇总结果
→ 返回前端
```

## 面试讲解重点

1. 汇总接口返回的是统计结果，不是当前页订单列表。
2. 汇总条件可能同时包含页面筛选条件和用户数据权限。
3. 汇总口径不一定等于当前页 `list` 的简单相加。
4. 列表接口和汇总接口可以并行调用，但统计口径必须保持一致。