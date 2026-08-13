// Use default import for ioredis v6+
import Redis from 'ioredis'

// Use a simpler type approach
let client: any = null
let isConnected = false

export function getRedisClient(): any {
  if (!client) {
    const host = process.env.REDIS_HOST || 'localhost'
    const port = parseInt(process.env.REDIS_PORT || '6379')
    const password = process.env.REDIS_PASSWORD

    // Use the default import directly
    client = new (Redis as any)({
      host,
      port,
      password: password || undefined,
      retryStrategy: (times: number) => Math.min(times * 50, 2000),
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    })

    client.on('connect', () => {
      isConnected = true
      console.log('✅ Redis connected successfully')
    })

    client.on('error', (err: Error) => {
      isConnected = false
      console.error('❌ Redis error:', err.message)
    })

    client.connect().catch((err: Error) => {
      console.error('❌ Failed to connect to Redis:', err.message)
    })
  }

  return client
}

export function isRedisConnected(): boolean {
  return isConnected
}

export async function getRedisValue<T>(key: string): Promise<T | null> {
  if (!isConnected || !client) return null
  try {
    const value = await client.get(key)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export async function setRedisValue(key: string, value: any, ttl?: number): Promise<void> {
  if (!isConnected || !client) return
  try {
    const serialized = JSON.stringify(value)
    if (ttl) {
      await client.setex(key, ttl, serialized)
    } else {
      await client.set(key, serialized)
    }
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

export async function deleteRedisValue(key: string): Promise<void> {
  if (!isConnected || !client) return
  try {
    await client.del(key)
  } catch (error) {
    console.error('Redis delete error:', error)
  }
}

export async function deleteRedisPattern(pattern: string): Promise<void> {
  if (!isConnected || !client) return
  try {
    const keys = await client.keys(pattern)
    if (keys.length > 0) {
      await client.del(...keys)
    }
  } catch (error) {
    console.error('Redis deletePattern error:', error)
  }
}

export async function getRedisInfo(): Promise<any> {
  if (!isConnected || !client) return null
  try {
    const info = await client.info()
    const lines = info.split('\n')
    const result: any = {}
    for (const line of lines) {
      if (line.startsWith('#') || !line.includes(':')) continue
      const [key, value] = line.split(':')
      if (key && value) {
        result[key.trim()] = value.trim()
      }
    }
    return result
  } catch {
    return null
  }
}