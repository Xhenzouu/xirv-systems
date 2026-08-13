# XIRV Systems — Production Deployment Checklist

## Environment
- [ ] NODE_ENV=production
- [ ] All required environment variables set
- [ ] JWT secrets are unique (not default values)
- [ ] Database URL points to production database
- [ ] Redis URL points to production Redis instance
- [ ] TRUST_PROXY=true if behind reverse proxy
- [ ] All Redis environment variables configured (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)

## Security
- [ ] CORS origins restricted to allowed domains
- [ ] Helmet security headers enabled
- [ ] Rate limiting configured
- [ ] Audit logging enabled
- [ ] HTTPS enforced (via reverse proxy)
- [ ] Database backups configured
- [ ] Logging configured for production
- [ ] Redis password configured (not default)
- [ ] Redis security group restricted to API access only
- [ ] Cache keys include user context for isolation

## Database
- [ ] Migration applied
- [ ] Indexes created
- [ ] Backups scheduled
- [ ] Connection pool configured

## Redis
- [ ] Redis server running and accessible
- [ ] Redis password set (if using ElastiCache)
- [ ] Redis memory limit configured
- [ ] Redis eviction policy configured (e.g., allkeys-lru)
- [ ] Redis persistence configured (RDB/AOF)
- [ ] Redis connection timeout configured
- [ ] Redis max clients configured
- [ ] Redis monitoring enabled
- [ ] Redis backups configured

## Monitoring
- [ ] Health check endpoint available
- [ ] Logging configured
- [ ] Monitoring/alerting configured
- [ ] Redis monitoring enabled (memory, hit rate, connections)
- [ ] Cache hit/miss metrics tracked

## Deployment
- [ ] Docker image built and tested
- [ ] CI/CD pipeline configured
- [ ] Rollback plan documented
- [ ] Secrets management configured
- [ ] Redis connection failures gracefully handled
- [ ] Cache invalidation verified on all write operations

## Testing
- [ ] All tests pass
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Redis cache hit/miss validation tested
- [ ] Cache invalidation tested
- [ ] Redis failure fallback tested

## Operations
- [ ] PM2 configured with proper restart policies
- [ ] PM2 logs configured
- [ ] PM2 memory limits configured
- [ ] Process monitoring configured
- [ ] Log rotation configured

## Post-Deployment Verification
- [ ] API health check returns 200
- [ ] Redis connection confirmed (`redis6-cli ping` returns PONG)
- [ ] Cache endpoints return "(cached)" on second request
- [ ] Audit logs being written
- [ ] Rate limiting working as expected
- [ ] All environment variables loaded correctly