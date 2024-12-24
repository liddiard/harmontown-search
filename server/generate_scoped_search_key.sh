#!/bin/bash

# Create a Typesense search API key that has embedded params
# Enables caching and prevents users from making arbitrary queries
# https://typesense.org/docs/0.25.1/api/api-keys.html#generate-scoped-search-key

# NOTE: On `base64` calls, I've removed the `-w0` flag from the example script 
# in order to run on macOS
# https://stackoverflow.com/a/46464081

if [[ -z "${API_KEY}" ]]; then
  >&2 echo "Missing required environment variable: API_KEY"
  exit 1
else
  KEY_WITH_SEARCH_PERMISSIONS="${API_KEY}"
fi

EMBEDDED_SEARCH_PARAMETERS_JSON='{"query_by":"text","group_by":"episode","group_limit":10,"sort_by":"episode:asc","use_cache":true,"cache_ttl":3600}'

digest=$(echo -n $EMBEDDED_SEARCH_PARAMETERS_JSON | openssl dgst -sha256 -hmac $KEY_WITH_SEARCH_PERMISSIONS -binary | base64)

scoped_api_key=$(echo -n "${digest}${KEY_WITH_SEARCH_PERMISSIONS:0:4}${EMBEDDED_SEARCH_PARAMETERS_JSON}" | base64)

echo "Scoped API key: "
echo $scoped_api_key