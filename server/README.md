# Search engine server

[Typesense](https://typesense.org/) powers the episode transcript search.

## Prerequisites

[Install Docker](https://docs.docker.com/get-started/get-docker/)

## Development

From this directory, run:

```
docker compose up
```

The server starts on port 8108 with the default API key `xyz`. The scoped search key already in [`app/keys.ts`](/frontend/app/keys.ts) was generated from this key, so no configuration is needed to run the frontend locally.

To populate the search index, follow the instructions in the [transcripts readme](/transcripts/README.md).

## Production

The server is intended to run on a VPS behind a reverse proxy (e.g. Nginx, Caddy) that handles HTTPS and TLS certificates. Typesense itself only runs over HTTP on port 8108.

1. In `typesense-server.ini`, replace the `api-key` value with a secure, randomly-generated key. **Do not commit this file with your production key in it.**
2. From this directory, run `docker compose up -d`
3. Configure your reverse proxy to forward HTTPS traffic for your API domain to `http://localhost:8108`.

## Scoped search API key

To prevent users from running arbitrary queries against the search database, the frontend uses a read-only scoped search key (not the server API key directly).

For **development**, the key already in [`app/keys.ts`](/frontend/app/keys.ts) was generated from the default `xyz` key and works out of the box.

For **production**, you'll need to generate your own:

1. Create a read-only key scoped to the "transcripts" collection using your server API key: [see Typesense docs](https://typesense.org/docs/0.25.1/api/api-keys.html#create-an-api-key).
2. From this directory, run `API_KEY=<read-only key> ./generate_scoped_search_key.sh`.
3. In [`app/keys.ts`](/frontend/app/keys.ts), replace `TYPESENSE.PROD` with the scoped key from the previous step.
