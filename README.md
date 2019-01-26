# personal-shortening

[![Build Status](https://travis-ci.org/sergiodxa/personal-shortening.svg?branch=master)](https://travis-ci.org/sergiodxa/personal-shortening)

A personal URL shortening service

<a href="https://www.patreon.com/sergiodxa">
	<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## How it works

When a request is received it check the URL.

If it the pathname is on `data/urls.json` redirect to the expected URL.

If it's not append the pathname to the `REDIRECT_URL` env variable.

## Add new short URL

Open `data/urls.json` and add a new key whose value is the target URL.
