Day14 接口响应分类

一、成功且有数据

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "list": \[

&#x20;     {

&#x20;       "orderNo": "demo-order-001",

&#x20;       "itemName": "一日聚露营套餐"

&#x20;     }

&#x20;   ],

&#x20;   "total": 1

&#x20; }

}



结论：



接口执行成功，并且当前条件存在匹配数据。

二、成功但为空

{

&#x20; "success": true,

&#x20; "data": {

&#x20;   "list": \[],

&#x20;   "total": 0

&#x20; }

}



结论：



接口执行成功，但当前条件没有匹配数据。



需要检查：



筛选条件

分页下标

时间范围

商品名称

数据权限

三、业务失败

{

&#x20; "success": false,

&#x20; "message": "无权查看该订单",

&#x20; "errorCode": 40301,

&#x20; "data": null

}



结论：



系统正常运行，但业务条件不允许。

四、系统失败

{

&#x20; "success": false,

&#x20; "message": "Downstream service unavailable",

&#x20; "errorCode": -1,

&#x20; "requestId": "demo-request-id-014",

&#x20; "traceId": "demo-trace-id-014"

}



结论：



可能存在代码、网络、数据库或下游服务异常。



处理：



记录发生时间、traceId、requestId 和请求参数，

再查询后端日志。

