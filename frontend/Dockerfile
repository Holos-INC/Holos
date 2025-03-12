# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./

RUN npm install --frozen-lockfile

# Copy the entire project
COPY . .

# Expose port 3000
EXPOSE 3000

# Set environment variable to change Expo's web server port
ENV EXPO_WEB_PORT=3000

# Start the Expo web server on port 3000
CMD ["npx", "expo", "start", "--web", "--port", "3000"]
