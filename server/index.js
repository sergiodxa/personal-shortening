require("now-env");

const { parse } = require("url");
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

  const { pathname, query } = parse(req.url, true);
  const match = urls[req.url];

  if (!match) {
    Location = `${REDIRECT_URL}${req.url.substr(1)}`;
  } else {
    Location = match;
  }
  
  if (isLink(pathname)) {
    Location = pathname.slice(6);
  }

  const options = { method: "POST" };

  if (isLink(pathname)) {
    Object.assign(options, {
      headers: {
        "x-forwarded-for": req.headers["x-forwarded-for"],
      },
      body: JSON.stringify({
        action: "Link Sharing",
        description: `Accessing link ${Location}`,
        source: query.source,
      })
    })
  } else {
    Object.assign(options, {
      body: JSON.stringify({
        action: "Personal Shortening",
        description: `Redirecting to ${Location} from ${req.url}`,
        source: query.source
      })
    })
  }

  fetch("https://analytics.sergiodxa.com", options);

  res.writeHead(STATUS, { Location });
  res.end();
}

module.exports = main;
