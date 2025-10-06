#!/usr/bin/env bash
# Abre o index.html no navegador padrão (Linux / macOS)
TARGET="$(dirname "$0")/index.html"
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$TARGET"
elif command -v open >/dev/null 2>&1; then
  open "$TARGET"
else
  echo "Abra $TARGET manualmente no navegador."
fi
