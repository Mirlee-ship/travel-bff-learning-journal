\# Day02：biz 统一入口与动态路由



\## 一、当天核心目标



Day02 主要理解：



1\. 页面请求为什么先进入 biz/index.ts

2\. moduleName、serviceName、funcName 分别决定什么

3\. 统一入口如何找到并执行具体业务方法

4\. 成功、空结果、失败响应怎么区分



\---



\## 二、核心理解



项目不是每个接口都单独写一套路由逻辑，而是通过统一入口处理公共能力：



\- 解析请求

\- 读取路由字段

\- 加载业务 Service

\- 执行具体方法

\- 记录日志

\- 处理异常

\- 包装响应

\- 清理上下文



\---



\## 三、路由字段示例



以一日聚订单列表为例：



moduleName = trade-bff  

serviceName = web  

funcName = queryOrderForParty  



含义是：



进入 trade-bff 模块  

→ 加载 web 服务  

→ 执行 queryOrderForParty 方法



\---



\## 四、核心调用链



后台页面发起订单查询

→ biz/index.ts 统一入口

→ 读取 moduleName / serviceName / funcName

→ 定位 trade-bff 模块

→ 加载 web Service

→ 执行 queryOrderForParty

→ 返回 list + total

→ 统一入口包装 success + data

→ 返回前端



\---



\## 五、本日材料



| 类型 | 文件 |

|---|---|

| 学习记录 | \[docs/day02-biz-routing.md](docs/day02-biz-routing.md) |

| 调用链图 | \[diagrams/day02-biz-routing.md](diagrams/day02-biz-routing.md) |

| 示例请求/响应 | \[examples](examples/) |

| 面试笔记 | \[interview](interview/) |



\---



\## 六、30 秒面试话术



项目使用 biz 云函数作为统一入口。请求通过 moduleName、serviceName 和 funcName 动态定位业务方法。例如一日聚订单列表会定位到 trade-bff 的 web Service，并执行 queryOrderForParty。业务方法返回 list 和 total 后，入口统一负责日志、耗时统计、异常处理和响应包装。



\---



\## 七、面试演示顺序



1\. 打开本 README，说明统一入口的作用

2\. 打开调用链图，顺着图讲动态路由

3\. 打开 examples，解释三个路由字段

4\. 对比成功、空结果、失败响应

5\. 打开 interview 文件，展示可面试表达

