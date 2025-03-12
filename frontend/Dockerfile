# Step 1: Use Node.js as the base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./

RUN npm install --frozen-lockfile

# Copy all files into the container
COPY . .

# Expose port 3000 for Render
EXPOSE 3000

# Set environment variables to properly bind Expo to the outside world
ENV EXPO_WEB_PORT=3000
ENV EXPO_USE_DEV_SERVER=true
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Start the Expo web server
CMD ["npm", "run", "web"]
