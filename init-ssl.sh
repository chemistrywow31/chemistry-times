#!/bin/bash
# =============================================================================
# init-ssl.sh — First-time SSL certificate setup for ChemistryTimes
#
# Starts a temporary nginx for ACME challenge, requests a cert from
# Let's Encrypt, then stops. After this, use docker-compose.prod.yml
# which includes nginx + certbot with auto-renewal.
#
# Usage:
#   chmod +x init-ssl.sh
#   ./init-ssl.sh <domain>              # e.g. ./init-ssl.sh ct.example.com
#   ./init-ssl.sh <domain> --staging    # Use Let's Encrypt staging CA
# =============================================================================

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <domain> [--staging]"
  echo "Example: $0 ct.example.com"
  exit 1
fi

DOMAIN="$1"
EMAIL="${CERTBOT_EMAIL:?Set CERTBOT_EMAIL to your email for Let's Encrypt notifications}"
STAGING_FLAG=""

if [[ "${2:-}" == "--staging" ]]; then
  STAGING_FLAG="--staging"
  echo "[INFO] Using Let's Encrypt STAGING environment (certificates won't be trusted)"
fi

CERTBOT_CONF="$(pwd)/certbot/conf"
CERTBOT_WWW="$(pwd)/certbot/www"

mkdir -p "$CERTBOT_CONF" "$CERTBOT_WWW"

echo "==> Domain:      ${DOMAIN}"
echo "==> Email:       ${EMAIL}"
echo "==> Certbot dir: $(pwd)/certbot/"
echo ""

# Replace CT_DOMAIN placeholder in init config
TMPCONF=$(mktemp)
sed "s/CT_DOMAIN/${DOMAIN}/g" "$(pwd)/nginx/nginx-init.conf" > "$TMPCONF"

echo "==> Starting temporary nginx for ACME challenge..."
docker run -d --rm --name ct-nginx-init \
  -v "${TMPCONF}:/etc/nginx/conf.d/default.conf:ro" \
  -v "${CERTBOT_WWW}:/var/www/certbot:ro" \
  -p 80:80 \
  nginx:alpine

echo "==> Requesting certificate from Let's Encrypt..."
docker run --rm \
  -v "${CERTBOT_CONF}:/etc/letsencrypt" \
  -v "${CERTBOT_WWW}:/var/www/certbot" \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  $STAGING_FLAG \
  -d "$DOMAIN"

docker stop ct-nginx-init 2>/dev/null || true
rm -f "$TMPCONF"

echo ""
echo "==> Done! Certificate obtained for ${DOMAIN}."
echo ""
echo "Next steps:"
echo "  1. Replace CT_DOMAIN with ${DOMAIN} in nginx/ct.conf"
echo "  2. Start services: IMAGE_TAG=<tag> docker compose -f docker-compose.prod.yml up -d"
