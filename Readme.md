**Live API:** https://priyam-jaiswal-farmlokal-backend.onrender.com/
**GitHub Repository:** https://github.com/Priyam-Jaiswal/Priyam_Jaiswal_Farmlokal_backend

FarmLokal Backend is a scalable and production-ready REST API built with **Node.js, Express, MongoDB, and Redis**.  
It syncs products from an **external API**, stores them in MongoDB, and serves them efficiently using **Redis caching with pagination**.
**Tech Stack**
Node.js
Express.js
MongoDB + Mongoose
Redis 
Axios
dotenv
Nodemon

---

## Key Features

### 📄 Pagination (Optimized & Scalable)
- Supports server-side pagination using `page` and `limit`
- Prevents loading large datasets at once
- Integrated with Redis for faster repeated requests

**Endpoint:**
GET /api/products?page=1&limit=5
"https://your-render-deployment-url.onrender.com/api/products?page=1&limit=5"


**Redis Caching**
Uses Upstash Redis (REST) for high performance
Reduces MongoDB read operations
Cache automatically expires after a TTL
Cache is cleared when products are re-synced

**Cache Key Format:**
products:page={page}:limit={limit}

**Benefits:**
Faster API responses
Lower database load
Render-friendly (no Redis server needed)


**External API Integration**
Products are fetched from FakeStore API
Synced into MongoDB using upsert (prevents duplicates)
Redis cache invalidated after sync to avoid stale data

**Sync Endpoint:**
POST /api/products/sync


**Create a .env file in the root directory:**
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FAKESTORE_API=https://dummyjson.com/products
GOOGLE_CLIENT_ID=your_google_client_ID
GOOGLE_CLIENT_SECRET=your_google_secret_code
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token


**Running Locally**
1 Install dependencies
npm install
2️ Start the server
npm run dev

**Server will run at:**
http://localhost:5000