#!/bin/bash
cd /home/kavia/workspace/code-generation/culinary-explorer-71845-71863/recipe_explorer_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

