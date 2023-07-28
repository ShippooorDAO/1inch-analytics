# 1Inch Analytics Webapp
An open source webapp for 1inch analytics

- NextJS React Framework
- Emotion
- Material UI

## How to use

Node.js 16+ and npm are required
Run the following command to install dependencies:

```shell
cp .env.example .env.local
yarn install
```

## Running
### Development

```shell
yarn dev
```

Open http://localhost:3000

## Production
```shell
yarn build
npm run
```

## Regenerate GQL interfaces
The following command auto-generates code contained within `src/gql` sub-directory and `1inch-api-prod.graphql` file.

```shell
yarn schema
```

## Checks
To run the linter, run this command:

```shell
yarn lint
```

## Auto-fix
To automatically fix lint errors, run this command:

```shell
yarn fix
```

## Feature Flags
Feature flags are useful to control the set of features that is shown to the user. To enable all of them, use the append `e=1` to url query params (i.e `https://info.1inch.io/?e=1`)

To disable them, use the menu on the bottom-right of the screen and click "Reset to Prod-like". This will revert to default settings as defined in `.env*` file.


