# B CRUD Employee APIs

## Table of contents

<!-- toc -->

- [Overview](#overview)
- [How to Build](#how-to-build)
- [How to Run](#how-to-run)
- [How to Deploy](#how-to-deploy)

<!-- tocstop -->

## Overview

NodeJS API server, using express and mongodb.

Some details of the APIs:

- *GET* request -> `/getAllEmployees`
- *POST* request -> `/createEmployee`
    ```
    x-www-form-urlencoded
    email
    firstName
    lastName
    department
    ```
- *PUT* request -> `/updateEmployee`
    ```
    x-www-form-urlencoded
    email
    firstName
    lastName
    department
    ```
- *DELETE* request -> `/deleteEmployee`
    ```
    x-www-form-urlencoded
    email
    ```

Don't forget to clear the collection after test using: DELETE request: `/clearCollection`

## How to Build

clone the repo and run `yarn`

## How to Run

- For local just run `yarn start`
- For docker-compose run `docker-compose up -d`

## How to Deploy

- For minikube run, I have tested on `kubernetes-version=v1.15.3` if you don't have the same version please use the following command:
```
minikube delete
minikube start --kubernetes-version=v1.15.3
eval $(minikube docker-env)
docker build -t nodejs .
kubectl apply -f deployment.yaml 
kubectl expose deployment nodejs --type=LoadBalancer --port=3000
minikube service nodejs
```
Minikube comes with its own docker daemon and not able to find images by default, using  `eval $(minikube docker-env)` we set env variable.
We have to set ImagePullPolicy to Never in order to use local docker images with the deployment.
If you are running docker compose after deploying please unset
environment variable run this command: `eval $(minikube docker-env -u)`
