# B CRUD Employee APIs

## Table of contents

<!-- toc -->

- [Overview](#overview)
- [How to Build](#how-to-build)
- [How to Run](#how-to-run)
<!-- - [How to Deploy](#how-to-deploy) -->

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
