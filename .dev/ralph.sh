#!/usr/bin/env bash
set -euo pipefail

# Usage: ./ralph.sh [max_iterations]
MAX_ITERATIONS=${1:-10}
TASK_FILE="tasks.md"
COMPLETE_FLAG="ralph_complete"

for i in $(seq 1 "$MAX_ITERATIONS"); do
  # Exit if we've created the completion flag
  if [[ -f "$COMPLETE_FLAG" ]]; then
    echo "All tasks are now complete (found $COMPLETE_FLAG). Exiting."
    exit 0
  fi

  # Read the tasks file into the prompt for the agent
  AGENT_PROMPT=$(cat <<'PROMPT'
Read tasks.md. Choose one suitable incomplete task, implement the change in the repository,
include tests where practical and run the test suite (do not stop until tests are green).
Run formatters / linters (for example: PHP-CS-Fixer) and commit the changes.
Update tasks.md with a Progress entry describing the changes and which task was completed.
If there are no remaining tasks, create a file named ralph_complete.
PROMPT
)

  # Call the agent (example placeholder; replace with your agent's CLI)
  # Using a fictional 'claude' CLI here; adjust flags for non-interactive / approved permissions
  echo "$AGENT_PROMPT" | claude --non-interactive --stdin

  # After the agent finishes, run your local verification steps (optional but recommended)
  # Install deps / run test suite / run formatters
  composer install --no-interaction --no-progress
  vendor/bin/pest --colors
  vendor/bin/rector process src --config rector.php || true
  vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.php --allow-risky=yes || true

  # If the agent made changes, commit them (agent may already commit; this is a safety step)
  if [[ -n "$(git status --porcelain)" ]]; then
    git add -A
    git commit -m "Ralph: automated changes (iteration $i)"
  fi

  # Print progress
  echo "Completed iteration $i"
done

echo "Reached maximum iterations ($MAX_ITERATIONS). Exiting."
exit 0
