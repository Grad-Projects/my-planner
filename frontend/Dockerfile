# Use the official Node.js image from Docker Hub
FROM node:latest

# Create and change to the app directory
WORKDIR /frontend

# Copy the app source code
COPY . .

# Install http-server
RUN npm install -g http-server

# Expose the port the app runs on
EXPOSE 5500

# Define the command to run the app
CMD ["http-server", "--ssl", "--cert", "server.cert", "--key", "server.key", "-p", "5500"]