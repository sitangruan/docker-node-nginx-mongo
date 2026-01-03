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

To remove the running containers, run: 

  **docker compose --profile dev down**

The related images you need to delete separately.

Note: the health check in app-dev or dev should use the service name ("app-dev" or "app") not localhost. It also could not use CMD and curl as they are not provided in alpine.
You should yse "wget" instead.

**test: ["CMD-SHELL", "wget -qO- http://app-dev:3000/api/health || exit 1"]**

*********************************************************************
 (**prod mode**)
In cmd window or terminal, run this command for prod mode
 
 **docker compose --profile prod up -d --build** 

*********************************************************************
 ## Kubernetes
 ## A basic kubernets example
 To support Kubernetes deployment, you should enable Kubernetes in your docker desktop and then apply and restart.
 Then you should also install Nginx Ingress Controller, which is a must. Below are the commands:

  **kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml**

  **kubectl -n ingress-nginx rollout status deploy/ingress-nginx-controller**

  In command window run:

  **kubectl apply -f kubernetes-complete-deployment.yaml**

  And then you can run below commands to verify if the deployment succeeds:

  **kubectl get svc**
  **kubectl get pods**
  **kubectl get ingress**

  If they show success, in browser url go to:

  **http://localhost/nginx**

  You should be able to see the "Welcome to nginx" page.

  To delete the previous deployment, run:

  **kubectl delete deployment nginx-deployment**

  here **"nginx-deployment"** is the deployment name defined in that yaml file.

*********************************************************************
## Use kubernetes and ingress controller to deploy this project (mongo + node + nginx)
Run this command:

  **kubectl apply -f k8s-mongo-node-nginx-ingress.yaml**

To test, in browser go these urls:

  **http://localhost/**

  **http://localhost/api/health**

  **http://localhost/api/tasks**

To delete the deployment in one shot, run this command:

  **kubectl delete namespace mongo-node-nginx-app**

The other file **k8s-mongo-node-nginx-ingress.yaml** is without ingress controller support and it is using NodePort to expose the Nginx service directly.
