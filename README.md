This is a project to demonstrate the usage of docker desktop, docker compose, ingress controller, and Kubernetes.

To test in windows machine locally, make sure you meet the prerequisites:
 1. Docker desktop v4.55.0 or newer
 2. WSL v2.6.3.0 or newer
 3. If you have IIS turned on, make sure it is STOPPED.

 ## Run
Method 1 - Deployment using docker compose

(**dev mode**)
In cmd window or terminal, run this command for dev mode

**<span style="color: blue">docker compose --profile dev up -d --build</span>**

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

  **<span style="color: blue">docker compose --profile dev down</span>**

The related images you need to delete separately.

Note: the health check in app-dev or dev should use the service name ("app-dev" or "app") not localhost. It also could not use CMD and curl as they are not provided in alpine.
You should yse "wget" instead.

**<span style="color: blue">test: ["CMD-SHELL", "wget -qO- http://app-dev:3000/api/health || exit 1"]</span>**

*********************************************************************
 (**prod mode**)
In cmd window or terminal, run this command for prod mode
 
 **<span style="color: blue">docker compose --profile prod up -d --build</span>** 

*********************************************************************
 ## Kubernetes
 ## A basic kubernets example
 To support Kubernetes deployment, you should enable Kubernetes in your docker desktop and then apply and restart.
 Then you should also install Nginx Ingress Controller, which is a must. Below are the commands:

  **<span style="color: blue">kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml**

  **<span style="color: blue">kubectl -n ingress-nginx rollout status deploy/ingress-nginx-controller**

  In command window run:

  **<span style="color: blue">kubectl apply -f kubernetes-complete-deployment.yaml</span>**

  And then you can run below commands to verify if the deployment succeeds:

  **kubectl get svc**
  **kubectl get pods**
  **kubectl get ingress**

  If they show success, in browser url go to:

  **http://localhost/nginx**

  You should be able to see the "Welcome to nginx" page.

  To delete the previous deployment, run:

  **<span style="color: blue">kubectl delete deployment nginx-deployment**

  here **"nginx-deployment"** is the deployment name defined in that yaml file.

*********************************************************************
## Use kubernetes and ingress controller to deploy this project (mongo + node + nginx)
Run this command:

  **<span style="color: blue">kubectl apply -f k8s-mongo-node-nginx-ingress.yaml</span>**

To test, in browser go these urls:

  **http://localhost/**

  **http://localhost/api/health**

  **http://localhost/api/tasks**

To delete the deployment in one shot, run this command:

  **<span style="color: blue">kubectl delete namespace mongo-node-nginx-app</span>**

*********************************************************************
The is another file **k8s-mongo-node-nginx.yaml** is without ingress controller support and it is using NodePort to expose the Nginx service directly.
To use it, run this command:

  **kubectl apply -f k8s-mongo-node-nginx.yaml**

As it is using nginx as node port to expose the service, so the port number should included in the url, so the testing urls become:

  **http://localhost:30080/**

  **http://localhost:30080/api/health**

  **http://localhost:30080/api/tasks**


*******************************************************************
## Some common kubernetes commands used in this project

  1. Deploy the ingress enabled services

  **<span style="color: blue">kubectl apply -f k8s-mongo-node-nginx-ingress.yaml</span>**

  2. Deploy the non ingress enabled services

  **<span style="color: blue">kubectl apply -f k8s-mongo-node-nginx-ingress.yaml</span>**

  3. Get all resources (pods, services, etc.) under the deployed namespace

  **<span style="color: blue">kubectl get all -n mongo-node-nginx-app</span>**

  4. Deploy the whole deployed namespace (all resources including pods and services will deleted).

  **<span style="color: blue">kubectl delete namespace mongo-node-nginx-app</span>**

  5. Downgrad the replica number. It is a must do if the deployment is not successfully deployed due to readiness probe or liveness probe error. You need to downgrade the number and then you can delete the related pod/service.

  **<span style="color: blue">kubectl scale deploy node-app-deployment -n mongo-node-nginx-app --replicas=0</span>**

  6. Same reason like above. Downgrade the replicas number so you can delete the related pod/service finally.

  **<span style="color: blue">kubectl scale deploy nginx-deployment -n mongo-node-nginx-app --replicas=0</span>**

  7. Delete the StatefullSet of the mongoDB.

  **<span style="color: blue">kubectl delete sts mongo -n mongo-node-nginx-app</span>**

  8. Delete the exposed node app service.

  **<span style="color: blue">kubectl delete svc node-app-service -n mongo-node-nginx-app</span>**

  9. Delete the exposed nginx service.

  **<span style="color: blue">kubectl delete svc nginx-service -n mongo-node-nginx-app</span>**

  10. Delete the exposed mongoDB service.

  **<span style="color: blue">kubectl delete svc mongo -n mongo-node-nginx-app</span>**

  11. Get logs of a deployed pod with filter condition

  **<span style="color: blue">kubectl logs node-app-deployment-59695dffdc-rxstp -n mongo-node-nginx-app | findstr /i "mongo"</span>**

  (note: "node-app-deployment-59695dffdc-rxstp" is the pod name, **findstr /i "mongo** is to find all logs with "mongo" where **/i** means case insensitive)


  ***************************************************************
  ## Support helm to deploy the project
  
  It also support using helm to deploy the pods. To be able to use helm in Windows machine, you may need to install package manager **Chocolatey** first. Then you can use it to install kubernetes-helm.

  To practice helm for installation, first remove the whole namesapce you done before by the command **kubectl**.

  **<span style="color: blue">kubectl delete namespace mongo-node-nginx-app</span>**

  (note: "mongo-node-nginx-app" is the the namespace used, it is not something hard-coded, you can have your own)

  Suppose helm is avaible now on your machine, to deploy with it, enter in to this project folder, run this command.

    **<span style="color: blue">helm install my-todo-app ./my-fullstack-app -n mongo-node-nginx-app --create-namespace</span>**

  To view the deployed pods, run this:
  
    **<span style="color: blue">kubectl get pods -n mongo-node-nginx-app</span>**

  To view the deployed services, run this:

    **<span style="color: blue">kubectl get svc -n mongo-node-nginx-app</span>**

  To test, in browser go these urls, just like before:

  **http://localhost/**

  **http://localhost/api/health**

  **http://localhost/api/tasks**

  If you make some change, and you want to redploy, run this:
  
  **<span style="color: blue">helm upgrade --install my-node-app ./my-fullstack-app</span>**

*******************************************************************
## Some other helm commands could be used in this project

1. Grammer scan

**<span style="color: blue">helm lint ./my-fullstack-app</span>**

2. Pre-run to check the rendered yaml content

**<span style="color: blue">helm install --dry-run --debug my-test ./my-fullstack-app</span>**

3. List all depoyments under this namespace

**<span style="color: blue">helm list -n mongo-node-nginx-app</span>**

4. Uninstall a deployment

**<span style="color: blue">helm uninstall my-todo-app -n mongo-node-nginx-app</span>**

(note: "my-todo-app" is the deployment name and "mongo-node-nginx-app" is the namespace name)