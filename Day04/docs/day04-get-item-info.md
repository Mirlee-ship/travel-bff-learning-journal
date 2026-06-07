\# Day04 学习记录：商品详情接口 getItemInfo



\## 一、今天学什么



今天学习商品详情接口：



```text

POST /commodity/get-item-info



它的作用是根据 itemId 查询单个商品详情，支撑商品详情页渲染。



二、为什么需要详情接口



商品列表页和商品详情页展示的数据不同。



列表页主要展示摘要信息：



商品名

价格

头图

行程天数

城市



详情页需要展示完整信息：



商品基础信息

商品扩展信息

详情说明

供应商信息

下单前展示内容



所以列表接口和详情接口要分开。



三、核心入参

{

&#x20; "itemId": "demo-item-001"

}



itemId 表示用户要查看的商品 ID。



这个 ID 通常来自 Day03 的 searchItem 列表结果。



四、核心出参

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "basicInfo": {

&#x20;     "itemId": "demo-item-001",

&#x20;     "itemName": "云南六日游",

&#x20;     "salePrice": 399900,

&#x20;     "costDays": 6

&#x20;   },

&#x20;   "extraInfo": {

&#x20;     "tags": \["亲子游", "纯玩团"],

&#x20;     "supplierName": "示例供应商",

&#x20;     "notice": "下单前请确认出行日期"

&#x20;   }

&#x20; }

}

五、basicInfo 的含义



basicInfo 是商品基础信息，适合放稳定字段。



例如：



商品 ID

商品名称

价格

类目

头图

行程天数

商品状态

六、extraInfo 的含义



extraInfo 是详情扩展信息，适合放详情页补充字段。



例如：



商品标签

亮点

补充说明

供应商信息

负责人信息

展示配置

七、为什么不把详情字段放到 searchItem



因为 searchItem 是列表接口，一次返回多个商品。



如果每个商品都带完整详情，会导致：



返回体变大

查询更慢

列表页加载压力增加

很多详情字段在列表页用不到



所以合理方式是：



列表页轻量展示

详情页按 itemId 单独查询

八、完整调用链

用户在列表页点击商品

→ 前端拿到商品 itemId

→ 请求 /commodity/get-item-info

→ 后端根据 itemId 查询详情

→ 组装 basicInfo 和 extraInfo

→ 返回前端

→ 前端渲染详情页

九、我今天真正理解的结论



searchItem 是找商品，getItemInfo 是看商品。



详情接口通过 itemId 精准查询单个商品，并把详情数据拆成 basicInfo 和 extraInfo，这样前端可以按模块渲染页面，后续扩展字段也更清晰。

