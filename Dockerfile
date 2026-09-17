# ==============================================================================
# Cooked Mains AI — Production Dockerfile
# Optimized for Render.com / Railway / Fly.io / Self-Hosted VPS
# ==============================================================================

FROM python:3.11-slim

# Prevent python from writing pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    DATA_DIR=/data

# Install system dependencies if required for network and certificates
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first to take advantage of Docker layer caching
COPY requirements.txt .

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create persistent data directory
RUN mkdir -p /data

# Copy platform source code
COPY . .

# Expose default port
EXPOSE 8000

# Start production server
CMD ["sh", "-c", "python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 2"]
