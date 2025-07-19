#!/bin/bash

# GooseFilms Local Server Runner

echo "🎬 Starting GooseFilms Local Server..."
echo "=================================="

# Change to the correct directory
cd "/Users/pradyumn/Desktop/GooseFilms " || {
    echo "❌ Error: Could not find GooseFilms directory"
    exit 1
}

# Check if Python 3 is installed
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found"
    echo "📡 Starting server on http://localhost:8000"
    echo ""
    echo "🌐 Open these URLs in your browser:"
    echo "   Homepage: http://localhost:8000"
    echo "   Admin Login: http://localhost:8000/login.html"
    echo "   System Test: http://localhost:8000/test-everything.html"
    echo ""
    echo "🔑 Admin codeword: goosefilms2024"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "=================================="
    
    # Open the browser after a short delay
    (sleep 2 && open http://localhost:8000) &
    
    # Start the server
    python3 -m http.server 8000
else
    echo "❌ Python 3 not found. Please install Python 3 or use another method."
    echo ""
    echo "Alternative: Double-click on index.html to open directly in browser"
fi