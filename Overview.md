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

