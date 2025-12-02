#!/bin/bash

# Usage:
#   ./tellfortune.sh festive
#   ./tellfortune.sh grumpy
#   ./tellfortune.sh mysterious

MOOD=$1

if [ -z "$MOOD" ]; then
  echo "Error: No mood provided."
  echo "Usage: ./tellfortune.sh <grumpy|poetic|festive|sarcastic|mysterious>"
  exit 1
fi

goose run \
  -n fortune-teller \
  -i instructions.md \
  -p "{ \"mood\": \"$MOOD\" }"
