Day08: Batch Export Call Chain

Full call chain

flowchart TD

&#x20;   A\["Order dashboard page"] --> B\["User selects filters"]

&#x20;   B --> C\["User clicks export"]

&#x20;   C --> D\["Keep the same list filters"]

&#x20;   D --> E\["Request batchDownloadTradeOrderRawData"]

&#x20;   E --> F\["biz unified entry"]

&#x20;   F --> G\["Route to trade-bff web service"]

&#x20;   G --> H\["Read pageIndex and pageSize"]

&#x20;   H --> I\["Query current batch"]

&#x20;   I --> J\["Convert export fields"]

&#x20;   J --> K\["Build headerMap and data"]

&#x20;   K --> L\["Return current batch"]

&#x20;   L --> M{"More batches"}

&#x20;   M -->|Yes| N\["Increase pageIndex"]

&#x20;   N --> E

&#x20;   M -->|No| O\["Finish collecting export data"]

简化版调用链

后台选择筛选条件

→ 点击导出

→ 保留列表筛选条件

→ 请求 RawData 导出接口

→ 按 pageIndex 和 pageSize 查询当前批次

→ 组装 headerMap 和 data

→ 返回当前批次

→ 继续请求下一批

→ 完成数据收集

中文讲解

运营先在订单后台选择筛选条件。

点击导出时，需要保留与列表相同的筛选条件。

请求通过 biz 入口路由到 trade-bff / web。

导出接口根据 pageIndex 和 pageSize 查询当前批次。

当前批次数据会转换成导出字段结构。

接口返回 headerMap + data。

如果还有数据，递增 pageIndex 获取下一批。



说明：最终合并数据和生成文件的位置，以项目真实实现为准。



面试讲解重点

导出不能只使用当前页数据。

导出和列表必须尽量保持筛选口径一致。

pageIndex 和 pageSize 用于拆分大结果集。

headerMap 表示导出列映射。

data 表示当前批次的行数据。

分片降低单次请求的超时和内存风险。

