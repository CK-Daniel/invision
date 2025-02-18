ARG PYTHON_VERSION=3.12.6
FROM python:${PYTHON_VERSION}-slim AS base

# Define build-time arguments
ARG PYTHON_REGISTY_URL
ARG CUSTOM_CA_FILE

# Change working directory
WORKDIR /backend

# Copy source code
COPY . .

# Copy the CA certificate into the image and set configurations if CUSTOM_CA_FILE is defined
RUN if [ -n "$CUSTOM_CA_FILE" ]; then \
        cp ${CUSTOM_CA_FILE} "/usr/local/share/ca-certificates/${CUSTOM_CA_FILE}"; \
        update-ca-certificates; \
        pip config set global.cert "/usr/local/share/ca-certificates/${CUSTOM_CA_FILE}"; \
    fi

# Set custom PyPI index url if PIP_INDEX_URL is defined
RUN if [ -n "$PYTHON_REGISTY_URL" ]; then \
        pip config set global.index-url "$PYTHON_REGISTY_URL"; \
    fi

# Install Poetry
RUN pip install poetry

# Configure the certificate
RUN if [ -n "$CUSTOM_CA_FILE" ]; then \
        poetry config certificates.custom.cert "/usr/local/share/ca-certificates/${CUSTOM_CA_FILE}"; \
    fi

# Add custom source to poetry if env PYTHON_REGISTY_URL is defined
RUN if [ -n "$PYTHON_REGISTY_URL" ]; then \
        poetry source add custom "$PYTHON_REGISTY_URL"; \
    fi

# Install dependencies (without dev dependencies)
RUN poetry config virtualenvs.create false \
    && poetry install --only main --no-interaction --no-ansi

# Flask app target
ENV FLASK_APP=/backend/src/app
ENV FLASK_ENV=production

# Create start script
COPY <<-"EOF" /start.sh
#!/bin/sh
python src/app.py
EOF

RUN chmod +x /start.sh

# Run Flask backend
CMD ["/start.sh"]
