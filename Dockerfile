# Use official Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the app's port
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]
