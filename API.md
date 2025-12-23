REST-iN-U API Documentation
Base URL: https://api.restinu.com/api/v1
Table of Contents
Authentication
Properties
Agents
Users
Favorites
Messages
Subscriptions
Vastu Analysis
Documents
WebSocket Events
Error Handling

Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
Authorization: Bearer <access_token>

Register
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "role": "buyer" // buyer | seller | agent
}

Response (201):
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "buyer"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}

Login
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Refresh Token
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJ..."
}

Logout
POST /auth/logout
Authorization: Bearer <token>

Get Current User
GET /auth/me
Authorization: Bearer <token>


Properties
List Properties
GET /properties

Query Parameters:
Parameter
Type
Description
page
number
Page number (default: 1)
limit
number
Items per page (default: 12, max: 50)
type
string
Property type: apartment, villa, house, plot, commercial
status
string
available, pending, sold
city
string
City name
priceMin
number
Minimum price
priceMax
number
Maximum price
bedrooms
string
Comma-separated: "2,3,4"
bathrooms
string
Comma-separated
areaMin
number
Minimum area (sq ft)
areaMax
number
Maximum area
vastuScore
number
Minimum Vastu score
amenities
string
Comma-separated amenity codes
sortBy
string
price, area, createdAt, vastuScore
sortOrder
string
asc, desc
lat
number
Latitude for location search
lng
number
Longitude for location search
radius
number
Search radius in km

Response:
{
  "success": true,
  "data": {
    "properties": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 150,
      "totalPages": 13
    }
  }
}

Get Property
GET /properties/:id

Response:
{
  "success": true,
  "data": {
    "id": "prop_123",
    "title": "Luxurious 3BHK in Bandra",
    "description": "...",
    "price": 45000000,
    "type": "apartment",
    "status": "available",
    "address": {
      "street": "123 Linking Road",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400050",
      "latitude": 19.0596,
      "longitude": 72.8295
    },
    "specifications": {
      "bedrooms": 3,
      "bathrooms": 2,
      "area": 1850,
      "carpetArea": 1520,
      "floor": 12,
      "totalFloors": 25,
      "facing": "East",
      "furnishing": "semi-furnished",
      "parking": 2,
      "balconies": 2
    },
    "amenities": ["gym", "pool", "security", "garden"],
    "images": [...],
    "videos": [...],
    "vastu": {
      "score": 85,
      "grade": "A",
      "zones": [...]
    },
    "agent": {
      "id": "agent_456",
      "name": "Rahul Sharma",
      "phone": "+919876543210",
      "avatar": "..."
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:45:00Z"
  }
}

Create Property (Agent)
POST /properties
Authorization: Bearer <agent_token>
Content-Type: multipart/form-data

title: "3BHK Apartment"
description: "..."
price: 45000000
type: "apartment"
address[city]: "Mumbai"
...
images: [files]

Update Property (Agent)
PATCH /properties/:id
Authorization: Bearer <agent_token>

Delete Property (Agent)
DELETE /properties/:id
Authorization: Bearer <agent_token>


Agents
List Agents
GET /agents

Query Parameters:
Parameter
Type
Description
city
string
Filter by city
specialization
string
Residential, commercial, luxury
rating
number
Minimum rating
verified
boolean
Only verified agents

Get Agent
GET /agents/:id

Get Agent Properties
GET /agents/:id/properties

Contact Agent
POST /agents/:id/contact
Authorization: Bearer <token>
Content-Type: application/json

{
  "propertyId": "prop_123",
  "message": "I'm interested in this property",
  "preferredContact": "phone",
  "preferredTime": "morning"
}


Users
Get Profile
GET /users/profile
Authorization: Bearer <token>

Update Profile
PATCH /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210",
  "preferences": {
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    }
  }
}

Update Avatar
POST /users/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

avatar: [file]

Change Password
POST /users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldPassword",
  "newPassword": "newSecurePassword123"
}


Favorites
List Favorites
GET /favorites
Authorization: Bearer <token>

Add Favorite
POST /favorites/:propertyId
Authorization: Bearer <token>

Remove Favorite
DELETE /favorites/:propertyId
Authorization: Bearer <token>

Check Favorite Status
GET /favorites/check/:propertyId
Authorization: Bearer <token>


Messages
List Conversations
GET /messages/conversations
Authorization: Bearer <token>

Get Conversation
GET /messages/conversations/:id
Authorization: Bearer <token>

Send Message
POST /messages/conversations/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello, I'm interested in the property",
  "type": "text"
}

