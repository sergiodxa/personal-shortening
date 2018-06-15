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

  fetch("https://analytics.sergiodxa.com", {
    method: "POST",
    body: JSON.stringify({
      action: isLink(pathname) ? "Link Sharing" : "Personal Shortening",
      description: isLink(pathname) ? `Accesssing link ${Location}` : `Redirecting to ${Location} from ${req.url}`,
      source: query.source
    })
  });

  res.writeHead(STATUS, { Location });
  res.end();
}

module.exports = main;
