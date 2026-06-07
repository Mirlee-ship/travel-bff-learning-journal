# Day05：一日聚订单列表调用链图

## queryOrderForParty 完整调用链

```mermaid
flowchart TD
    A["后台一日聚订单列表页发起查询"] --> B["biz 统一入口"]
    B --> C["定位 trade-bff / web / queryOrderForParty"]
    C --> D["读取页面筛选参数"]
    D --> E{"是否传入 itemName"}
    E -->|是| F["先查询商品 ID 列表"]
    E -->|否| G["继续处理用户条件"]
    F --> H{"商品 ID 是否为空"}
    H -->|是| I["返回 list 空数组和 total 0"]
    H -->|否| G
    G --> J{"是否传入 nickName 或 mobile"}
    J -->|是| K["先查询用户 unionId 列表"]
    J -->|否| L["组装订单查询条件"]
    K --> M{"unionId 列表是否为空"}
    M -->|是| I
    M -->|否| L
    L --> N["查询订单列表"]
    L --> O["查询订单总数"]
    N --> P["收集订单关联 ID"]
    O --> Q["得到 total"]
    P --> R["批量补充用户信息"]
    R --> S["批量补充管家信息"]
    S --> T["批量补充差额信息"]
    T --> U["查询子单和关联订单信息"]
    U --> V["组装页面列表字段"]
    Q --> W["合并 list 和 total"]
    V --> W
    W --> X["返回前端"]
```

## 简化版调用链

```text
后台订单列表页
→ queryOrderForParty
→ 页面参数转换成查询条件
→ 商品名转 itemId
→ 用户信息转 unionId
→ 查询订单列表和总数
→ 补充用户、管家、差额、子单等信息
→ 返回 list + total
```

## 面试讲解重点

1. `queryOrderForParty` 是后台一日聚订单列表接口。
2. 它不是简单查订单表，而是 BFF 层的查询编排接口。
3. 商品名会先转换成 `itemIdList`。
4. 用户昵称或手机号会先转换成 `unionIdList`。
5. 订单列表和订单总数分别用于页面表格和分页。
6. 订单查出来后，还要补充用户、管家、差额、子单等页面展示信息。
7. 空结果返回 `list=[]、total=0`，不是系统异常。