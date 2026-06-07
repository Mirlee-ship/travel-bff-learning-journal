# Day 3：商品检索接口调用链图

## searchItem 完整调用链

```mermaid
flowchart TD
    A["旅行社商品页面提交搜索条件"] --> B["POST /commodity/search-item"]
    B --> C["执行 searchItem"]
    C --> D{"是否传入 tagId"}
    D -->|是| E["查询标签关联的商品 ID"]
    D -->|否| F{"是否传入 keyword"}
    E --> F
    F -->|是| G["调用 commonSearchItem 获取候选商品 ID"]
    F -->|否| H["继续构造查询条件"]
    G --> I{"候选商品 ID 是否为空"}
    I -->|是| J["提前返回 data 空数组和 total 0"]
    I -->|否| H
    H --> K["组装 conditions 和 queryParams"]
    K --> L["构建列表 SQL 和总数 SQL"]
    L --> M["添加排序和分页"]
    M --> N["Promise.all 并行查询列表和总数"]
    N --> O{"当前页是否有商品"}
    O -->|否| P["返回 data 空数组和 total"]
    O -->|是| Q["收集当前页商品 ID"]
    Q --> R["批量查询商品头图"]
    R --> S["批量查询关联城市"]
    S --> T["解析标签并计算利润"]
    T --> U["组装页面商品模型"]
    U --> V["返回 data 和 total"]
```

## 简化版调用链

```text
旅行社商品页面
→ /commodity/search-item
→ searchItem
→ 关键词或标签转换成候选商品 ID
→ 动态筛选
→ 排序分页
→ 列表和总数并行查询
→ 批量补充头图和城市
→ 返回 data + total
```

## 面试讲解重点

1. 关键词和标签不是直接拼 SQL，而是先转换成候选商品 ID。
2. 价格、行程天数、供给来源等参数会继续组成结构化筛选条件。
3. 排序和分页在后端完成，前端只消费结果。
4. 列表和总数通过 Promise.all 并行查询。
5. 头图和城市使用批量补充，避免逐个商品查询。
6. 最终返回统一的 data + total，方便前端渲染列表和分页。