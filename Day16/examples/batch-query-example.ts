/**

学习模拟示例。


演示：
提取 ID
去重
批量查询
Map 回填
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

declare function batchQueryItems(
itemIds: string[],
): Promise<ItemInfo[]>

export async function buildOrderListWithBatchQuery(): Promise<OrderView[]> {
const orders = await queryOrders()

const itemIds = [
...new Set(
orders
.map(order => order.itemId)
.filter((itemId): itemId is string => Boolean(itemId)),
),
]

if (itemIds.length === 0) {
return orders.map(order => ({
...order,
itemInfo: null,
}))
}

const items = await batchQueryItems(itemIds)

const itemMap = new Map(
items.map(item => [item.id, item]),
)

return orders.map(order => ({
...order,
itemInfo: itemMap.get(order.itemId) ?? null,
}))
}

/**

调用次数：


查询订单：1 次
批量查询商品：1 次
总调用次数接近：2 次
*/