# Droplet Take Home Code Test

This is the repo for the Droplet take home test for David Witt

Please see `./requirements/INTERSECTION.md` for details.

## Setup

This app uses the [Epic Stack](https://github.com/epicweb-dev/epic-stack/tree/main), making the setup and scaffolding much easier, even if it includes some tools not necessary for this project.

Create a `.env` file in the root of this project and paste in:

```
LITEFS_DIR="/litefs/data"
DATABASE_PATH="./prisma/data.db"
DATABASE_URL="file:./data.db?connection_limit=1"
CACHE_DATABASE_PATH="./other/cache.db"
SESSION_SECRET="6930c6b9f343d3220f84490280494b54"
HONEYPOT_SECRET="super-duper-s3cret"
INTERNAL_COMMAND_TOKEN="2dfcb613f07e62ddde397f7f74a7db10"
RESEND_API_KEY="re_blAh_blaHBlaHblahBLAhBlAh"
SENTRY_DSN="your-dsn"

# the mocks and some code rely on these two being prefixed with "MOCK_"
# if they aren't then the real github api will be attempted
GITHUB_CLIENT_ID="MOCK_GITHUB_CLIENT_ID"
GITHUB_CLIENT_SECRET="MOCK_GITHUB_CLIENT_SECRET"
GITHUB_TOKEN="MOCK_GITHUB_TOKEN"
```
These are the default values, and you won't need to change them for a locally run app.


```bash
npm install
npm run setup
```

## Run the App

```bash
npm run dev
```

Visit [localhost:3000](http://localhost:3000)