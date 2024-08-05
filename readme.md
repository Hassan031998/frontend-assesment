# Assessment Project

This project is a web application built with Vite and served using NGINX within a Docker container.

## Prerequisites

Make sure you have the following installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)

## Building the Docker Image

To build the Docker image for this project, follow these steps:

1. Clone the repository:

  sh
  git clone <repository-url>
  cd <repository-directory>

2. Build the Docker image:
  sudo docker build -t assessment .

3. Once the image is built, you can run the Docker container using the following command:
  sudo docker run -d -p 80:80 --name assessment-container assessment

4. To stop the running container, use the following command:
  sudo docker stop assessment-container

