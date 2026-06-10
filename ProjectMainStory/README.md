项目主讲：商品搜索接口 supplySource 字段扩展

一、任务概述



我在 TheVitality 项目实习期间，参与了旅行社商品搜索接口 searchItem 的字段扩展。



业务需求是：



前端需要根据商品供给来源进行筛选，

同时在商品搜索结果中返回供给来源。



供给来源字段：



supplySource



实际业务值：



自营

代卖

二、页面和接口



对应页面：



旅行社商品检索页



商品范围：



跟团游

周边游



对外接口：



POST /commodity/search-item



内部云函数路由：



moduleName: commodity

serviceName: search

funcName: searchItem



核心方法：



src/cloud/functions/biz/commodity/service/search.ts

三、完整字段链路

前端传入 supplySource

→ biz 统一入口

→ commodity / search / searchItem

→ 处理请求参数

→ SQL WHERE 增加供给来源条件

→ SQL SELECT 查询 supplySource

→ MySQL 返回 queryResult

→ queryResult.map 组装响应

→ 返回 supplySource 给前端

四、核心代码证据



请求类型：



supplySource?: SupplySource



枚举：



export enum SupplySource {

&#x20; SELF = '自营',

&#x20; AGENT = '代卖',

}



SQL 条件：



if (req.supplySource) {

&#x20; conditions.push('ISI.supplySource = ?')

&#x20; queryParams.push(req.supplySource)

}



数据库：



表：ItemSearchInfo

别名：ISI

字段：supplySource



查询结果类型：



supplySource: string



接口返回映射：



supplySource: item.supplySource || ''

五、我实际参与的工作

理解前端字段需求

根据 searchItem 定位代码入口

梳理云函数和后端调用链

检查请求参数类型

补充或确认 SQL 筛选条件

补充或确认 SELECT 查询字段

检查 queryResult 类型

检查 map 返回映射

更新测试 JSON

推送云函数进行测试

查看云函数日志排查问题

配合前端联调

编写接口文档

提交代码并接受带教 Review

六、这个任务的难点



这个任务代码改动量不大，真正的难点是：



刚进入项目时不熟悉分层

需要从 searchItem 追到 SQL 查询

需要理解 queryResult 和 map 的作用

需要保证请求、查询和响应字段一致

需要通过云函数日志排查接口错误



如果只修改其中一层，可能出现：



只改 WHERE：

可以筛选，但前端拿不到字段



只改 SELECT：

字段查出来了，但无法按字段筛选



只改 SQL、不改 map：

数据库有字段，但最终响应中没有



枚举值传错：

前端传 SELF，但数据库存的是“自营”，导致查不到数据

七、职责边界



我可以说：



我参与完成了 supplySource 筛选和返回链路的修改、

测试、日志排查、文档和前端联调。



我不能说：



整个 searchItem 都是我开发的

ItemSearchInfo 搜索表是我设计的

云函数动态路由是我搭建的

整个商品搜索系统由我负责

八、面试演示顺序

1\. 本 README

2\. 调用链图

3\. HTTP 请求示例

4\. 云函数请求示例

5\. SQL 和 map 代码证据

6\. 5～10 分钟讲解稿

7\. 高频追问

九、30 秒总结



我参与过旅行社商品搜索接口 searchItem 的字段扩展，为接口增加了供给来源 supplySource 的筛选和返回能力。我从请求类型开始，沿着云函数路由定位到 SQL 查询，再检查 queryResult 和 map 返回结构，确保字段从前端请求一直贯通到最终响应。修改后通过微信云函数测试、日志排查、前端联调和带教 Review 完成验收。

