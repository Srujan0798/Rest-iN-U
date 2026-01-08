#!/bin/bash

# Script to replace console.log with logger statements
# This ensures structured logging across the entire backend

echo "🔄 Replacing console.log with logger statements..."
echo ""

# Count total console statements
total=$(grep -r "console\." src --include="*.ts" | wc -l)
echo "Found $total console statements to replace"
echo ""

# Function to replace console statements in a file
replace_in_file() {
  local file=$1

  # Check if file has console statements
  if grep -q "console\." "$file"; then
    # Check if logger is already imported
    if ! grep -q "import.*logger.*from.*'.*logger'" "$file"; then
      # Add logger import after other imports
      sed -i '' "/^import/a\\
import { logger } from '../utils/logger';\\
" "$file"
    fi

    # Replace console.log with logger.info
    sed -i '' 's/console\.log(/logger.info(/g' "$file"

    # Replace console.error with logger.error
    sed -i '' 's/console\.error(/logger.error(/g' "$file"

    # Replace console.warn with logger.warn
    sed -i '' 's/console\.warn(/logger.warn(/g' "$file"

    # Replace console.debug with logger.debug
    sed -i '' 's/console\.debug(/logger.debug(/g' "$file"

    echo "✅ Updated: $file"
  fi
}

# Process all TypeScript files in src/routes
echo "Processing route files..."
for file in src/routes/*.ts; do
  replace_in_file "$file"
done

echo ""
echo "Processing service files..."
for file in src/services/*.ts; do
  replace_in_file "$file" 2>/dev/null
done

echo ""
echo "Processing controller files..."
for file in src/controllers/*.ts; do
  replace_in_file "$file" 2>/dev/null
done

echo ""
echo "✅ Console.log replacement complete!"
echo ""
echo "Note: Please review the changes and adjust logger import paths if needed."
