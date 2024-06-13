# Use an official Node.js runtime as a parent image for the frontend
FROM node:18

# Set the working directory in the container for the frontend
WORKDIR /app

# Copy package.json and package-lock.json for the frontend
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of your frontend code to the container
COPY . .

# Expose the port that your frontend application listens on
EXPOSE 3000

# Define the command to start your frontend
CMD ["npm", "run", "dev"]
