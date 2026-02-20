# ======================
# Build stage
# ======================
FROM node:20-alpine AS build
WORKDIR /app

# Accept build args
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ======================
# Production stage
# ======================
FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve

# CRA outputs "build", not "dist"
COPY --from=build /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
