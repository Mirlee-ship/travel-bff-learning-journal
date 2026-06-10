Day16: N Plus One Optimization

N plus one flow

flowchart TD

&#x20;   A\[Query order list] --> B\[Receive N orders]

&#x20;   B --> C\[Loop through orders]

&#x20;   C --> D\[Query one item for each order]

&#x20;   D --> E\[Repeat N times]

&#x20;   E --> F\[Build response]

Batch query flow

flowchart TD

&#x20;   A\[Query order list] --> B\[Collect item IDs]

&#x20;   B --> C\[Remove duplicate IDs]

&#x20;   C --> D\[Batch query items]

&#x20;   D --> E\[Build item Map]

&#x20;   E --> F\[Map orders with item data]

&#x20;   F --> G\[Build response]

Comparison

N plus one:



Query orders once

→ Query related item N times

→ Total calls equal 1 plus N



Batch query:



Query orders once

→ Batch query related items once

→ Total calls close to 2

Performance analysis flow

flowchart TD

&#x20;   A\[Find slow API] --> B\[Check total time cost]

&#x20;   B --> C\[Split request stages]

&#x20;   C --> D\[Count database and service calls]

&#x20;   D --> E{Repeated queries exist}

&#x20;   E -->|Yes| F\[Use batch query]

&#x20;   E -->|No| G\[Check data size and waiting time]

&#x20;   F --> H\[Remove duplicate IDs]

&#x20;   H --> I\[Build Map and fill result]

&#x20;   G --> J\[Use paging field selection or controlled concurrency]

&#x20;   I --> K\[Measure again]

&#x20;   J --> K

&#x20;   K --> L\[Verify result and stability]

中文讲解

1\. 先通过日志发现接口慢。

2\. 拆分数据库、下游和组装阶段耗时。

3\. 统计调用次数。

4\. 发现 N+1 时先收集关联 ID。

5\. 去重后使用批量接口。

6\. 将批量结果转成 Map。

7\. 回填到主数据。

8\. 再次测量耗时和调用次数。

9\. 确认业务结果没有变化。

