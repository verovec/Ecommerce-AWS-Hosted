# My Little Shopping

All architecture for My Little Shopping

# Stack

![](https://img.shields.io/badge/node-16-blue)
![](https://img.shields.io/badge/RabbitMQ-3.9.13-red)
![](https://img.shields.io/badge/MYSQL-8-9cf)
![](https://img.shields.io/badge/AWS-ECS-important)
![](https://img.shields.io/badge/AWS-S3-green)

### DESCRIPTION :

E-commerce web platform hosted on AWS cloud. Microservice achitecture managed by load balancer

### Pipeline :

![](ressources/deployment.png)

### HOW TO :

#### Setup local env
      cp .env-example .env
      docker build back-end -t dev-mylittleshopping -f back-end/dev.dockerfile
##### Run project
      docker-compose up -d

##### Setup database (every time you delete the volumes or connect application to new database)
      docker-compose -f seeders.docker-compose.yml up

##### Open adminer
      go on http://localhost:8081 to manage mysql

#### Kill
   ##### All microservices
      docker-compose down
   ##### Specific microservice
      docker-compose stop front api database ...

### Deploy staging
      merge your code on branch master

### Deploy production
      git tag [version]
      git push --tags


# Cloud architecture :

![](ressources/infra-cloud.png)


# Mailer :

![](back-end/mail/ressources/cloud-architecture.png)


# File structure

```
my-little-shopping
 │
 ├── back-end
 │       ├── auth/
 │       │
 │       ├── db/
 │       │
 │       ├── gateway/ (exposed load balancer)
 │       │
 │       ├── mail/
 │       │
 │       ├── permissions/
 │       │
 │       └── web/
 │
 ├── front
 |
 └── ressources
```
