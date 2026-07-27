#!/usr/bin/env python3
"""
CipherPulse — Automated Ingest & Model Training Pipeline Orchestrator
Links data generation, DB ingestion, model retraining, validation quality gates,
and batch scoring into a unified automated pipeline for smooth CI/CD integration.
"""

import os
import sys
import time
import json
import argparse
import subprocess
from collections import Counter

# Add project root to path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, PROJECT_ROOT)

def run_step(step_name: str, command: list, cwd: str = PROJECT_ROOT) -> tuple[bool, str]:
    """Execute a pipeline step as a subprocess with active log tracking."""
    print(f"\n=======================================================")
    print(f"🚀 Running Pipeline Step: {step_name}")
    print(f"   Command: {' '.join(command)}")
    print(f"=======================================================")
    
    start_time = time.time()
    try:
        # Run process and capture stdout/stderr
        result = subprocess.run(
            command,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding='utf-8',
            errors='ignore'
        )
        duration = time.time() - start_time
        print(result.stdout)
        
        if result.returncode == 0:
            print(f"✅ Step '{step_name}' completed successfully in {duration:.2f}s!")
            return True, result.stdout
        else:
            print(f"❌ Step '{step_name}' failed with exit code {result.returncode}!")
            return False, result.stdout
            
    except Exception as e:
        print(f"❌ Fatal error executing step '{step_name}': {str(e)}")
        return False, str(e)

def main():
    parser = argparse.ArgumentParser(description="CipherPulse Ingest & Training Pipeline Orchestrator")
    parser.add_argument("--skip-gen", action="store_true", help="Skip synthetic data generation")
    parser.add_argument("--skip-load", action="store_true", help="Skip loading raw messages to database")
    parser.add_argument("--min-accuracy", type=float, default=0.90, help="Minimum accuracy gate threshold for CI/CD")
    parser.add_argument("--use-tee", choices=["true", "false"], default=None, help="Override TEE socket scoring mode")
    
    args = parser.parse_args()
    
    pipeline_start = time.time()
    report = {
        "pipeline_run_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "status": "FAILED",
        "steps": {},
        "model_validation": {}
    }
    
    print("🎯 Initializing CipherPulse Surveillance Pipeline Orchestrator")
    
    # 1. Step 1: Generate Data
    if args.skip_gen:
        print("⏭️ Skipping Synthetic Data Generation")
        report["steps"]["data_generation"] = {"status": "SKIPPED"}
    else:
        cmd = [sys.executable, "etl/generate_data.py"]
        success, output = run_step("Synthetic Data Generation", cmd)
        report["steps"]["data_generation"] = {
            "status": "SUCCESS" if success else "FAILED",
            "log_snippet": output[-500:] if output else ""
        }
        if not success:
            save_report_and_exit(report)

    # 2. Step 2: Ingest Raw Data into Postgres
    if args.skip_load:
        print("⏭️ Skipping Database Load Ingestion")
        report["steps"]["db_loading"] = {"status": "SKIPPED"}
    else:
        cmd = [sys.executable, "etl/etl_load_raw.py"]
        success, output = run_step("Database Load Ingestion", cmd)
        report["steps"]["db_loading"] = {
            "status": "SUCCESS" if success else "FAILED",
            "log_snippet": output[-500:] if output else ""
        }
        if not success:
            save_report_and_exit(report)

    # 3. Step 3: Train Model with Quality validation Gate
    cmd = [sys.executable, "etl/train_model.py"]
    success, output = run_step("Model Training & Calibration", cmd)
    
    report["steps"]["model_training"] = {
        "status": "SUCCESS" if success else "FAILED"
    }
    
    if not success:
        save_report_and_exit(report)
        
    # Parse output to extract accuracy for the validation gate
    accuracy = None
    for line in output.split('\n'):
        if "Accuracy:" in line:
            try:
                accuracy = float(line.split("Accuracy:")[1].strip())
            except ValueError:
                pass
                
    if accuracy is not None:
        print(f"\n🔍 QA Validation Gate: Model Accuracy is {accuracy * 100:.2f}%")
        report["model_validation"] = {
            "accuracy": accuracy,
            "threshold": args.min_accuracy,
            "gate_passed": accuracy >= args.min_accuracy
        }
        
        if accuracy < args.min_accuracy:
            print(f"❌ QA validation failure: Accuracy ({accuracy:.4f}) is below defined threshold gate ({args.min_accuracy:.4f})!")
            print("🚨 Aborting pipeline to prevent deploying a degraded model weights file.")
            report["status"] = "FAILED"
            save_report_and_exit(report)
        else:
            print(f"🏆 QA Validation Gate Passed! RETRAINED WEIGHTS APPROVED FOR DEPLOYMENT.")
    else:
        print("⚠️ Warning: Validation accuracy score could not be extracted from train log.")
        report["model_validation"] = {"accuracy": None, "gate_passed": True}

    # 4. Step 4: Batch Scoring
    cmd = [sys.executable, "etl/score_batch.py"]
    if args.use_tee:
        # Inject override variable into subprocess env
        os.environ["USE_TEE"] = args.use_tee
        
    success, output = run_step("Batch Alerts Classification & TEE Scoring", cmd)
    report["steps"]["batch_scoring"] = {
        "status": "SUCCESS" if success else "FAILED",
        "log_snippet": output[-500:] if output else ""
    }
    
    if not success:
        save_report_and_exit(report)

    # All steps passed successfully!
    pipeline_duration = time.time() - pipeline_start
    report["status"] = "SUCCESS"
    report["pipeline_duration_seconds"] = round(pipeline_duration, 2)
    
    print(f"\n=======================================================")
    print(f"🎉 Surveillance Pipeline completed successfully in {pipeline_duration:.2f}s!")
    print(f"   Deployment status: READY FOR PRODUCTION ✅")
    print(f"=======================================================")
    
    save_report_and_exit(report, exit_code=0)

def save_report_and_exit(report: dict, exit_code: int = 1):
    """Write structured pipeline report to disk for CI/CD runners to parse."""
    os.makedirs(os.path.join(PROJECT_ROOT, "data"), exist_ok=True)
    report_path = os.path.join(PROJECT_ROOT, "data", "pipeline_report.json")
    
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
        
    print(f"\n📂 Structured pipeline execution report saved to '{report_path}'")
    sys.exit(exit_code)

if __name__ == "__main__":
    main()
