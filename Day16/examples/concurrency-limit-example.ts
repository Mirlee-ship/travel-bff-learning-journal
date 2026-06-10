/**

学习模拟示例。


下游没有批量接口时，
使用分批方式控制并发数量。
*/

export async function runWithConcurrencyLimit<T, R>(
items: T[],
worker: (item: T) => Promise,
concurrency = 10,
): Promise<R[]> {
if (!Number.isInteger(concurrency) || concurrency <= 0) {
throw new Error('concurrency must be a positive integer')
}

const results: R[] = []

for (let index = 0; index < items.length; index += concurrency) {
const batch = items.slice(index, index + concurrency)

const batchResults = await Promise.all(
  batch.map(item => worker(item)),
)

results.push(...batchResults)

}

return results
}

/**

示例：


100 个任务
concurrency = 10


每次最多同时执行 10 个任务，
避免一次发出 100 个请求。
*/