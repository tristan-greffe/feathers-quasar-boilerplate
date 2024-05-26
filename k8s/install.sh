#!/bin/bash

NAMESPACE="dev"
CHART_NAME="feathers-quasar-boilerplate"

# Create namespace if it doesn't exist
kubectl get namespace $NAMESPACE >/dev/null 2>&1
if [ $? -ne 0 ]; then
  kubectl create namespace $NAMESPACE
fi

# Update Helm dependencies
helm dependency update ./

# Build Helm dependencies
helm dependency build ./

# Install the Helm chart
helm upgrade --install $CHART_NAME ./ --namespace $NAMESPACE
