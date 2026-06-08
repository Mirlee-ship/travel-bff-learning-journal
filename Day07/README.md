Day07：订单详情聚合接口 getOrderById

一、当天核心目标



Day07 学习后台订单详情聚合接口：



trade-bff / web / getOrderById



它解决的问题是：



运营人员从订单列表点击某一笔订单的详情，

前端提交 tradeOrderId，

后端查询订单基础信息和关联业务数据，

最后组装成详情页可以直接展示的模块。



一句话理解：



Day05 看订单列表，Day06 看订单汇总，Day07 看某一笔订单的完整详情。

二、和前两天的关系

Day	接口	作用

Day05	queryOrderForParty	查询订单明细列表

Day06	querySummaryInfoForParty	查询订单汇总统计

Day07	getOrderById	查询单笔订单完整详情



可以记成：



列表：找到订单

汇总：看整体数据

详情：看清某一笔订单

三、核心接口

moduleName: trade-bff

serviceName: web

funcName: getOrderById



核心入参：



tradeOrderId



对应理解：



进入 trade-bff 模块

→ 加载 web 服务

→ 执行 getOrderById

→ 根据 tradeOrderId 查询详情

四、核心调用链

后台订单列表点击详情

→ 前端取得 tradeOrderId

→ biz 统一入口

→ 路由到 trade-bff / web / getOrderById

→ 查询订单基础信息

→ 补充商品、履约、旅游、拼团和关联订单信息

→ 按详情页模块组装

→ 返回订单详情

→ 前端渲染详情页

五、核心返回模块



常见概念模块包括：



basicOrderInfo：订单基础信息

commodityInfo：商品信息

fulfillmentInfo：履约信息

tourismInfo：旅游或出行人信息

groupBookingInfo：拼团或组团信息

subOrderInfo：子订单或关联订单信息



具体字段和模块名称以真实接口响应为准。



六、为什么叫聚合详情接口



详情页需要的数据不一定全部来自订单本身。



它还可能涉及：



商品域

履约域

旅游域

用户域

拼团域

退款域

关联订单



BFF 根据 tradeOrderId 查询并整理这些数据，最终返回前端可以直接渲染的详情结构。



七、Day07 必须掌握的 10 句话

getOrderById 是后台订单详情聚合接口。

它属于 trade-bff / web 服务。

核心入参是 tradeOrderId。

tradeOrderId 来自订单列表中被点击的订单。

详情接口不仅查询订单基础信息，还会补充关联业务信息。

常见模块包括订单、商品、履约、旅游、拼团和关联订单信息。

购买人和实际出行人可能不同，所以旅游信息需要独立表达。

后端聚合可以减少前端请求数量和数据拼装工作。

某个非核心关联模块为空，不一定意味着整个详情失败。

该接口体现了 BFF 跨服务编排和页面模型组装的价值。

八、本日材料

类型	文件

学习记录	docs/day07-get-order-by-id.md

调用链图	diagrams/day07-get-order-by-id.md

示例请求和响应	examples

面试笔记	interview/day07-get-order-by-id-interview-notes.md

九、30 秒面试话术



Day07 我复盘的是后台订单详情聚合接口 getOrderById。运营从订单列表点击详情后，前端会把 tradeOrderId 传给 BFF。接口根据订单 ID 查询基础订单信息，并补充商品、履约、旅游、拼团和关联订单等数据，最后按详情页模块组装后返回前端。这个接口体现的是 BFF 跨服务查询和页面模型组装能力。

