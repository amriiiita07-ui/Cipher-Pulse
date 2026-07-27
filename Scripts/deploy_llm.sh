#!/usr/bin/env bash
"""
CipherPulse — Local LLM Automatic EC2 Deployment Orchestrator
Installs Ollama, configures system services, pre-pulls the 1B Llama model,
and boots up the unique AI streaming daemon in the background in a single click!
"""

set -euo pipefail

# Visual output helpers
INFO='\033[0;34m[INFO]\033[0m'
SUCCESS='\033[0;32m[SUCCESS]\033[0m'
WARNING='\033[0;33m[WARNING]\033[0m'
ERROR='\033[0;31m[ERROR]\033[0m'

echo -e "======================================================="
echo -e "🔮 CipherPulse Confidential LLM Deployment Orchestrator"
echo -e "======================================================="

# 1. Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo -e "${INFO} Ollama is not installed. Initiating standard installation..."
    curl -fsSL https://ollama.com/install.sh | sh
    echo -e "${SUCCESS} Ollama installed successfully!"
else
    echo -e "${INFO} Ollama is already installed. Skipping installation."
fi

# 2. Ensure Ollama service is active and running in systemd
echo -e "${INFO} Verifying Ollama system service status..."
if systemctl is-active --quiet ollama; then
    echo -e "${SUCCESS} Ollama service is active and running!"
else
    echo -e "${WARNING} Ollama service is not running. Attempting to start..."
    sudo systemctl daemon-reload
    sudo systemctl enable --now ollama
    sleep 3
    if systemctl is-active --quiet ollama; then
        echo -e "${SUCCESS} Ollama service successfully enabled and started!"
    else
        echo -e "${ERROR} Failed to start Ollama system service. Checking local processes..."
        # Fallback to background process if systemd is unavailable (e.g., inside Docker or restricted containers)
        nohup ollama serve > ollama.log 2>&1 &
        sleep 3
    fi
fi

# 3. Pull Llama-3.2-1B model
echo -e "${INFO} Pre-downloading Llama-3.2-1B model (~900MB) from the registry..."
ollama pull llama3.2:1b
echo -e "${SUCCESS} Model llama3.2:1b loaded and ready!"

# 4. Check for Virtual Environment and run the Unique Ingestion Generator
echo -e "${INFO} Activating Python environments and setting up permissions..."
chmod +x "$(dirname "$0")/llm_unique_generator.py"

# Find project directory and active venv
PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
cd "$PROJECT_ROOT"

if [ -d "venv" ]; then
    echo -e "${INFO} Activating existing Python virtual environment..."
    # shellcheck disable=SC1091
    source venv/bin/activate
else
    echo -e "${WARNING} Virtual environment 'venv' not found. Launching using system python..."
fi

# Kill any existing background generator to prevent duplicates
echo -e "${INFO} Stopping any duplicate generator daemons..."
pkill -f llm_unique_generator.py || true

# Launch the Generator Daemon in background
echo -e "${INFO} Launching Llama-3.2-1B unique message generator daemon..."
nohup python3 Scripts/llm_unique_generator.py > llm_generator.log 2>&1 &

echo -e "======================================================="
echo -e "${SUCCESS} DEPLOYMENT COMPLETED EXCELLENTLY!"
echo -e "======================================================="
echo -e "📝 Logs are streaming to: tail -f ${PROJECT_ROOT}/llm_generator.log"
echo -e "📊 Live chats are now flowing into your Postgres database!"
echo -e "======================================================="
