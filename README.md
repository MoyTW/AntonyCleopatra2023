# Setup Instructions

1. Set up a dev server (see [the server repo](https://github.com/MoyTW/MultiplayerTwineServer) for details) and run it locally.
2. Clone this repository.
3. Modify the package.json file and fill in the TODO fields. Change the license if desired.
4. Run `npm install`.

# Deployment

1. Change the `PROD_SERVER_URL` in `websockets.ts` to your production URL.
2. Change the `DEBUG` value in `websockets.ts` to `false`.

# TODO List

1. Make a script to compile for production.
2. Pull the `PROD_SERVER_URL` out of `websockets.ts`.
