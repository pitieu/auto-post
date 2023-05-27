# Auto-Post

This is a work in progress.

Auto generate video and post them on youtube and other social platforms.

## Get started

### Install dependencies

```console
yarn install
```

### Setup environment variables

Create `.env` file, with your [Product Hunt](https://api.producthunt.com/v2/docs) & [Twitter](https://developer.twitter.com/en/docs/twitter-api) API key

```env
REACT_APP_PRODUCT_HUNT_API_KEY="<your-key>"
TWITTER_CONSUMER_KEY="<your-key>"
TWITTER_CONSUMER_SECRET="<your-key>"
TWITTER_ACCESS_TOKEN_KEY="<your-key>"
TWITTER_ACCESS_TOKEN_SECRET="<your-key>"
```

### Start preview

This will open browser to preview video

```console
yarn start
```

### Render video

This will store generated video in `<ProjectRoot>/out/video.mp4`

```console
yarn build
```
