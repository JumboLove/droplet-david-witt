# Droplet Take Home Code Test

This is the repo for the Droplet take home test for David Witt

Please see `./requirements/INTERSECTION.md` for details.

## Setup

This app uses the
[Epic Stack](https://github.com/epicweb-dev/epic-stack/tree/main), making the
setup and scaffolding much easier, even if it includes some tools not necessary
for this project.

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

These are the default values, and you won't need to change them for a locally
run app.

```bash
npm install
npm run setup
```

## Run the App

```bash
npm run dev
```

Visit [localhost:3000](http://localhost:3000)

## Notes on implementation

I tried to keep the app as simple as possible and work within a time constraint.

I opted to create a simulation style game where we'd run a `tick()` command that
would iterate through all the logic and update state for the next step.

I dropped all of the state iteration logic inside a reducer to move it outside
of the main React component.

I initially tried to map my state object -> react components for roads, lanes,
and lights. This turned out fine for a quick and dirty implementation, but I
might opt to adopt something closer to a game engine structure with `Actors`
that can spawn in a `Scene`, take up space in coordinate plane, and trigger
events for queing up the next light cycle. Not really something I want to try in
React in ~4ish hours 🙃

Some items still TODO:

- flashing orange only turns on yellow for now. I added a TODO to check for
  oncoming traffic
- Bug with North/South light change, the left turn lanes turn green instead of
  orange
- Left turn light cycle
- Pedestrian crossing/scramble cycle

Ragrets:

- Rather than a simple count in each lane, I would have created a random ID
  string and pushed it into a queue. I'd be able to spawn it outside the display
  grid and animate it for each tick.

- Not setting up a simple priorty queue from the start. I started with a few
  simple `if..else` and `switch` blocks, but ultimately realized I'd run out of
  time trying to do this for all scenarios.

- When spawning cars into a lane with a green light, it never shows. This is an
  unfortunate result of using simple number values rather that mimicing a car
  queuing in an intersection.

- Not setting up a data object for "in intersection". It might have helped with
  the visual display of cars moving through the light
