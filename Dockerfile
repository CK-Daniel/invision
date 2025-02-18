ARG NODE_VERSION=22.10.0
FROM node:${NODE_VERSION} AS frontend-build

# Use production node environment by default.
ENV NODE_ENV=production

WORKDIR /frontend

# Copy frontend files
COPY frontend/ .

# Define build-time arguments
ARG NPM_REGISTRY_SERVER
ARG CUSTOM_CA_FILE

# Copy the CA certificate into the image and set configurations if CUSTOM_CA_FILE is defined
RUN if [ -n "$CUSTOM_CA_FILE" ]; then \
        cp ${CUSTOM_CA_FILE} "/usr/local/share/ca-certificates/${CUSTOM_CA_FILE}"; \
        update-ca-certificates; \
        yarn config set cafile "/usr/local/share/ca-certificates/${CUSTOM_CA_FILE}"; \
        npm config set cafile "/usr/local/share/ca-certificates/${CUSTOM_CA_FILE}"; \
        export NODE_EXTRA_CA_CERTS="/usr/local/share/ca-certificates/${CUSTOM_CA_FILE}"; \
    fi

# Set custom Yarn registry if NPM_REGISTRY_SERVER is defined
RUN if [ -n "$NPM_REGISTRY_SERVER" ]; then \
        yarn config set registry "$NPM_REGISTRY_SERVER" --global; \
        npm config set registry "$NPM_REGISTRY_SERVER" --global; \
    fi

# Install dependencies and build
RUN yarn install --non-interactive --production
RUN yarn build

# Backend build stage
FROM python:3.12.6-slim AS backend-build

WORKDIR /backend
COPY backend/ .

RUN pip install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --only main --no-interaction --no-ansi

# Production stage
FROM nginx:alpine

# Install Python and set up virtual environment
RUN apk add --no-cache python3 py3-pip python3-dev && \
    python3 -m venv /venv && \
    /venv/bin/pip install flask python-dotenv requests colorama beautifulsoup4 unidecode

ENV PATH="/venv/bin:$PATH"

# Copy the frontend build files to Nginx
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html

# Copy the backend files
COPY --from=backend-build /backend /backend

# Copy custom Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf.template

# Create start script
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'cd /backend && FLASK_APP=src/app.py DOCS_ROOT=/backend/static/docs /venv/bin/python -m flask run --host=0.0.0.0 --port=8080 &' >> /docker-entrypoint.sh && \
    echo 'export PORT=${PORT:-8080}' >> /docker-entrypoint.sh && \
    echo 'envsubst "\$PORT" < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo 'nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Start both services
CMD ["/docker-entrypoint.sh"]
