/**

学习模拟示例：
展示后台 Job 的锁、幂等、状态和有限重试思路。


不代表已确认的项目生产实现。
*/

type TaskStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED'

interface DemoTask {
taskId: string
status: TaskStatus
retryCount: number
result?: {
downloadUrl: string
}
errorMessage?: string
}

const MAX_RETRY_COUNT = 3

export async function processDemoTask(taskId: string): Promise {
if (!taskId) {
throw new Error('taskId is required')
}

const lockKey = demo:job:lock:${taskId}
const acquired = await acquireDemoLock(lockKey, 60)

if (!acquired) {
return
}

try {
const task = await getDemoTask(taskId)

if (!task) {
  throw new Error('Task not found')
}

if (task.status === 'SUCCESS') {
  return
}

await updateDemoTask(taskId, {
  status: 'PROCESSING',
})

try {
  const result = await runDemoBusiness(task)

  await updateDemoTask(taskId, {
    status: 'SUCCESS',
    result,
    errorMessage: undefined,
  })
} catch (error) {
  const retryCount = task.retryCount + 1
  const message =
    error instanceof Error ? error.message : 'Unknown task error'

  if (retryCount >= MAX_RETRY_COUNT) {
    await updateDemoTask(taskId, {
      status: 'FAILED',
      retryCount,
      errorMessage: message,
    })

    await sendDemoAlert(taskId, message)
    return
  }

  await updateDemoTask(taskId, {
    status: 'PENDING',
    retryCount,
    errorMessage: message,
  })
}

} finally {
await releaseDemoLock(lockKey)
}
}

async function acquireDemoLock(
_key: string,
_ttlSeconds: number,
): Promise {
return true
}

async function releaseDemoLock(_key: string): Promise {
return
}

async function getDemoTask(taskId: string): Promise<DemoTask | null> {
return {
taskId,
status: 'PENDING',
retryCount: 0,
}
}

async function updateDemoTask(
_taskId: string,
_patch: Partial,
): Promise {
return
}

async function runDemoBusiness(
_task: DemoTask,
): Promise<{ downloadUrl: string }> {
return {
downloadUrl: 'https://example.invalid/demo-export.xlsx',
}
}

async function sendDemoAlert(
_taskId: string,
_message: string,
): Promise {
return
}