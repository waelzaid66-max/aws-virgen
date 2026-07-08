#!/usr/bin/env bash
# Push main to all BANCO production mirrors (run from Replit or a machine with push access).
set -euo pipefail
cd "$(dirname "$0")/.."

SHA="$(git rev-parse HEAD)"
echo "[sync] HEAD = $SHA"

add_remote() {
  local name="$1"
  local repo="$2"
  local url
  if git remote get-url origin &>/dev/null; then
    url="$(git remote get-url origin | sed "s|-BANCO-CA-OOM-|$repo|")"
  else
    url="https://github.com/waelzaid66-max/$repo.git"
  fi
  if git remote get-url "$name" &>/dev/null; then
    git remote set-url "$name" "$url"
  else
    git remote add "$name" "$url"
  fi
}

add_remote bbanco b-banco
add_remote bdeals b.deals
add_remote boom B-OOM

git push -u origin main
for r in bbanco bdeals boom; do
  echo "[sync] pushing main -> $r"
  git push "$r" main:main
done

echo "[sync] verify:"
git fetch origin bbanco bdeals boom
git rev-parse HEAD origin/main bbanco/main bdeals/main boom/main
