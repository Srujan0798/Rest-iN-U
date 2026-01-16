# Use multi-stage build to optimize image size
FROM python:3.10-slim as builder

WORKDIR /app

# Install system dependencies
# gcc and python3-dev are often needed for compiling python packages
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir prisma

# Copy prisma schema
COPY prisma ./prisma

# Generate prisma client
RUN prisma generate --schema=prisma/schema.prisma

# Copy source code
COPY ai_ml ./ai_ml

# Final stage
FROM python:3.10-slim

WORKDIR /app

# Install runtime dependencies (if any specific ones are needed)
# libgl1-mesa-glx is needed for opencv-python-headless
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy app code
COPY --from=builder /app /app

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

# Command to run the service
CMD ["uvicorn", "ai_ml.main:app", "--host", "0.0.0.0", "--port", "8000"]
