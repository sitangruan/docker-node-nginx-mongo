This is a project to demonstrate the usage of docker desktop, docker compose, ingress controller, and Kubernetes.

To test in windows machine locally, make sure you meet the prerequisites:
 1. Docker desktop v4.55.0 or newer
 2. WSL v2.6.3.0 or newer
 3. If you have IIS turned on, make sure it is STOPPED.

 ## Run
Method 1 - Deployment using docker compose

(**dev mode**)
In cmd window or terminal, run this command for dev mode

**docker compose --profile dev up -d --build**

Then you will see new images in the Images tab of docker desktop: 
  1. mongo
  2. nginx
  3. node

In the containers tab of docker desktop, you will see a new group "docker-node-nginx-mongo", under which 3 new containers are running
  1. app-dev-1
  2. nginx-1
  3. mongo-1

To test, in browser window try these two urls:
 
  http://localhost:8080/api/health

  http://localhost:8080/api/tasks

*********************************************************************
 (**prod mode**)
In cmd window or terminal, run this command for prod mode
 
 **docker compose --profile prod up -d --build** 