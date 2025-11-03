#!/bin/bash
# Start local HTTP server for testing BetaHub Widget

PORT=8000
PIDFILE=".server.pid"

# Check if server is already running
if [ -f "$PIDFILE" ]; then
    PID=$(cat "$PIDFILE")
    if ps -p $PID > /dev/null 2>&1; then
        echo "❌ Server is already running on port $PORT (PID: $PID)"
        echo "   View at: http://localhost:$PORT"
        echo "   Stop it with: ./scripts/stop-server.sh"
        exit 1
    else
        # Stale PID file, remove it
        rm "$PIDFILE"
    fi
fi

# Check if port is in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "❌ Port $PORT is already in use by another process"
    echo "   Stop it with: lsof -ti:$PORT | xargs kill -9"
    exit 1
fi

# Start the server
echo "🚀 Starting HTTP server on port $PORT..."
python3 -m http.server $PORT > /dev/null 2>&1 &
SERVER_PID=$!

# Save PID
echo $SERVER_PID > "$PIDFILE"

# Wait a moment for server to start
sleep 1

# Check if server started successfully
if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "✅ Server started successfully!"
    echo ""
    echo "📍 Available pages:"
    echo "   • Demo:           http://localhost:$PORT/demo.html"
    echo "   • Single Type:    http://localhost:$PORT/tests/manual/test-single-type.html"
    echo "   • Partial Types:  http://localhost:$PORT/tests/manual/test-partial-types.html"
    echo "   • Config Error:   http://localhost:$PORT/tests/manual/test-config-error.html"
    echo "   • Invalid Types:  http://localhost:$PORT/tests/manual/test-invalid-types.html"
    echo ""
    echo "📋 To run tests:"
    echo "   See tests/MANUAL_TESTING_GUIDE.md"
    echo ""
    echo "🛑 To stop the server:"
    echo "   ./scripts/stop-server.sh"
else
    echo "❌ Failed to start server"
    rm "$PIDFILE"
    exit 1
fi
