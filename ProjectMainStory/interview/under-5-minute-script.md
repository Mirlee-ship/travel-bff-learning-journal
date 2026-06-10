商品搜索字段扩展：5 分钟以内讲解稿



我实习期间参与过一个旅行社商品搜索接口改造。



对应页面是旅行社商品检索页，主要搜索跟团游和周边游商品。前端希望增加“供给来源”筛选，同时在结果中返回供给来源，用来区分自营和代卖商品。



字段名是 supplySource，实际请求值是“自营”或“代卖”。



带教给了我 searchItem 方法名，它位于：



src/cloud/functions/biz/commodity/service/search.ts



对外接口是：



POST /commodity/search-item



项目内部通过：



commodity / search / searchItem



路由到该方法。



我主要处理了三部分。



第一部分是请求筛选。请求类型中 supplySource 是可选枚举。当前端传入时，SQL 会加入：



ISI.supplySource = ?



并把“自营”或“代卖”放入查询参数。



第二部分是查询字段。SQL 查询的是 ItemSearchInfo 表。除了 WHERE 中按供给来源筛选，SELECT 中也要查询 ISI.supplySource，否则前端虽然能够筛选，却拿不到字段。



第三部分是返回映射。SQL 执行结果进入 queryResult，其中 supplySource 的类型是 string。之后项目通过 queryResult.map 组装返回结果：



supplySource: item.supplySource || ''



所以完整链路是：



前端请求

→ 云函数路由

→ SQL WHERE

→ SQL SELECT

→ queryResult

→ map

→ 前端响应



修改完成后，我更新测试 JSON，重新推送云函数，在微信云函数测试环境执行，并查看接口响应和日志。



我会测试不传供给来源、传自营、传代卖以及分页和空结果场景。



联调期间前端反馈过接口报错。具体错误信息现在记不清了，但我当时按照测试参数、云函数入口、SQL、queryResult 和 map 的顺序逐层排查。



最后代码经过带教 Review 和测试验证，并补充了接口文档。



这个任务代码量不大，但让我完整经历了需求理解、代码定位、SQL 查询、结果映射、云函数测试、日志排查和前端联调。我也真正理解了后端增加字段不能只修改 SQL，而要保证请求、查询和响应整条链路一致。

