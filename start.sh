#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "================================================================="
echo "  MANOBAL (मनोबल) · Defensive Personnel Welfare Monitoring System"
echo "  SIH26186 · Predictive Stress & Welfare Monitoring Architecture"
echo "================================================================="

# Clean up any stale processes on ports 8001 and 5174
for port in 8001 5174; do
  pids=$(lsof -ti :$port 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "Clearing previous process on port $port (PID: $pids)..."
    kill -9 $pids 2>/dev/null || true
    sleep 0.5
  fi
done

# Resolve uvicorn binary
UVICORN_BIN="$DIR/backend/venv/bin/uvicorn"
if [ ! -f "$UVICORN_BIN" ]; then
  UVICORN_BIN="uvicorn"
fi

# Start Backend API on port 8001
echo "[1/2] Starting Manobal Defensive Backend API on http://localhost:8001..."
"$UVICORN_BIN" app.main:app --app-dir "$DIR/backend" --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!


# Start Frontend on port 5174
echo "[2/2] Starting Manobal Vite React Frontend on http://localhost:5174..."
npm --prefix "$DIR/frontend" run dev -- --host 0.0.0.0 --port 5174 &
FRONTEND_PID=$!

cleanup() {
  echo ""
  echo "Shutting down Manobal systems..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
  for port in 8001 5174; do
    pids=$(lsof -ti :$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
      kill -9 $pids 2>/dev/null || true
    fi
  done
  exit 0
}

trap cleanup INT TERM

echo ""
echo "================================================================="
echo "  ✓ MANOBAL SYSTEM RUNNING SUCCESSFULLY"
echo "  - Web Application: http://localhost:5174"
echo "  - Backend REST API & Docs: http://localhost:8001/docs"
echo "  - Emergency Helplines: Tele-MANAS (14416) & KIRAN (1800-599-0019)"
echo "  - Press Ctrl+C to terminate services"
echo "================================================================="

wait

