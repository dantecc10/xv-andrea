#!/usr/bin/env bash

BASE_URL="https://castelancarpinteyro.com/php-scripts/create-qr.php"
QR_PUBLIC_PATH="https://castelancarpinteyro.com/php-scripts/generated-qrs"
OUTPUT_DIR="./qrs"

if [[ -z "$1" ]]; then
  echo "Uso: $0 lista_de_urls.txt"
  exit 1
fi

if [[ ! -f "$1" ]]; then
  echo "El archivo '$1' no existe"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

while IFS= read -r url || [[ -n "$url" ]]; do

  [[ -z "$url" || "$url" =~ ^# ]] && continue

  echo "Generando QR para: $url"

  LOCATION=$(curl -s -I -G --data-urlencode "url=$url" "$BASE_URL" \
    | awk '/^Location:/ {print $2}' \
    | tr -d '\r')

  if [[ -z "$LOCATION" ]]; then
    echo "  Error: no se recibió redirección"
    continue
  fi

  # Extraer el valor real del archivo (?file=...)
  FILE=$(echo "$LOCATION" | sed -n 's/.*file=\(qr-[^&]*\.svg\).*/\1/p')

  if [[ -z "$FILE" ]]; then
    echo "  Error: no se pudo extraer el nombre del QR"
    continue
  fi

  curl -s "$QR_PUBLIC_PATH/$FILE" -o "$OUTPUT_DIR/$FILE"

  if [[ $? -eq 0 ]]; then
    echo "  Guardado como: $OUTPUT_DIR/$FILE"
  else
    echo "  Error al descargar $FILE"
  fi

done < "$1"

echo "Proceso finalizado."
