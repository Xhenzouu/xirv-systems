# XIRV Systems — Production Deployment Checklist

## Environment
- [ ] NODE_ENV=production
- [ ] All required environment variables set
- [ ] JWT secrets are unique (not default values)
- [ ] Database URL points to production database
- [ ] TRUST_PROXY=true if behind reverse proxy

## Security
- [ ] CORS origins restricted to allowed domains
- [ ] Helmet security headers enabled
- [ ] Rate limiting configured
- [ ] Audit logging enabled
- [ ] HTTPS enforced (via reverse proxy)
- [ ] Database backups configured
- [ ] Logging configured for production

## Database
- [ ] Migration applied
- [ ] Indexes created
- [ ] Backups scheduled
- [ ] Connection pool configured

## Monitoring
- [ ] Health check endpoint available
- [ ] Logging configured
- [ ] Monitoring/alerting configured

## Deployment
- [ ] Docker image built and tested
- [ ] CI/CD pipeline configured
- [ ] Rollback plan documented
- [ ] Secrets management configured

## Testing
- [ ] All tests pass
- [ ] Load testing completed
- [ ] Security audit performed