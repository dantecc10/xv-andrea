#!/usr/bin/env bash

API_URL="https://castelancarpinteyro.com/php-scripts/create-qr-cli.php"
OUTPUT_DIR="./ordered-qrs"
PREFIX="qr-guest"

if [[ -z "$1" ]]; then
  echo "Uso: $0 urls.txt"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

i=1

while IFS= read -r url || [[ -n "$url" ]]; do

  [[ -z "$url" || "$url" =~ ^# ]] && continue

  echo "Generando QR #$i para: $url"

  RESPONSE=$(curl -s -G --data-urlencode "url=$url" "$API_URL")

  STATUS=$(echo "$RESPONSE" | jq -r '.status')

  if [[ "$STATUS" != "ok" ]]; then
    echo "  Error al generar QR"
    continue
  fi

  FILE_URL=$(echo "$RESPONSE" | jq -r '.url')

  TARGET_NAME="${PREFIX}-${i}.svg"

  curl -s "$FILE_URL" -o "$OUTPUT_DIR/$TARGET_NAME"

  echo "  Guardado como: $OUTPUT_DIR/$TARGET_NAME"

  ((i++))

done < "$1"

echo "Proceso finalizado."
