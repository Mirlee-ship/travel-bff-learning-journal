\# Day04：商品详情接口调用链图



\## getItemInfo 完整调用链



```mermaid

flowchart TD

&#x20;   A\["用户在商品列表页点击商品"] --> B\["前端拿到 itemId"]

&#x20;   B --> C\["POST /commodity/get-item-info"]

&#x20;   C --> D\["执行 getItemInfo"]

&#x20;   D --> E\["根据 itemId 查询商品基础信息"]

&#x20;   E --> F\["查询商品扩展信息"]

&#x20;   F --> G\["组装 basicInfo"]

&#x20;   G --> H\["组装 extraInfo"]

&#x20;   H --> I\["返回 basicInfo 和 extraInfo"]

&#x20;   I --> J\["前端渲染商品详情页"]

```



\## 简化版调用链



```text

列表页点击商品

→ 拿到 itemId

→ 请求 get-item-info

→ 查询商品详情

→ 组装 basicInfo + extraInfo

→ 返回前端

→ 渲染详情页

```



\## 面试讲解重点



1\. `getItemInfo` 是详情接口，不是搜索接口。

2\. 它只需要 `itemId`，因为商品已经在列表页被选中了。

3\. `basicInfo` 放商品基础字段。

4\. `extraInfo` 放详情扩展字段。

5\. 拆成两个模块方便前端按模块渲染，也方便后续扩展。

