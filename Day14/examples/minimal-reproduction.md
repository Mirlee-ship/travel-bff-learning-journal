Day14 最小复现示例

一、原始复杂请求

{

&#x20; "statusList": \["PENDING\_FOR\_SUPPLIER"],

&#x20; "categoryList": \["ONE\_SECOND\_PARTY"],

&#x20; "itemName": "露营",

&#x20; "contactMobile": "138\*\*\*\*0000",

&#x20; "createdAt": \[

&#x20;   1710000000000,

&#x20;   1711000000000

&#x20; ],

&#x20; "pageIndex": 0,

&#x20; "pageSize": 20

}

二、第一步：只保留必要参数

{

&#x20; "categoryList": \["ONE\_SECOND\_PARTY"],

&#x20; "pageIndex": 0,

&#x20; "pageSize": 20

}



如果正常，继续增加条件。



三、第二步：增加状态条件

{

&#x20; "categoryList": \["ONE\_SECOND\_PARTY"],

&#x20; "statusList": \["PENDING\_FOR\_SUPPLIER"],

&#x20; "pageIndex": 0,

&#x20; "pageSize": 20

}

四、第三步：增加商品名称

{

&#x20; "categoryList": \["ONE\_SECOND\_PARTY"],

&#x20; "statusList": \["PENDING\_FOR\_SUPPLIER"],

&#x20; "itemName": "露营",

&#x20; "pageIndex": 0,

&#x20; "pageSize": 20

}

五、第四步：增加时间条件

{

&#x20; "categoryList": \["ONE\_SECOND\_PARTY"],

&#x20; "statusList": \["PENDING\_FOR\_SUPPLIER"],

&#x20; "itemName": "露营",

&#x20; "createdAt": \[

&#x20;   1710000000000,

&#x20;   1711000000000

&#x20; ],

&#x20; "pageIndex": 0,

&#x20; "pageSize": 20

}

六、定位结论



如果前三步正常，加入时间条件后为空，应重点检查：



时间单位

开始时间和结束时间

时区

页面日期转换

后端时间字段映射



最小复现的目的：



用最少的参数稳定出现问题，

定位是哪一个条件引起异常。

