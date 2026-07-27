#!/bin/bash
# Script to build the AWS Nitro Enclave Image File (EIF)

echo "🔨 Building Docker image for the enclave..."
docker build -t cipherpulse-enclave -f enclave/Dockerfile.enclave .

echo "🔐 Converting Docker image to EIF (Enclave Image File)..."
sudo nitro-cli build-enclave \
    --docker-uri cipherpulse-enclave:latest \
    --output-file cipherpulse.eif

echo "✅ Enclave image cipherpulse.eif built successfully!"
echo ""
echo "To run the enclave:"
echo "nitro-cli run-enclave --eif cipherpulse.eif --memory 2048 --cpu-count 2 --enclave-cid 16"
