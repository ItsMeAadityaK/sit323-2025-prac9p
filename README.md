1. First, I logged into the Google Cloud Console and created a Standard Kubernetes Cluster named sit323-cluster.
2. While setting up the cluster, I selected the australia-southeast2 region and used a regional configuration with one node to avoid the delays experienced in zonal clusters.
3. Once the cluster was created, I confirmed my student account was active and selected the correct project sit323-25t1-kulkarni-c60fbf8.
4. I reused my calculator microservice from previous tasks and updated the code to log arithmetic operations to a MongoDB database.
5. I built the Docker image locally and pushed it to my Docker Hub account under aadityakulk/calc-microservice.
6. After that, I created Kubernetes YAML files for deploying MongoDB, setting up a secret for MongoDB credentials, defining persistent volume claims, and configuring my app deployment and service.
7. I applied all the YAML files to the cluster using kubectl and waited for all pods to reach the Running state.
8. I then accessed the microservice using the External IP assigned by the LoadBalancer and verified that the calculator was working through various endpoints.
9. To ensure MongoDB integration was successful, I checked the /history endpoint which displayed recent operations stored in the database.
10. All required screenshots were captured and the task was completed successfully with the application fully functional on GCP Kubernetes.