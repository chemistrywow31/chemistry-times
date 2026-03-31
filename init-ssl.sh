#!/bin/bash
# =============================================================================
# init-ssl.sh — First-time SSL certificate setup for ChemistryTimes
#
# Reuses cddn's certbot volume so both domains share the same renewal loop.
# Run this on the production server.
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
EMAIL="${CERTBOT_EMAIL:-admin@meet-chess.com}"
STAGING_FLAG=""
CDDN_DIR="${CDDN_DIR:-/Users/wow/wrk/side_proj/cddn}"

if [[ "${2:-}" == "--staging" ]]; then
  STAGING_FLAG="--staging"
  echo "[INFO] Using Let's Encrypt STAGING environment (certificates won't be trusted)"
fi

# Reuse cddn's certbot directories
CERTBOT_CONF="${CDDN_DIR}/certbot/conf"
CERTBOT_WWW="${CDDN_DIR}/certbot/www"

if [[ ! -d "$CERTBOT_CONF" ]] || [[ ! -d "$CERTBOT_WWW" ]]; then
  echo "[ERROR] cddn certbot directories not found at ${CDDN_DIR}/certbot/"
  echo "        Make sure cddn is set up first, or set CDDN_DIR to the correct path."
  exit 1
fi

echo "==> Domain:      ${DOMAIN}"
echo "==> Email:       ${EMAIL}"
echo "==> Certbot dir: ${CDDN_DIR}/certbot/"
echo ""

# Check if cddn nginx is running
if docker ps --format '{{.Names}}' | grep -q 'cddn-nginx'; then
  echo "==> cddn-nginx is running."
  echo "    Temporarily adding ${DOMAIN} ACME challenge to cddn nginx..."

  # Inject a temporary server block for CT domain ACME challenge
  TMPCONF=$(mktemp)
  cat > "$TMPCONF" <<NGINX
server {
    listen 80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'ChemistryTimes — waiting for SSL certificate...';
        add_header Content-Type text/plain;
    }
}
NGINX

  # Copy temp config into cddn-nginx and reload
  docker cp "$TMPCONF" cddn-nginx:/etc/nginx/conf.d/ct-acme-temp.conf
  docker exec cddn-nginx nginx -s reload
  rm -f "$TMPCONF"

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

  # Remove temporary config and reload
  docker exec cddn-nginx rm -f /etc/nginx/conf.d/ct-acme-temp.conf
  docker exec cddn-nginx nginx -s reload
  echo "==> Temporary ACME config removed."

else
  echo "==> cddn-nginx not running. Starting temporary nginx for ACME challenge..."

  # Replace placeholder in init config
  TMPCONF=$(mktemp)
  sed "s/CT_DOMAIN/${DOMAIN}/g" "$(pwd)/nginx/nginx-init.conf" > "$TMPCONF"

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
fi

echo ""
echo "==> Done! Certificate obtained for ${DOMAIN}."
echo ""
echo "Next steps:"
echo "  1. Merge nginx/ct.conf into cddn's nginx/nginx.conf (replace CT_DOMAIN with ${DOMAIN})"
echo "  2. Reload cddn nginx: docker exec cddn-nginx nginx -s reload"
echo "  3. Start CT: IMAGE_TAG=<tag> docker compose -f docker-compose.prod.yml up -d"
