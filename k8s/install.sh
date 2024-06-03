#!/bin/bash

NAMESPACE_APP="dev"
NAMESPACE_MONITORING="monitoring"
CHART_NAME="feathers-quasar-boilerplate"
CHART_DIR=$(dirname "$0")

#####################
## NAMESPACES
#####################

# Create namespaces if they don't exist
kubectl get namespace $NAMESPACE_APP >/dev/null 2>&1
if [ $? -ne 0 ]; then
  kubectl create namespace $NAMESPACE_APP
fi

kubectl get namespace $NAMESPACE_MONITORING >/dev/null 2>&1
if [ $? -ne 0 ]; then
  kubectl create namespace $NAMESPACE_MONITORING
fi

#####################
## ADD HELM REPO
#####################

# Add bitnami repositories if they don't exist
helm repo list | grep "bitnami" >/dev/null 2>&1
if [ $? -ne 0 ]; then
  helm repo add "bitnami" "https://charts.bitnami.com/bitnami"
fi

# Add prometheus-community repositories if they don't exist
helm repo list | grep "prometheus-community" >/dev/null 2>&1
if [ $? -ne 0 ]; then
  helm repo add "prometheus-community" "https://prometheus-community.github.io/helm-charts"
fi

# Add grafana repositories if they don't exist
helm repo list | grep "grafana" >/dev/null 2>&1
if [ $? -ne 0 ]; then
  helm repo add "grafana" "https://grafana.github.io/helm-charts"
fi

# Update Helm repositories
helm repo update

#####################
## INSTALL
#####################

# Update & build Helm dependencies
helm dependency update "$CHART_DIR"
helm dependency build "$CHART_DIR"

# Install the Helm chart for the application
helm upgrade --install $CHART_NAME "$CHART_DIR" --namespace $NAMESPACE_APP

# Install Prometheus
helm upgrade --install prometheus prometheus-community/prometheus --namespace $NAMESPACE_MONITORING -f "$CHART_DIR/charts/prometheus/values.yaml"

# Install Grafana
helm upgrade --install grafana grafana/grafana --namespace $NAMESPACE_MONITORING -f "$CHART_DIR/charts/grafana/values.yaml"

#####################
## RUN HELM TESTS
#####################

# for the application
helm test $CHART_NAME --namespace $NAMESPACE_APP