Create Conversation
POST /messages/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientId": "user_456",
  "propertyId": "prop_123",
  "message": "Initial message"
}


Subscriptions
Get Plans
GET /subscriptions/plans

Get Current Subscription
GET /subscriptions/current
Authorization: Bearer <token>

Create Checkout Session
POST /subscriptions/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "priceId": "price_123",
  "successUrl": "https://restinu.com/checkout/success",
  "cancelUrl": "https://restinu.com/checkout/cancel"
}

Create Portal Session
POST /subscriptions/portal
Authorization: Bearer <token>
Content-Type: application/json

{
  "returnUrl": "https://restinu.com/dashboard/subscription"
}

Cancel Subscription
POST /subscriptions/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "immediately": false
}


Vastu Analysis
Get Property Vastu Analysis
GET /vastu/property/:propertyId

Request Vastu Analysis
POST /vastu/analyze
Authorization: Bearer <token>
Content-Type: multipart/form-data

propertyId: "prop_123"
floorPlan: [file]
entranceDirection: "East"
...

Get Vastu Recommendations
GET /vastu/recommendations/:analysisId
Authorization: Bearer <token>

Get Compatibility
POST /vastu/compatibility/:propertyId
Authorization: Bearer <token>
Content-Type: application/json

{
  "dateOfBirth": "1990-05-15",
  "timeOfBirth": "10:30",
  "placeOfBirth": "Mumbai"
}

Get Auspicious Dates
GET /vastu/auspicious-dates/:propertyId
Authorization: Bearer <token>

Query Parameters:
Parameter
Type
Description
from
date
Start date (ISO)
to
date
End date (ISO)
purpose
string
purchase, registration, griha_pravesh


Documents
List Documents
GET /documents
Authorization: Bearer <token>

Query Parameters:
Parameter
Type
Description
propertyId
string
Filter by property
type
string
Document type
status
string
pending, signed, completed

Get Document
GET /documents/:id
Authorization: Bearer <token>

Create Document Envelope
POST /documents/envelopes
Authorization: Bearer <token>
Content-Type: application/json

{
  "propertyId": "prop_123",
  "templateId": "tmpl_456",
  "signers": [
    {
      "email": "buyer@example.com",
      "name": "John Doe",
      "role": "buyer"
    }
  ]
}

Get Signing URL
POST /documents/:id/sign
Authorization: Bearer <token>
Content-Type: application/json

{
  "returnUrl": "https://restinu.com/signing/complete"
}

Download Document
GET /documents/:id/download
Authorization: Bearer <token>


WebSocket Events
Connect to: wss://api.restinu.com
Authentication
socket.emit('authenticate', { token: 'Bearer xxx' });

Events
Client â†’ Server:
Event
Payload
Description
conversation:join
{ conversationId }
Join conversation room
conversation:leave
{ conversationId }
Leave conversation room
message:send
{ conversationId, content, type }
Send message
typing:start
{ conversationId }
Start typing indicator
typing:stop
{ conversationId }
Stop typing indicator
message:read
{ conversationId, messageIds }
Mark messages as read

Server â†’ Client:
Event
Payload
Description
notification
{ id, type, title, message, ... }
New notification
message:new
{ conversationId, message }
New message received
message:read
{ conversationId, messageIds, userId }
Messages marked as read
typing:start
{ conversationId, userId, userName }
User started typing
typing:stop
{ conversationId, userId }
User stopped typing
user:online
{ userId, isOnline }
User came online
user:offline
{ userId, lastSeen }
User went offline
property:updated
{ propertyId, changes }
Property was updated


Error Handling
Error Response Format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}

Error Codes
Code
HTTP Status
Description
UNAUTHORIZED
401
Missing or invalid token
FORBIDDEN
403
Insufficient permissions
NOT_FOUND
404
Resource not found
VALIDATION_ERROR
400
Invalid request data
CONFLICT
409
Resource already exists
RATE_LIMITED
429
Too many requests
INTERNAL_ERROR
500
Server error

Rate Limits
Endpoint
Limit
/auth/login
5 requests / minute
/auth/register
3 requests / minute
General API
100 requests / minute
File uploads
10 requests / minute


Pagination
All list endpoints support pagination:
{
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 150,
    "totalPages": 13,
    "hasNext": true,
    "hasPrev": false
  }
}


Filtering & Sorting
Filter Syntax
GET /properties?type=apartment&city=Mumbai&priceMin=5000000&priceMax=10000000

