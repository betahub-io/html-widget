#!/bin/bash
# Stop local HTTP server for BetaHub Widget testing

PIDFILE=".server.pid"

# Check if PID file exists
if [ ! -f "$PIDFILE" ]; then
    echo "❌ No server PID file found"
    echo "   Server doesn't appear to be running (managed by this script)"
    echo ""
    echo "🔍 Checking for orphaned Python HTTP servers on port 8000..."

    # Check if port 8000 is in use
    PID=$(lsof -ti:8000 2>/dev/null)
    if [ -n "$PID" ]; then
        echo "⚠️  Found process using port 8000 (PID: $PID)"
        echo "   Kill it manually with: kill $PID"
    else
        echo "✅ Port 8000 is free"
    fi
    exit 1
fi

# Read PID
PID=$(cat "$PIDFILE")

# Check if process is running
if ps -p $PID > /dev/null 2>&1; then
    echo "🛑 Stopping server (PID: $PID)..."
    kill $PID

    # Wait for process to stop
    sleep 1

    # Check if stopped
    if ps -p $PID > /dev/null 2>&1; then
        echo "⚠️  Process didn't stop gracefully, force killing..."
        kill -9 $PID
        sleep 1
    fi

    # Verify stopped
    if ps -p $PID > /dev/null 2>&1; then
        echo "❌ Failed to stop server"
        exit 1
    else
        echo "✅ Server stopped successfully"
        rm "$PIDFILE"
    fi
else
    echo "⚠️  Server process (PID: $PID) not found"
    echo "   Cleaning up stale PID file..."
    rm "$PIDFILE"
    echo "✅ Cleanup complete"
fi
