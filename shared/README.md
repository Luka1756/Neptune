# shared

Material that more than one part of the monorepo depends on.

Currently this holds only:

- `contract/`: a snapshot of the backend's OpenAPI schema. The backend publishes
  it; the dashboard reads it. See [`../docs/contract-workflow.md`](../docs/contract-workflow.md).

Nothing else lives here yet. In particular, no shared Python package has been
created. The structure of any shared code (for example data models used by both
the bot and the backend) is still to be agreed with the backend work, and its
deployment compatibility with the bot's host must be verified first.