Sort Syntax
GET /properties?sortBy=price&sortOrder=desc

Multiple Values
GET /properties?bedrooms=2,3,4&amenities=gym,pool,parking


API Version: 1.0.0 Last Updated: December 2024
bash
echo "=== Project Structure ===" && find /home/claude/rest-in-u -type f \( -name "*.md" -o -name "*.yml" -o -name "*.yaml" -o -name "*.json" -o -name "docker-compose.yml" \) ! -path "*/node_modules/*" | sort
Output
=== Project Structure ===
/home/claude/rest-in-u/.github/ISSUE_TEMPLATE/bug_report.md
/home/claude/rest-in-u/.github/ISSUE_TEMPLATE/config.yml
/home/claude/rest-in-u/.github/ISSUE_TEMPLATE/feature_request.md
/home/claude/rest-in-u/.github/PULL_REQUEST_TEMPLATE.md
/home/claude/rest-in-u/.github/dependabot.yml
/home/claude/rest-in-u/.github/labeler.yml
/home/claude/rest-in-u/.github/workflows/ci-cd.yml
/home/claude/rest-in-u/.github/workflows/pr.yml
/home/claude/rest-in-u/README.md
/home/claude/rest-in-u/SECURITY.md
/home/claude/rest-in-u/backend/package.json
/home/claude/rest-in-u/backend/tsconfig.json
/home/claude/rest-in-u/docker-compose.yml
/home/claude/rest-in-u/docs/API.md
/home/claude/rest-in-u/docs/DEPLOYMENT.md
/home/claude/rest-in-u/frontend/.github/workflows/ci.yml
/home/claude/rest-in-u/frontend/CONTRIBUTING.md
/home/claude/rest-in-u/frontend/README.md
/home/claude/rest-in-u/frontend/docker-compose.yml
/home/claude/rest-in-u/frontend/lighthouserc.json
/home/claude/rest-in-u/frontend/package.json
/home/claude/rest-in-u/frontend/public/manifest.json
/home/claude/rest-in-u/frontend/src/i18n/locales/en.json
/home/claude/rest-in-u/frontend/src/i18n/locales/hi.json
/home/claude/rest-in-u/frontend/tsconfig.json
/home/claude/rest-in-u/frontend/vercel.json
/home/claude/rest-in-u/package.json


bash
echo "=== Final Project Statistics ===" && echo "" && echo "Total Files:" && find /home/claude/rest-in-u -type f ! -path "*/node_modules/*" | wc -l && echo "" && echo "TypeScript/TSX Files:" && find /home/claude/rest-in-u -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" | wc -l && echo "" && echo "Project Size:" && du -sh /home/claude/rest-in-u && echo "" && echo "Frontend src Size:" && du -sh /home/claude/rest-in-u/frontend/src && echo "" && echo "Backend src Size:" && du -sh /home/claude/rest-in-u/backend/src
Output
=== Final Project Statistics ===

Total Files:
168

TypeScript/TSX Files:
129

Project Size:
2.9M	/home/claude/rest-in-u

Frontend src Size:
1.9M	/home/claude/rest-in-u/frontend/src

Backend src Size:
716K	/home/claude/rest-in-u/backend/src


Synthesized comprehensive project overview.
I've continued building out the REST-iN-U platform with infrastructure, documentation, and tooling. Here's what was created:
Root-Level Infrastructure
File
Purpose
README.md
Comprehensive monorepo documentation with architecture, tech stack, setup guide
docker-compose.yml
Full-stack Docker setup (frontend, backend, PostgreSQL, Redis, Nginx, MinIO)
docker/postgres/init.sql
Database initialization with extensions, audit logging, analytics tables
docker/nginx/nginx.conf
Production-ready Nginx config with SSL, rate limiting, WebSocket support

Documentation (/docs)
File
Purpose
DEPLOYMENT.md
Complete deployment guide for Vercel, Railway, AWS, Supabase, blockchain
API.md
Full API documentation with all endpoints, WebSocket events, error handling

Storybook Configuration
File
Purpose
.storybook/main.ts
Storybook configuration with Next.js, TypeScript, accessibility addon
.storybook/preview.ts
Global styles, viewports, theme switching

Component Stories (/src/stories)
File
Purpose
Button.stories.tsx
Button variants, sizes, states, icons
PropertyCard.stories.tsx
Property card grid/list views, statuses, favorites
VastuScore.stories.tsx
Vastu score visualization, progress bars, score cards




