# Use a base imag
FROM node

# Set environment to development
ENV NODE_ENV=development

WORKDIR /usr/src/app

# Install nodemon for hot reloading
RUN npm install -g nodemon

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies including 'devDependencies'
RUN npm install

# Copy the source code
COPY . .

# Bind the express server to port 3000 of the container
EXPOSE 3000

# Run the application with nodemon for hot reload
CMD [ "nodemon", "app.js" ]