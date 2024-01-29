FROM node:18-bullseye-slim as Builder
LABEL maintainer="boilerplate.js@gmail.com"

# Configure env
ARG FLAVOR
ARG BUILD_NUMBER

ENV BUILD_NUMBER=$BUILD_NUMBER
ENV NODE_APP_INSTANCE=$FLAVOR

# Create a directory for the application in the container
WORKDIR /opt/feathers-quasar-boilerplate
# Copy application files into the container
COPY . .
# Install dependencies
RUN yarn && cd api && yarn && cd .. && yarn build


FROM node:18-bullseye-slim
LABEL maintainer="boilerplate.js@gmail.com"

# Configure env
ARG APP
ARG FLAVOR
ARG BUILD_NUMBER

ENV BUILD_NUMBER=$BUILD_NUMBER
ENV NODE_APP_INSTANCE=$FLAVOR

COPY --from=Builder --chown=node:node /opt/feathers-quasar-boilerplate /opt/feathers-quasar-boilerplate
# Switch to the node user.
USER node

# Run the app
WORKDIR /opt/feathers-quasar-boilerplate

EXPOSE 8081
CMD [ "yarn", "prod" ]