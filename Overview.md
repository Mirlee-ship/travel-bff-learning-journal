\# 共比邻旅行社 BFF 项目学习总览



本仓库不是公司源码，而是我离职后基于脱敏接口、代码证据和学习复盘整理的项目理解材料。



核心目标：



1\. 记录我对项目的学习过程

2\. 把项目理解整理成可面试表达

3\. 面试时可以用 GitHub 展示调用链、接口样例和学习成果



\---



\## 面试演示方式



面试时不需要逐个打开所有文件。



固定演示顺序：



1\. 打开本页 Overview.md

2\. 点击某一天的 README

3\. 先讲当天核心链路

4\. 再打开调用链图

5\. 最后打开 examples 和 interview 文件回答追问



\---



\## 学习目录



| Day | 主题 | 展示入口 | 核心价值 |

|---|---|---|---|

| Day01 | 项目概览与 BFF 整体结构 | \[Day01 README](Day01/README.md) | 理解项目背景、BFF 定位、整体调用链 |

| Day02 | biz 统一入口与动态路由 | \[Day02 README](Day02/README.md) | 理解 moduleName / serviceName / funcName 如何定位业务方法 |

| Day03 | 商品检索 searchItem | \[Day03 README](Day03/README.md) | 理解搜索、筛选、排序、分页、批量补充如何收敛到统一接口 |

| Day04 | 商品详情 getItemInfo | \[Day04 README](Day04/README.md) | 理解 itemId 查询详情、basicInfo/extraInfo 结构化返回 |

| Day05 | 一日聚订单列表 queryOrderForParty | \[Day05 README](Day05/README.md) | 理解后台订单筛选、分页、字段补充与 list/total 返回 |

| Day06 | 一日聚订单汇总 querySummaryInfoForParty | \[Day06 README](Day06/README.md) | 理解订单汇总统计、商品维度聚合和统计口径差异 |

| Day07 | 订单详情聚合 getOrderById | \[Day07 README](Day07/README.md) | 理解 tradeOrderId、详情模块和跨业务域数据聚合 |

| Day08 | 订单分片导出 batchDownloadTradeOrderRawData | \[Day08 README](Day08/README.md) | 理解列表导出口径、分页分片和 headerMap/data 返回 |

| Day09 | 订单整包导出 batchDownloadTradeOrder | \[Day09 README](Day09/README.md) | 理解导出字段转换、Excel 生成、对象存储上传和下载地址返回 |

| Day10 | Redis 配置缓存与状态能力 | \[Day10 README](Day10/README.md) | 理解 hget 配置读取、TTL、短期状态、轻量队列与缓存边界 |

| Day11 | 日志、异常处理与监控告警 | \[Day11 README](Day11/README.md) | 理解 apiContext、异常分类、飞书告警和请求上下文清理 |

| Day12 | 异步任务、定时任务与 Trigger | \[Day12 README](Day12/README.md) | 理解 taskId、任务状态、Trigger、Job、幂等、分批处理与失败重试 |

| Day13 | 用户身份上下文、鉴权与权限边界 | \[Day13 README](Day13/README.md) | 理解 param/userContext、认证授权、门店数据权限、内部 token 和上下文清理 |

| Day14 | 接口测试、前后端联调与错误定位 | \[Day14 README](Day14/README.md) | 理解 Network 检查、参数核对、响应分类、traceId 日志定位和最小复现 |

\---



\## 项目核心调用链



页面请求

→ biz 统一入口

→ 根据 moduleName / serviceName / funcName 动态路由

→ 执行业务 Service

→ 查询 / 编排 / 聚合数据

→ 统一包装响应

→ 返回前端



\---



\## 面试介绍这个仓库时可以这样说



这个仓库是我对共比邻旅行社 BFF 项目的脱敏复盘材料。

我没有上传公司源码、真实订单、手机号、Token 或内部数据。

我主要把自己学习和参与过的接口链路整理成学习记录、调用链图、示例请求响应和面试话术。



面试时我会从 Overview.md 进入，每个 Day 的 README 是当天展示入口。

