#!/bin/bash

echo "=========================================="
echo "REST-iN-U Comprehensive Verification"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check environment files
echo "1. Checking environment files..."
if [ -f backend/.env ]; then
    echo -e "${GREEN}✅ Backend .env exists${NC}"
else
    echo -e "${RED}❌ Backend .env missing - copy from .env.example${NC}"
fi

if [ -f frontend/.env.local ]; then
    echo -e "${GREEN}✅ Frontend .env.local exists${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend .env.local missing - copy from .env.example${NC}"
fi

echo ""

# 2. Check Docker services
echo "2. Checking Docker services..."
docker-compose ps

echo ""

# 3. Check backend health
echo "3. Checking backend health..."
HEALTH=$(curl -s http://localhost:4000/api/v1/health)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend is running${NC}"
    echo "$HEALTH" | jq .
else
    echo -e "${RED}❌ Backend is not responding${NC}"
fi

echo ""

# 4. Check frontend
echo "4. Checking frontend..."
FRONTEND=$(curl -s http://localhost:3000/api/health)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend is not responding${NC}"
fi

echo ""

# 5. Check database
echo "5. Checking database..."
docker exec restinu-postgres pg_isready
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database is ready${NC}"
else
    echo -e "${RED}❌ Database is not ready${NC}"
fi

echo ""

# 6. Check Redis
echo "6. Checking Redis..."
REDIS=$(docker exec restinu-redis redis-cli ping)
if [ "$REDIS" == "PONG" ]; then
    echo -e "${GREEN}✅ Redis is running${NC}"
else
    echo -e "${RED}❌ Redis is not responding${NC}"
fi

echo ""

# 7. Run backend tests
echo "7. Running backend tests..."
cd backend && npm test --silent
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend tests passed${NC}"
else
    echo -e "${RED}❌ Backend tests failed${NC}"
fi

echo ""

# 8. Run frontend tests
echo "8. Running frontend tests..."
cd ../frontend && npm test --silent
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend tests passed${NC}"
else
    echo -e "${RED}❌ Frontend tests failed${NC}"
fi

echo ""
echo "=========================================="
echo "Verification complete!"
echo "=========================================="
