import { getInstance as getRedisInstance } from 'vitality-sdk/redis'

/**

学习整理示例：
用户身份和内部服务身份是两类不同凭证。
*/
export async function loadInternalServiceToken(): Promise {
const redis = getRedisInstance()

const token = await redis.hget(
'global:feature',
'tokenKey',
)

if (!token) {
throw new Error('Missing internal service token')
}

process.env.authorizationTokenInside = token

return token
}

/**

内部 token 只用于服务端调用：




不返回给前端


不完整打印到日志


不放在公开示例中
*/