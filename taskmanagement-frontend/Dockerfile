

# Development Dockerfile
FROM node:18-alpine
WORKDIR /app

# Accept build args
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose React dev server port
EXPOSE 3000

# Start the development server
CMD ["sh", "-c", "REACT_APP_API_URL=$REACT_APP_API_URL npm start"]



