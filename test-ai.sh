#!/bin/bash
echo "Testing AI Roadmap Generation..."
echo "Make sure backend is running with: cd backend && npm run dev"
echo ""
echo "To test, run this in another terminal:"
echo "curl -X POST http://localhost:5000/api/paths/ai-roadmap \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -H 'Authorization: Bearer YOUR_TOKEN' \\"
echo "  -d '{\"role\": \"Frontend Developer\"}'"
