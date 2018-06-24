// modules
require("now-env");
const { parse } = require("url");
const { isURL } = require("validator");

// lis
const track = require("../lib/track");

// checks
if (!process.env.REDIRECT_URL) {
  throw new Error("You must provide the REDIRECT_URL environment variable!");
}

// constantes
const REDIRECT_URL = process.env.REDIRECT_URL.replace(/\/$/, "") + "/";
const STATUS = parseInt(process.env.STATUS, 10) || 301;

// map of shortened URLs
const urls = require("../data/urls.json");

// isURL custom config
const urlConfig = {
  protocols: ["http", "https"],
  require_protocol: true,
  require_host: true,
  require_valid_protocol: true
};

// check if a function is a link
function isLink(pathname) {
  return pathname.indexOf("/link/") === 0;
}

async function main(req, res) {
  let location;

  const {
    pathname,
    query: { source }
  } = parse(req.url, true);

  const match = urls[req.url];

  if (!match) {
    location = `${REDIRECT_URL}${req.url.substr(1)}`;
  } else {
    location = match;
  }

  if (isLink(pathname)) {
    location = pathname.slice(6);
  }

  // if the location is not a valid URL fallback to REDIRECT_URL
  if (!isURL(location, urlConfig)) {
    location = REDIRECT_URL;
  }

  track({ req, isLink: isLink(pathname), source, location });

  res.writeHead(STATUS, { Location: location });
  res.end();
}

module.exports = main;
