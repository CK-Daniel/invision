FROM node:22.10.0

WORKDIR /frontend

# Copy package files first for better caching
COPY package.json yarn.lock ./

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

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Special env to configure the proxy
ENV VITE_IN_DOCKER_CONTAINER true

# Expose the port that the application listens on
EXPOSE 3000

# Start development server
CMD ["yarn", "dev", "--host"]
