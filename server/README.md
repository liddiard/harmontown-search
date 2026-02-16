# Search engine server

[Typesense](https://typesense.org/) powers the episode transcript search. To run this server locally:

1. [Install Docker](https://docs.docker.com/get-started/get-docker/)
2. In this directory, run `docker compose -f docker-compose.dev.yml up`

To populate the search index, follow the instructions in the [transcripts readme](/transcripts/README.md).

## Scoped search API key

To prevent users from running arbitrary queries against the search database, you must create a key with read-only access to the "transcripts" collection ([docs](https://typesense.org/docs/0.25.1/api/api-keys.html#create-an-api-key)). For development, you can use the scoped search key already in the repo generated from the default password "xyz".

For production, you'll need to create your own private server API key (which has unrestricted API access), and create your own public search API key (which is read-only and only allows running a specific query). To do this:

1. Create a key with read-only access to the "transcripts" collection: [see docs](https://typesense.org/docs/0.25.1/api/api-keys.html#create-an-api-key).
2. From this directory, run `API_KEY=<read-only key> ./generate_scoped_search_key.sh`, replacing `<read-only key>` with the key created in the previous step.
3. In [`app/keys.ts`](/frontend/app/types.ts), replace the `TYPESENSE.PROD` value with the "scoped" key generated in the previous step.
