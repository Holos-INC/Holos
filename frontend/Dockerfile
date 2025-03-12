# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./

RUN npm install --frozen-lockfile

# Copy the entire project
COPY . .

# Expose port 3000 for Render
EXPOSE 3000

# Set environment variables for Expo web
ENV EXPO_WEB_PORT=3000
ENV EXPO_HOST=lan

# Start the Expo web server and bind to LAN
CMD ["npx", "expo", "start", "--web", "--port", "3000", "--host", "lan"]
