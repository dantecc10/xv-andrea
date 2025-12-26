#!/bin/bash
./create-qr-cli.php guests.txt

# Convert SVG QR codes to PNG
for file in ordered-qrs/*.svg; do
  inkscape "$file" \
    --export-type=png \
    --export-width=2048 \
    --export-height=2048 \
    --export-filename="${file%.svg}.png"
done

# Remove SVG files
rm ordered-qrs/*.svg
