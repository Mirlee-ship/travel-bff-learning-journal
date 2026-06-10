/**

学习模拟示例。


展示通过 idempotencyKey 保存并复用处理结果。


不代表项目真实生产代码。
*/

type ProcessingStatus = 'PROCESSING' | 'SUCCESS' | 'FAILED'

interface IdempotencyRecord {
key: string
status: ProcessingStatus
result?: T
errorMessage?: string
}

interface CreateTaskInput {
idempotencyKey: string
businessId: string
}

interface CreateTaskResult {
taskId: string
businessId: string
}

const idempotencyStore = new Map<
string,
IdempotencyRecord

()

export async function createTaskIdempotently(
input: CreateTaskInput,
): Promise {
if (!input.idempotencyKey) {
throw new Error('idempotencyKey is required')
}

const existingRecord = idempotencyStore.get(
input.idempotencyKey,
)

if (existingRecord?.status === 'SUCCESS' && existingRecord.result) {
return existingRecord.result
}

if (existingRecord?.status === 'PROCESSING') {
throw new Error('Request is already processing')
}

idempotencyStore.set(input.idempotencyKey, {
key: input.idempotencyKey,
status: 'PROCESSING',
})

try {
const result: CreateTaskResult = {
taskId: task-${input.businessId},
businessId: input.businessId,
}

idempotencyStore.set(input.idempotencyKey, {
  key: input.idempotencyKey,
  status: 'SUCCESS',
  result,
})

return result

} catch (error) {
const errorMessage =
error instanceof Error ? error.message : 'Unknown error'

idempotencyStore.set(input.idempotencyKey, {
  key: input.idempotencyKey,
  status: 'FAILED',
  errorMessage,
})

throw error

}
}

/**

真实系统中应使用：


数据库唯一约束
Redis 原子操作
业务幂等表
状态和过期时间


不能依赖进程内 Map。
*/