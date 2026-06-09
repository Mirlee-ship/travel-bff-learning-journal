import { getInstance as getRedisInstance } from 'vitality-sdk/redis'

/**

学习模拟示例，不代表已确认的生产代码。


使用 setex 保存短期状态：
标记某个订单通知在 10 分钟内已经处理。
*/
export async function markNotificationSent(
orderId: string,
): Promise {
if (!orderId) {
throw new Error('orderId is required')
}

const redis = getRedisInstance()
const key = demo:notification:sent:${orderId}

await redis.setex(key, 600, '1')
}

