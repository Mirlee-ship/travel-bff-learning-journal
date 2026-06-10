/**

学习模拟示例。


用于说明 N+1 查询问题，
不代表项目真实生产代码。
*/

interface Order {
id: string
itemId: string
}

interface ItemInfo {
id: string
name: string
}

interface OrderView extends Order {
itemInfo: ItemInfo | null
}

declare function queryOrders(): Promise<Order[]>
declare function queryItemById(id: string): Promise<ItemInfo | null>

export async function buildOrderListWithNPlusOne(): Promise<OrderView[]> {
const orders = await queryOrders()

const result: OrderView[] = []

for (const order of orders) {
// 每一条订单都执行一次远程查询。
const itemInfo = await queryItemById(order.itemId)

result.push({
  ...order,
  itemInfo,
})

}

return result
}

/**

如果有 N 条订单：


订单查询：1 次
商品查询：N 次
总调用次数：1 + N
*/