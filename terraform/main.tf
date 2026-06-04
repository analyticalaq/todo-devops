terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

# MongoDB Deployment
resource "kubernetes_deployment" "mongo" {
  metadata {
    name = "mongo-tf"
    labels = {
      app = "mongo-tf"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "mongo-tf"
      }
    }

    template {
      metadata {
        labels = {
          app = "mongo-tf"
        }
      }

      spec {
        container {
          name  = "mongo"
          image = "mongo:6"

          port {
            container_port = 27017
          }
        }
      }
    }
  }
}

# MongoDB Service
resource "kubernetes_service" "mongo" {
  metadata {
    name = "mongo-tf"
  }

  spec {
    selector = {
      app = "mongo-tf"
    }

    port {
      port        = 27017
      target_port = 27017
    }
  }
}

# Backend Deployment
resource "kubernetes_deployment" "backend" {
  metadata {
    name = "backend-tf"
    labels = {
      app = "backend-tf"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "backend-tf"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend-tf"
        }
      }

      spec {
        container {
          name  = "backend"
          image = "abdulqadeer134/todo-backend:latest"

          port {
            container_port = 5000
          }

          env {
            name  = "MONGO_URI"
            value = "mongodb://mongo-tf:27017/tododb"
          }

          env {
            name  = "PORT"
            value = "5000"
          }
        }
      }
    }
  }
}

# Backend Service
resource "kubernetes_service" "backend" {
  metadata {
    name = "backend-tf"
  }

  spec {
    selector = {
      app = "backend-tf"
    }

    type = "NodePort"

    port {
      port        = 5000
      target_port = 5000
      node_port   = 30501
    }
  }
}

# Frontend Deployment
resource "kubernetes_deployment" "frontend" {
  metadata {
    name = "frontend-tf"
    labels = {
      app = "frontend-tf"
    }
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "frontend-tf"
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend-tf"
        }
      }

      spec {
        container {
          name  = "frontend"
          image = "abdulqadeer134/todo-frontend:latest"

          port {
            container_port = 80
          }
        }
      }
    }
  }
}

# Frontend Service
resource "kubernetes_service" "frontend" {
  metadata {
    name = "frontend-tf"
  }

  spec {
    selector = {
      app = "frontend-tf"
    }

    type = "NodePort"

    port {
      port        = 80
      target_port = 80
      node_port   = 30801
    }
  }
}