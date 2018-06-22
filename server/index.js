require("now-env");

const { parse } = require("url");
const { stringify } = require("querystring");
const fetch = require("node-fetch");

if (!process.env.REDIRECT_URL) {
  throw new Error("You must provide the REDIRECT_URL environment variable!");
}

const REDIRECT_URL = process.env.REDIRECT_URL.replace(/\/$/, "") + "/";
const STATUS = parseInt(process.env.STATUS, 10) || 301;

const urls = require("../data/urls.json");

function isLink(pathname) {
  return pathname.indexOf("/link/") === 0;
}

async function main(req, res) {
  let Location;

  const {
    pathname,
    query: { source }
  } = parse(req.url, true);
  const match = urls[req.url];

  if (!match) {
    Location = `${REDIRECT_URL}${req.url.substr(1)}`;
  } else {
    Location = match;
  }

  if (isLink(pathname)) {
    Location = pathname.slice(6);
  }

  const query = isLink(pathname)
    ? stringify({
        v: "1",
        tid: "UA-48432002-3",
        cid: req.headers["x-forwarded-for"].split(".").join(""),
        uip: req.headers["x-forwarded-for"],
        ua: req.headers["user-agent"],
        t: "event",
        ec: "Link Sharing",
        ea: "accessed",
        el: `Accessing link ${Location}`,
        cn: source
      })
    : stringify({
        v: "1",
        tid: "UA-48432002-3",
        cid: req.headers["x-forwarded-for"].split(".").join(""),
        uip: req.headers["x-forwarded-for"],
        ua: req.headers["user-agent"],
        t: "event",
        ec: "Short URL Redirect",
        ea: "redirected",
        el: `Redirecting to ${Location} from ${req.url}`,
        cn: source
      });
  fetch(`https://www.google-analytics.com/collect?${query}`);

  res.writeHead(STATUS, { Location });
  res.end();
}

module.exports = main;
