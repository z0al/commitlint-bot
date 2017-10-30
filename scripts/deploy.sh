#!/usr/bin/env bash
set -euo pipefail

now="npm run -s now -- --token=$NOW_TOKEN"
repo_name="${TRAVIS_REPO_SLUG##*/}"

$now --public
$now alias
$now rm --safe --yes "$repo_name"