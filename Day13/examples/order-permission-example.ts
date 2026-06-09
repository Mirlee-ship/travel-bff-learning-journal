/**

学习模拟示例：
展示订单详情如何结合 userContext 校验数据范围。


不代表已确认的项目生产代码。
*/

interface UserContext {
userId: string
storeId: string
permissions: string[]
}

interface GetOrderParam {
tradeOrderId: string
}

interface OrderDetail {
tradeOrderId: string
storeId: string
orderNo: string
}

export async function getOrderDetailWithPermission(
param: GetOrderParam,
userContext: UserContext,
): Promise {
if (!param.tradeOrderId) {
throw new Error('tradeOrderId is required')
}

if (!userContext.permissions.includes('ORDER_DETAIL_READ')) {
throw new Error('Permission denied')
}

const order = await queryDemoOrder(param.tradeOrderId)

if (!order) {
throw new Error('Order not found')
}

if (order.storeId !== userContext.storeId) {
throw new Error('Permission denied')
}

return order
}

async function queryDemoOrder(
tradeOrderId: string,
): Promise<OrderDetail | null> {
return {
tradeOrderId,
storeId: 'demo-store-A',
orderNo: 'demo-order-no',
}
}