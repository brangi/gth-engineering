
## API Documentation

This documentation provides details on the API endpoint and setup instructions for the Docker environment of the `gth-engineering-hometake` project. The project includes a Node.js application that interfaces with the Wikipedia API to fetch and return the view count of a specified article for a given month.

### Getting Started

To set up the `gth-engineering-hometake` project locally, including installing its dependencies, follow these step-by-step instructions. This guide assumes you have Node.js and npm (Node Package Manager) already installed on your machine. If you haven't installed Node.js and npm yet, visit [Node.js official website](https://nodejs.org/) to download and install them before proceeding.

#### Clone the Project

First, you need to clone the project repository to your local machine. If the project is hosted on a platform like GitHub, you can use the following `git` command, replacing `URL_OF_THE_PROJECT` with the actual repository URL:

```bash
git clone URL_OF_THE_PROJECT
```

Navigate into the project directory:

```bash
cd gth-engineering-hometake
```

#### Install Dependencies

The project's dependencies are listed in the `package.json` file. To install these dependencies, run the following command in the root of your project directory:

```bash
npm install
```

This command reads the `package.json` file and installs all the dependencies listed under `dependencies` and `devDependencies`. The process might take a few minutes, depending on the number and size of the dependencies.

#### Verify Installation

To ensure that the dependencies were installed correctly, you can run the project's test suite (if available):

```bash
npm test
```

This command runs the test script defined in the `package.json` file, which in this case utilizes `jest` to run tests. Successful execution of the tests without errors indicates that the dependencies were correctly installed and the project setup is correct.

To use this API, start the server by running `npm start` in your project's root directory. The server listens on port 3000 by default, but this can be customized through the `PORT` environment variable.

#### API Endpoint

##### GET `/article-view-count`

- **Purpose**: Fetches the view count of a specified Wikipedia article for a given month.
- **Query Parameters**:
    - `article` (string): The name of the Wikipedia article.
    - `month` (string): The month for which the view count is requested, in `YYYYMM` format.
- **Success Response**: JSON object containing the article name, the month (in `YYYYMM` format), and the view count.
    - **Code**: 200
    - **Content**: `{"article": "Node.js", "month": "202201", "viewCount": 123456}`
- **Error Response**:
    - Missing or invalid parameters:
        - **Code**: 400
        - **Content**: `{"error": "Article name and a valid month in YYYYMM format are required."}`
    - Error fetching data from Wikipedia API or no response received:
        - **Code**: 500
        - **Content**: `{"error": "Error message"}`

#### Example Request

```bash
curl http://localhost:3000/article-view-count?article=Node.js&month=202201
```

### Docker Environment Setup

#### Prerequisites

- Docker and Docker Compose installed on your machine.

#### Dockerfile and Dockerfile.prod

The project includes two Dockerfiles: `Dockerfile` for development and `Dockerfile.prod` for production. These files contain instructions to build the Docker images for the application.

- **Dockerfile**: Sets up a Node.js environment, copies the application files, and installs dependencies.
- **Dockerfile.prod**: Similar to `Dockerfile`, but optimized for production use.

#### docker-compose.yml and docker-compose-prod.yml

Two Docker Compose files are provided to orchestrate the container setup for development (`docker-compose.yml`) and production (`docker-compose-prod.yml`).

- **docker-compose.yml**: Defines the service for the application, including volume mapping for live code updates in development.
- **docker-compose-prod.yml**: Similar to `docker-compose.yml`, but configured for production deployment.

#### Building and Running Containers

To build and run the application in a Docker container for development:

```bash
docker-compose up --build
```

For production:

```bash
docker-compose -f docker-compose-prod.yml up --build
```


## Deploying a Kubernetes cluster

### Step 1: Install Minikube and kubectl

First, you need to install Minikube and kubectl:

- **Minikube** is a tool that lets you run Kubernetes locally.
- **kubectl** is a command-line tool for interacting with Kubernetes clusters.

