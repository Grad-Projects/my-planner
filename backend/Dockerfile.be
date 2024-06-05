####BACKEND####
# Use the official Node.js image from Docker Hub
FROM node:latest

# Arguments
ARG LOCAL_DATABASE_HOST
ARG LOCAL_DATABASE_NAME
ARG LOCAL_DATABASE_USERNAME
ARG LOCAL_DATABASE_PASSWORD

# Set environment variables
ENV ENVIRONMENT=dev
ENV DATABASE_NAME=$LOCAL_DATABASE_NAME
ENV DATABASE_USERNAME=$LOCAL_DATABASE_USERNAME
ENV DATABASE_PASSWORD=$LOCAL_DATABASE_PASSWORD

# Create and change to the app directory
WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the app source code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the app
CMD ["npm", "start"]
