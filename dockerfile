# Use an official Node.js image from the Docker Hub
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port (4000)
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
