# personal-shortening
A personal URL shortening service

## How it works
When a request is received it check the URL.

If it the pathname is on `data/urls.json` redirect to the expected URL.

If it's not append the pathname to the `REDIRECT_URL` env variable.

## Add new short URL
Open `data/urls.json` and add a new key whose value is the target URL.