/**

学习模拟示例。


展示同一个数据库中的多步操作，
如何通过本地事务一起提交或回滚。


不代表项目真实生产代码。
*/

interface DatabaseTransaction {}

interface Database {
transaction(
handler: (transaction: DatabaseTransaction) => Promise,
): Promise
}

interface ConfirmOrderInput {
orderId: string
operatorId: string
}

declare const database: Database

declare function updateOrderStatus(
orderId: string,
status: string,
transaction: DatabaseTransaction,
): Promise

declare function createFulfillmentRecord(
orderId: string,
transaction: DatabaseTransaction,
): Promise

declare function createOrderStatusLog(
input: {
orderId: string
fromStatus: string
toStatus: string
operatorId: string
},
transaction: DatabaseTransaction,
): Promise

export async function confirmOrder(
input: ConfirmOrderInput,
): Promise {
if (!input.orderId) {
throw new Error('orderId is required')
}

await database.transaction(async transaction => {
await updateOrderStatus(
input.orderId,
'CONFIRMED',
transaction,
)

await createFulfillmentRecord(
  input.orderId,
  transaction,
)

await createOrderStatusLog(
  {
    orderId: input.orderId,
    fromStatus: 'PENDING',
    toStatus: 'CONFIRMED',
    operatorId: input.operatorId,
  },
  transaction,
)

})

/**

通知、统计等外部副作用，
通常不建议长时间阻塞数据库事务。
*/
}