#!/bin/bash

NAMESPACE="dev"
CHART_NAME="feathers-quasar-boilerplate"
CHART_DIR=$(dirname "$0")

# Create namespace if it doesn't exist
kubectl get namespace $NAMESPACE >/dev/null 2>&1
if [ $? -ne 0 ]; then
  kubectl create namespace $NAMESPACE
fi

# Update Helm dependencies
helm dependency update "$CHART_DIR"

# Build Helm dependencies
helm dependency build "$CHART_DIR"

# Install the Helm chart
helm upgrade --install $CHART_NAME "$CHART_DIR" --namespace $NAMESPACE
