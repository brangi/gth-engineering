# Define variables for docker-compose command simplicity
DC = docker-compose
DC_PROD = docker-compose -f docker-compose-prod.yml

# Build the Docker containers using docker-compose for development
build:
	$(DC) build

# Build the Docker containers for production
build-prod:
	$(DC_PROD) build

# Start the Docker containers in development mode
up:
	$(DC) up -d

# Start the Docker containers in production mode
up-prod:
	$(DC_PROD) up -d

# Stop the Docker containers
down:
	$(DC) down

# View logs from the Docker containers
logs:
	$(DC) logs -f

# Execute a command inside the app container (e.g., make exec CMD="npm install")
exec:
	$(DC) exec app $(CMD)

# Remove all Docker containers and volumes
clean:
	$(DC) down --rmi all --volumes

# Start local dev
dev:
	$(DC) -f docker-compose.yml up --build

