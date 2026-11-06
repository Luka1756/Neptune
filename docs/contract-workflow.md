# API contract workflow

The dashboard and the backend are developed separately. To keep them in step:

1. The backend publishes its OpenAPI schema into `shared/contract/`.
2. The dashboard generates its TypeScript types from that snapshot.
3. Nobody defines an endpoint, response shape or database model on another
   part's behalf. The dashboard does not guess at endpoints, and it does not
   define database models.
4. When the dashboard needs something the contract does not provide, it is
   added to "Contract requests" below. The backend work responds by publishing
   an updated schema.
5. Until a capability appears in the published contract, the dashboard shows it
   as unavailable. It does not simulate it.

## Contract requests

These describe capabilities the dashboard needs. They are **not** endpoint
definitions. Paths, methods and shapes are the backend's decision.

| # | Capability | Needed for | Status |
|---|-----------|-----------|--------|
| 1 | Identify the current signed-in user, and sign out | Login, shell | Requested |
| 2 | List the servers the user may manage, including whether the bot is present | Server picker | Requested |
| 3 | Server summary | Overview | Requested |
| 4 | Read and update a server's tool category settings | Utilities | Requested |
| 5 | Read and update a server's configuration | Configuration | Requested |
| 6 | Read and update the user's own preferences, including the private reply preference | Personalisation | Requested |
| 7 | A consistent error and validation error format | All forms | Requested |
| 8 | The CSRF scheme for cookie-authenticated writes | All writes | Requested |

## Notes for the backend

- Discord permission bitfields exceed what JavaScript numbers hold exactly.
  Please represent them as strings in the contract.
- Authorisation is decided by the backend on every server-scoped request. The
  dashboard treats a 401 as "sign in" and a 403 as "no access".
- Hosting is undecided, so the cookie and domain strategy, CORS and the OAuth
  redirect URIs are open. Discord requires redirect URIs to match exactly, so
  sign-in will not work on changing preview URLs.
