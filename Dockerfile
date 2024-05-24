# Use the official Node.js 20.x image as the base image
FROM node:alpine3.19

# Set the working directory inside the container
WORKDIR /app

ENV NODE_ENV=production

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 5001

# Command to run your application
CMD ["node", "index.js"]

