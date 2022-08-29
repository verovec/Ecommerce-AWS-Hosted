#!/bin/sh

set -e

wget -O /usr/local/bin/copilot https://github.com/aws/copilot-cli/releases/download/v1.13.0/copilot-linux
chmod +x /usr/local/bin/copilot
copilot -v

mkdir -p ~/.aws
printf "[default]\nregion = %s\n" "$AWS_DEFAULT_REGION" > ~/.aws/config
printf "[default]\naws_access_key_id = %s\naws_secret_access_key = %s\n" "$AWS_ACCESS_KEY_ID" "$AWS_SECRET_ACCESS_KEY" > ~/.aws/credentials
