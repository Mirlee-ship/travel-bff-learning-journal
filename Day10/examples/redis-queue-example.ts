import { getInstance as getRedisInstance } from 'vitality-sdk/redis'

/**

学习模拟示例，不代表已确认的生产代码。


使用 lpop 从轻量任务队列中取出一条任务。
*/
export async function popDemoTask(): Promise<string | null> {
const redis = getRedisInstance()

const task = await redis.lpop('demo:task')

if (!task) {
return null
}

return task
}