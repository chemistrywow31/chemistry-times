#!/bin/bash
# =============================================================================
# build-push.sh — Build and push ChemistryTimes Docker image
#
# Cross-compiles from macOS ARM to linux/amd64 via docker buildx.
#
# Usage:
#   ./build-push.sh              # build + push
#   ./build-push.sh --build-only # build only, load to local docker
# =============================================================================

set -euo pipefail

PLATFORM="linux/amd64"
IMAGE_TAG=$(date +%Y%m%d-%H%M%S)
export IMAGE_TAG

REGISTRY="${REGISTRY:-your-dockerhub-user}"
IMAGE="${REGISTRY}/chemistry-times:${IMAGE_TAG}"

echo "==> Platform: ${PLATFORM}"
echo "==> Tag:      ${IMAGE_TAG}"
echo "==> Image:    ${IMAGE}"
echo ""

# Ensure buildx builder exists
BUILDER_NAME="ct-builder"
if ! docker buildx inspect "${BUILDER_NAME}" &>/dev/null; then
  echo "==> Creating buildx builder: ${BUILDER_NAME}"
  docker buildx create --name "${BUILDER_NAME}" --use
else
  docker buildx use "${BUILDER_NAME}"
fi

if [[ "${1:-}" == "--build-only" ]]; then
  echo "==> Building image (load to local docker)..."
  docker buildx build --platform "${PLATFORM}" \
    -f Dockerfile \
    -t "${IMAGE}" --load .

  echo ""
  echo "==> Build complete (skip push)."
  echo "IMAGE_TAG=${IMAGE_TAG}"
  exit 0
fi

echo "==> Building and pushing image..."
docker buildx build --platform "${PLATFORM}" \
  -f Dockerfile \
  -t "${IMAGE}" --push .

echo ""
echo "==> Done!"
echo "IMAGE_TAG=${IMAGE_TAG}"
echo ""
echo "Deploy with:"
echo "  IMAGE_TAG=${IMAGE_TAG} docker compose -f docker-compose.prod.yml up -d"