Follow the installation instructions for Minikube [here](https://minikube.sigs.k8s.io/docs/start/) and kubectl [here](https://kubernetes.io/docs/tasks/tools/).

### Step 2: Start a Minikube cluster

Once Minikube is installed, start your Kubernetes cluster by running:

```bash
minikube start
```

This command creates and configures a virtual machine that runs a single-node Kubernetes cluster. This process can take a few minutes to complete.

### Step 3: cd to the cluster directory

```bash
cd /cluster
```

### Step 4: Deploy to Kubernetes

Build your Docker image and tag it appropriately. If you're running Minikube, you might want to use Minikube's Docker environment to build your image so that it's available to the Minikube cluster:

```bash
eval $(minikube docker-env)
docker build -f ../Dockerfile.prod -t article-view-count-app:prod ../
```

Then, apply your deployment and service configuration to the cluster:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

### Step 5: Access your application

Since the service type is set to `LoadBalancer`, Minikube can make the application accessible via the `minikube service` command:

```bash
minikube service article-view-count-app-service
```

This command will open your web browser to the URL hosting your application. Use the URL to test the endpoint

## Using make

### Makefile Documentation for Article View Count App

The `Makefile` in this project simplifies several tasks related to Docker and Docker Compose, making it easier to manage the application's lifecycle in both development and production environments.

#### Available Commands:

- **`make build`**  
  Builds the Docker containers for development purposes. This command utilizes the default `docker-compose.yml` file.

- **`make build-prod`**  
  Builds the Docker containers for production. This command uses a separate Docker Compose file (`docker-compose-prod.yml`) optimized for production environments.

- **`make up`**  
  Starts the Docker containers in detached mode (in the background) for development. It uses the default `docker-compose.yml` file.

- **`make up-prod`**  
  Starts the Docker containers in detached mode for production, utilizing `docker-compose-prod.yml`.

- **`make down`**  
  Stops and removes the Docker containers, networks, and the default network, but not the volumes.

- **`make logs`**  
  Follows the logs from all containers. This is useful for debugging and monitoring the application logs in real-time.

- **`make exec CMD="<command>"`**  
  Executes a specific command inside the `app` container. Replace `<command>` with the actual command you wish to run. For example, to run `npm install` inside the container, use `make exec CMD="npm install"`.

- **`make clean`**  
  Stops containers and removes containers, networks, volumes, and images created by `up`.

- **`make dev`**  
  Starts the Docker containers in development mode with build process. This command is similar to `make up`, but it forces a build of the Docker images according to the `docker-compose.yml` file.

#### Usage Example:

To start your development environment, ensuring that Docker images are built or rebuilt based on your latest code changes, you can run:

```bash
make dev
```

To deploy your application in production, first build the production images, then start the containers:

```bash
make build-prod
make up-prod
```

To stop the application and clean up resources:

```bash
make down
```

## Monitoring Strategy 

### Deploying Kubernetes Cluster on AWS with Terraform

The first objective is to leverage Terraform's Infrastructure as Code (IaC) capabilities to streamline the provisioning of the Kubernetes cluster on AWS. This approach enables us to define the infrastructure through code, making it reproducible, version-controlled, and easily adjustable to changing requirements.

- **Infrastructure Planning**: Begin by outlining our infrastructure requirements, including networking resources, security groups, and the EKS cluster itself. This plan will serve as the foundation for our Terraform configurations.
- **Terraform Configuration**: Craft Terraform files to declare our AWS resources meticulously. These configurations will detail the setup of the EKS cluster, associated worker nodes, and any requisite AWS services such as VPCs and IAM roles.
- **Version Control**: All Terraform configurations will be version-controlled within the project repository, allowing for collaborative review and modification. This practice ensures that the infrastructure evolves alongside the application code.

### Automating Deployments with CI/CD Pipelines

To ensure smooth and reliable deployment processes, we'll set up CI/CD pipelines using GitHub Actions or GitLab CI, depending on our version control platform. These pipelines will automate the testing, building, and deployment phases of our development cycle, reducing manual intervention and promoting code quality.

- **Pipeline Configuration**: We'll define pipeline stages that correspond to our deployment workflow. These stages will include linting, unit and integration testing, building Docker images, and deploying these images to our Kubernetes cluster.
- **Docker and Kubernetes Integration**: Our pipeline will build Docker images of our application and push them to a container registry. Subsequently, it will update our Kubernetes deployment to use the latest image version, facilitating a rolling update of our application.
- **Terraform Automation**: Integration of Terraform within our pipeline will automate the application of infrastructure changes. This setup ensures that any adjustments to our Terraform configurations are automatically reflected in our AWS environment upon merging code changes.

### Integrating Datadog for Monitoring and Alerting

With this deployment infrastructure and automation in place, our next step is to integrate Datadog for comprehensive monitoring and alerting. This integration will offer insights into our application's performance and the health of our infrastructure, enabling proactive issue resolution.

- **Datadog Setup**: We'll install the Datadog Agent on our Kubernetes cluster to collect metrics, logs, and traces. This data will be instrumental in monitoring our application's operational health.
- **Custom Metrics and Dashboards**: By defining custom metrics relevant to our application's performance, we can tailor our monitoring to the unique aspects of our environment. We'll use these metrics to build dashboards that provide real-time visibility into system performance.
- **Alerting Configuration**: We'll configure alerts based on thresholds for critical metrics, ensuring that we're promptly notified of potential issues. These alerts will enable our team to quickly address problems before they impact our users.
