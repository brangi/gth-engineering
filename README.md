
### Introduction

This documentation provides details on the API endpoints and setup instructions for the Docker environment of the `gth-engineering-hometake` project. The project includes a Node.js application that interfaces with the Wikipedia API to fetch and return the view count of a specified article for a given month.

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

### Additional Notes

- **Node.js Version**: It's a good practice to check the Node.js version required by the project. Sometimes, projects are sensitive to the Node.js version due to features or dependencies. If the project specifies a required Node.js version, you may use tools like `nvm` (Node Version Manager) to switch between Node.js versions.
- **Environment Variables**: Some projects require setting up environment variables before running the application. Check the project's documentation or `.env.example` file (if available) for required environment variables, and set them up accordingly.
- **Running the Application**: Finally, to run the application locally, you might use a command like `npm start`, depending on how the project's `start` script is defined in `package.json`.

By following these steps, you should be able to set up the `gth-engineering-hometake` project locally and get it running on your machine.

To use this API, start the server by running `npm start` in your project's root directory. The server listens on port 3000 by default, but this can be customized through the `PORT` environment variable.

### API Documentation

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

### Conclusion

This documentation covers the basic usage and setup for the `gth-engineering-hometake` project. For more detailed information about the application logic, refer to the source code and comments within the `app.js`, `app.test.js`, and Docker configuration files.