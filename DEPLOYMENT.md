# Bulgaria From Above - Deployment Guide

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 20+** and **npm 10+** installed
2. **PostgreSQL 15+** database
3. **DigitalOcean Spaces** account (or AWS S3)
4. **Google OAuth credentials** (optional for MVP)

## Environment Setup

### 1. Database Setup

Create a PostgreSQL database:

```bash
# Using psql
createdb bulgaria_from_above

# Or using your preferred PostgreSQL client
```

### 2. DigitalOcean Spaces Setup

1. Create a Space (bucket) named `bulgaria-photos`
2. Generate API credentials (access key + secret key)
3. Enable CDN (optional but recommended)
4. Set CORS policy to allow uploads from your domains

### 3. Environment Variables

Create `.env` files for each application:

#### Backend API (`apps/api/.env`)

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bulgaria_from_above"

# Authentication
JWT_SECRET="your-secure-jwt-secret-at-least-32-characters-long"

# API
PORT=4000
HOST=0.0.0.0

# CORS (comma-separated for multiple origins)
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"
```

#### Web App (`apps/web/.env.local`)

```env
# API
NEXT_PUBLIC_API_URL="http://localhost:4000"

# NextAuth (for future Google OAuth)
NEXTAUTH_SECRET="your-nextauth-secret-at-least-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional for MVP)
# GOOGLE_CLIENT_ID="your-google-client-id"
# GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### Admin Panel (`apps/admin/.env.local`)

```env
# API
NEXT_PUBLIC_API_URL="http://localhost:4000"

# DigitalOcean Spaces (or AWS S3)
NEXT_PUBLIC_S3_BUCKET="bulgaria-photos"
NEXT_PUBLIC_S3_REGION="nyc3"
NEXT_PUBLIC_S3_ENDPOINT="https://nyc3.digitaloceanspaces.com"
NEXT_PUBLIC_S3_ACCESS_KEY="your-spaces-access-key"
NEXT_PUBLIC_S3_SECRET_KEY="your-spaces-secret-key"
```

## Installation

1. **Clone and navigate to repository**:
   ```bash
   cd bulgariafromabove
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```

4. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

5. **Seed database with sample data** (optional):
   ```bash
   npm run db:seed
   ```

## Development

### Start all applications

```bash
npm run dev
```

This starts:
- **API**: http://localhost:4000
- **Web App**: http://localhost:3000
- **Admin Panel**: http://localhost:3001

### Start applications individually

```bash
# Backend API
cd apps/api
npm run dev

# Web App
cd apps/web
npm run dev

# Admin Panel
cd apps/admin
npm run dev
```

## Production Deployment

### Backend API

1. **Build the API**:
   ```bash
   cd apps/api
   npm run build
   ```

2. **Deploy to server** (e.g., DigitalOcean Droplet, AWS EC2):
   ```bash
   # Copy dist/ folder and package.json to server
   # Install production dependencies
   npm ci --production

   # Run migrations on production database
   npm run db:migrate

   # Start server
   npm start
   ```

3. **Use PM2 for process management** (recommended):
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name bulgaria-api
   pm2 save
   pm2 startup
   ```

4. **Set up Nginx reverse proxy**:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Frontend (Web App + Admin)

#### Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Web App**:
   ```bash
   cd apps/web
   vercel --prod
   ```

3. **Deploy Admin Panel**:
   ```bash
   cd apps/admin
   vercel --prod
   ```

4. **Set environment variables in Vercel dashboard**

#### Alternative: Deploy to your own server

```bash
# Build applications
cd apps/web
npm run build

cd ../admin
npm run build

# Serve with PM2
pm2 start npm --name "bulgaria-web" -- start
pm2 start npm --name "bulgaria-admin" -- start
```

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] DigitalOcean Spaces accessible
- [ ] API health check returns 200: `GET /health`
- [ ] CORS configured correctly
- [ ] SSL certificates installed (Let's Encrypt)
- [ ] Admin user created
- [ ] At least 10 photos uploaded and approved
- [ ] Test complete game flow
- [ ] Test leaderboard updates
- [ ] Test feedback submission

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL

# Check if migrations are applied
npm run db:studio
```

### CORS Errors

- Ensure `CORS_ORIGIN` in API `.env` matches your frontend URLs
- Include both `http://` and `https://` if needed
- Don't add trailing slashes

### Image Upload Failures

- Verify Spaces/S3 credentials
- Check bucket CORS policy
- Ensure bucket has public-read access for photos
- Test with Spaces CLI or AWS CLI

### API Not Responding

```bash
# Check if API is running
curl http://localhost:4000/health

# Check logs
cd apps/api
npm run dev  # View logs

# If using PM2
pm2 logs bulgaria-api
```

## Monitoring

### Recommended Tools

- **Vercel Analytics**: Frontend monitoring
- **Sentry**: Error tracking
- **PM2**: Process monitoring for API
- **PostgreSQL Logs**: Database performance

### Health Checks

- API: `GET /health`
- Database: Check connection count and query performance
- Spaces: Monitor storage usage and bandwidth

## Backup Strategy

1. **Database Backups**:
   ```bash
   # Daily backup
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

2. **Photo Backups**:
   - Enable versioning on Spaces/S3
   - Set up automated backups to another region

## Scaling

### When to Scale

- **API**: > 80% CPU usage consistently
- **Database**: Slow query times (> 100ms for simple queries)
- **Storage**: > 80% capacity

### How to Scale

1. **API**: Add more server instances behind load balancer
2. **Database**:
   - Add read replicas
   - Enable connection pooling
   - Optimize indexes
3. **Storage**: Enable CDN, optimize image sizes

## Security

### Best Practices

- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable rate limiting (already configured)
- [ ] Keep dependencies updated: `npm audit`
- [ ] Use HTTPS everywhere
- [ ] Implement CSP headers
- [ ] Regular security audits

## Cost Estimation

### Development/Small Scale (< 1000 users)

- **Vercel**: Free tier (Hobby)
- **DigitalOcean Droplet**: $12/month (API)
- **DigitalOcean Managed PostgreSQL**: $15/month
- **DigitalOcean Spaces**: $5/month (250GB)

**Total**: ~$32/month

### Production/Medium Scale (1000-10000 users)

- **Vercel Pro**: $20/month
- **DigitalOcean Droplet**: $24/month (larger)
- **DigitalOcean Database**: $30/month
- **Spaces + CDN**: $10/month

**Total**: ~$84/month

## Support

For issues and questions:
- Check [README.md](./README.md)
- Review [PROJECT_PLAN.md](./PROJECT_PLAN.md)
- Open GitHub issue

## Next Steps

1. Set up production environment
2. Configure domain and SSL
3. Upload initial photo collection (100+ photos recommended)
4. Invite beta testers
5. Monitor and optimize based on usage
6. Implement Google OAuth (optional)
7. Add analytics and monitoring
