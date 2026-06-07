\# Day04：商品详情接口 getItemInfo



\## 一、当天核心目标



Day04 学习商品详情接口 `getItemInfo`。



它解决的问题是：



用户在商品列表页找到商品后，点击某一个商品，需要查看这个商品的完整详情。



\---



\## 二、和 Day03 的关系



Day03 学的是 `searchItem`。



它负责：



```text

找商品


Day04 学的是 getItemInfo。



它负责：



看商品详情



两者关系：



searchItem 返回商品列表

→ 用户点击某个商品

→ 前端拿到 itemId

→ getItemInfo 查询详情

三、核心接口

POST /commodity/get-item-info



核心入参：



{

&#x20; "itemId": "demo-item-001"

}



核心出参：



{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "basicInfo": {},

&#x20;   "extraInfo": {}

&#x20; }

}

四、核心理解



商品详情接口和列表接口要分开。



列表接口关注：



搜索

筛选

排序

分页

多个商品摘要



详情接口关注：



单个商品

完整详情

basicInfo

extraInfo

详情页渲染

五、basicInfo 和 extraInfo



basicInfo 适合放商品基础信息，例如：



商品 ID

商品名称

商品类目

价格

头图

行程天数

供给来源

商品状态



extraInfo 适合放详情页扩展信息，例如：



商品标签

商品亮点

补充说明

供应商信息

负责人信息

详情页展示配置

六、Day04 必须掌握的 8 句话

searchItem 负责找商品，getItemInfo 负责看商品详情。

getItemInfo 的核心入参是 itemId。

itemId 来自列表页返回的商品 ID。

详情接口不需要 keyword、sortType、pageIndex。

basicInfo 表示商品基础信息。

extraInfo 表示商品扩展信息。

拆成 basicInfo 和 extraInfo 是为了方便前端模块化渲染。

这个接口体现了 BFF / 服务层对详情页数据的结构化组装能力。

七、本日材料

类型	文件

学习记录	docs/day04-get-item-info.md

调用链图	diagrams/day04-get-item-info.md

示例请求/响应	examples

面试笔记	interview/day04-get-item-info-interview-notes.md

八、30 秒面试话术



商品详情页使用 getItemInfo 接口。前端从列表页拿到商品 itemId 后，请求详情接口。这个接口的职责不是搜索，而是根据 itemId 查询并组装单个商品的详情信息，返回 basicInfo 和 extraInfo 两部分。basicInfo 承载商品名称、价格、类目等基础字段，extraInfo 承载标签、补充说明、供应商或详情页扩展字段。这样前端可以按模块渲染详情页，也方便后续扩展字段。

