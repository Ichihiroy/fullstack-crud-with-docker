# Use an official node.js runtime as a parent image
FROM node:24.1.0

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.json files to the container
COPY package*.json .

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Define the command to run your application
CMD ["node", "./src/server.js"]