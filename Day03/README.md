\# Day03：商品检索统一接口 searchItem



\## 一、当天核心目标



Day03 学习旅行社商品检索接口 searchItem。



它解决的问题是：



一个商品列表页同时支持关键词、价格、行程天数、供给来源、排序和分页。



项目没有为每个条件单独写接口，而是用一个 searchItem 统一承接。



\---



\## 二、核心理解



searchItem 的核心不是简单查商品表，而是完成一条完整的商品检索链路：



关键词 / 标签

→ 候选商品 ID

→ 动态筛选条件

→ 排序分页

→ 列表和总数并行查询

→ 批量补充头图和城市

→ 组装 data + total



这体现了 BFF 层的接口编排和页面模型组装能力。



\---



\## 三、核心调用链



旅行社商品页面提交搜索条件

→ POST /commodity/search-item

→ searchItem

→ 关键词或标签转换成候选商品 ID

→ 组装 conditions 和 queryParams

→ 构建列表 SQL 和总数 SQL

→ 添加排序与分页

→ Promise.all 并行查询列表和总数

→ 批量补充头图和城市

→ 解析标签并计算利润

→ 返回 data + total



\---



\## 四、本日材料



| 类型 | 文件 |

|---|---|

| 学习记录 | \[docs/day03-search-item.md](docs/day03-search-item.md) |

| 调用链图 | \[diagrams/day03-search-item.md](diagrams/day03-search-item.md) |

| 示例请求/响应 | \[examples](examples/) |

| 面试笔记 | \[interview](interview/) |



\---



\## 五、30 秒面试话术



旅行社商品页使用统一的 searchItem 接口承接关键词、价格区间、行程天数、供给来源、排序和分页。关键词和标签会先转换成候选商品 ID，随后服务动态构造参数化 SQL。列表和总数通过 Promise.all 并行查询，再批量补充商品头图和关联城市，最终组装成统一的 data + total 返回前端。



\---



\## 六、Day03 最重要的五层理解



第一层：先找候选商品  

关键词、标签 → 商品 ID



第二层：继续筛选  

价格、天数、来源



第三层：排序和分页  

按什么顺序、取第几页



第四层：补充页面信息  

头图、城市、标签、利润



第五层：返回结果  

data + total



\---



\## 七、面试演示顺序



1\. 打开本 README，说明 searchItem 的核心价值

2\. 打开调用链图，顺着图讲完整链路

3\. 打开 examples/search-item-filter-request.json，解释请求参数

4\. 打开 success 和 empty 响应，说明有数据和无数据的区别

5\. 打开 interview 文件，展示 30 秒和 90 秒话术

