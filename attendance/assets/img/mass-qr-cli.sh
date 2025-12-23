#!/usr/bin/env bash

API_URL="https://castelancarpinteyro.com/php-scripts/create-qr-cli.php"
OUTPUT_DIR="./qrs"

if [[ -z "$1" ]]; then
  echo "Uso: $0 urls.txt"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

while IFS= read -r url || [[ -n "$url" ]]; do

  [[ -z "$url" || "$url" =~ ^# ]] && continue

  echo "Generando QR para: $url"

  RESPONSE=$(curl -s -G --data-urlencode "url=$url" "$API_URL")

  STATUS=$(echo "$RESPONSE" | jq -r '.status')

  if [[ "$STATUS" != "ok" ]]; then
    echo "  Error: $(echo "$RESPONSE" | jq -r '.message')"
    continue
  fi

  FILE_URL=$(echo "$RESPONSE" | jq -r '.url')
  FILE_NAME=$(basename "$FILE_URL")

  curl -s "$FILE_URL" -o "$OUTPUT_DIR/$FILE_NAME"

  echo "  Guardado como: $OUTPUT_DIR/$FILE_NAME"

done < "$1"

echo "Proceso finalizado."
