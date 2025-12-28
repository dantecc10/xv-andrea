#!/bin/bash

# Script para consultar información de invitado mediante código QR
# Uso: ./check-guest.sh <URL_o_CODIGO_QR>

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# URL base del endpoint
BASE_URL="https://xv-andrea.castelancarpinteyro.com/attendance/guest.php"

# Verificar que se pasó un argumento
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: Debes proporcionar una URL o código QR${NC}"
    echo "Uso: $0 <URL_o_CODIGO_QR>"
    echo "Ejemplo 1: $0 ABC123XYZ"
    echo "Ejemplo 2: $0 'https://xv-andrea.castelancarpinteyro.com/attendance/guest.php?qr_code=ABC123XYZ'"
    exit 1
fi

# Verificar que curl está instalado
if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl no está instalado${NC}"
    echo "Instala curl con: sudo apt-get install curl"
    exit 1
fi

# Verificar que jq está instalado
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}Advertencia: jq no está instalado. El output será JSON crudo.${NC}"
    echo "Para mejor visualización instala jq con: sudo apt-get install jq"
    USE_JQ=false
else
    USE_JQ=true
fi

# Determinar si el argumento es una URL completa o solo el código QR
INPUT="$1"
if [[ "$INPUT" == http* ]]; then
    # Es una URL completa, extraer el código QR
    QR_CODE=$(echo "$INPUT" | grep -oP 'qr_code=\K[^&]+' | head -1)
    if [ -z "$QR_CODE" ]; then
        echo -e "${RED}Error: No se pudo extraer el código QR de la URL${NC}"
        exit 1
    fi
else
    # Es solo el código QR
    QR_CODE="$INPUT"
fi

# URL encode del código QR
QR_CODE_ENCODED=$(echo "$QR_CODE" | jq -sRr @uri 2>/dev/null || python3 -c "import urllib.parse; print(urllib.parse.quote('$QR_CODE'))" 2>/dev/null || echo "$QR_CODE")

# Construir la URL completa
FETCH_URL="${BASE_URL}?qr_code=${QR_CODE_ENCODED}&ajax=1"

echo -e "${CYAN}${BOLD}Consultando información del invitado...${NC}"
echo -e "${BLUE}Código QR: ${YELLOW}$QR_CODE${NC}"
echo ""

# Hacer la petición
RESPONSE=$(curl -s "$FETCH_URL")

# Verificar si la respuesta está vacía
if [ -z "$RESPONSE" ]; then
    echo -e "${RED}Error: No se recibió respuesta del servidor${NC}"
    exit 1
fi

# Si jq está disponible, parsear y mostrar formateado
if [ "$USE_JQ" = true ]; then
    # Verificar si es JSON válido
    if ! echo "$RESPONSE" | jq empty 2>/dev/null; then
        echo -e "${RED}Error: La respuesta no es JSON válido${NC}"
        echo "Respuesta recibida:"
        echo "$RESPONSE"
        exit 1
    fi

    # Extraer valores
    SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
    MESSAGE=$(echo "$RESPONSE" | jq -r '.message')

    if [ "$SUCCESS" != "true" ]; then
        echo -e "${RED}${BOLD}ERROR${NC}"
        echo -e "${RED}Mensaje: $MESSAGE${NC}"
        exit 1
    fi

    # Extraer datos del invitado
    FAMILY=$(echo "$RESPONSE" | jq -r '.data.family_guest // "N/A"')
    NAME=$(echo "$RESPONSE" | jq -r '.data.name_guest // "N/A"')
    LAST_NAMES=$(echo "$RESPONSE" | jq -r '.data.last_names_guest // "N/A"')
    TABLE=$(echo "$RESPONSE" | jq -r '.data.assigned_to_table // "N/A"')
    ADULTS=$(echo "$RESPONSE" | jq -r '.data.adults_qr_code // 0')
    KIDS=$(echo "$RESPONSE" | jq -r '.data.kids_qr_code // 0')
    TOTAL=$(echo "$RESPONSE" | jq -r '.data.total_passes // 0')

    # Mostrar información formateada
    echo -e "${GREEN}${BOLD}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}${BOLD}║           ¡PASE ENCONTRADO!                            ║${NC}"
    echo -e "${GREEN}${BOLD}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}${BOLD}FAMILIA:${NC}"
    echo -e "  ${PURPLE}$FAMILY${NC}"
    echo ""
    echo -e "${CYAN}${BOLD}NOMBRE:${NC}"
    echo -e "  ${PURPLE}$NAME $LAST_NAMES${NC}"
    echo ""
    echo -e "${CYAN}${BOLD}MESA:${NC}"
    echo -e "  ${YELLOW}${BOLD}$TABLE${NC}"
    echo ""
    echo -e "${CYAN}${BOLD}PASES:${NC}"
    echo -e "  Adultos: ${YELLOW}$ADULTS${NC}"
    echo -e "  Niños:   ${YELLOW}$KIDS${NC}"
    echo -e "  ${BOLD}Total:   ${GREEN}$TOTAL${NC}"
    echo ""

else
    # Sin jq, mostrar JSON crudo
    echo "$RESPONSE"
fi
