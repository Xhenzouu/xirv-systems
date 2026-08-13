import { Router } from 'express'
import { 
  setRedisValue, 
  getRedisValue, 
  getRedisInfo, 
  isRedisConnected 
} from '../services/redis.service.js'

const router = Router()

// Test Redis ping
router.get('/ping', async (req, res) => {
  try {
    // Set a test value
    await setRedisValue('test-key', { 
      message: 'Hello from Redis!', 
      timestamp: new Date().toISOString() 
    }, 60)
    
    // Get the test value
    const data = await getRedisValue('test-key')
    
    // Get Redis stats
    const info = await getRedisInfo()
    
    res.json({
      success: true,
      connected: isRedisConnected(),
      data,
      stats: {
        connectedClients: info?.connected_clients,
        usedMemory: info?.used_memory_human,
        totalCommands: info?.total_commands_processed,
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get Redis stats
router.get('/stats', async (req, res) => {
  try {
    const info = await getRedisInfo()
    const hits = parseInt(info?.keyspace_hits || '0')
    const misses = parseInt(info?.keyspace_misses || '0')
    const total = hits + misses
    const hitRate = total === 0 ? 'N/A' : `${((hits / total) * 100).toFixed(1)}%`
    
    res.json({
      success: true,
      connected: isRedisConnected(),
      stats: {
        connectedClients: info?.connected_clients,
        usedMemory: info?.used_memory_human,
        totalCommands: info?.total_commands_processed,
        uptime: info?.uptime_in_seconds,
        hitRate,
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

export default router