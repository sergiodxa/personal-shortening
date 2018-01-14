require("now-env");

if (!process.env.REDIRECT_URL) {
  throw new Error("You must provide the REDIRECT_URL environment variable!");
}

const REDIRECT_URL = process.env.REDIRECT_URL.replace(/\/$/, "") + "/";
const STATUS = parseInt(process.env.STATUS, 10) || 301;

const urls = require("../data/urls.json");

async function main(req, res) {
  let Location;

  const match = urls[req.url];

  if (!match) {
    Location = `${REDIRECT_URL}${req.url.substr(1)}`;
  } else {
    Location = match;
  }

  res.writeHead(STATUS, { Location });
  res.end();
}

module.exports = main;
