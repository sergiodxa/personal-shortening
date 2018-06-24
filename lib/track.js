const { stringify } = require("querystring");
const fetch = require("node-fetch");

const TRACKING_ID = process.env.TRACKING_ID;

module.exports = ({ req, location, source, isLink }) => {
  if (!TRACKING_ID) return;

  const query = isLink
    ? stringify({
        v: "1",
        tid: TRACKING_ID,
        cid: req.headers["x-forwarded-for"].split(".").join(""),
        uip: req.headers["x-forwarded-for"],
        ua: req.headers["user-agent"],
        t: "event",
        ec: "Link Sharing",
        ea: "accessed",
        el: `Accessing link ${location}`,
        cn: source
      })
    : stringify({
        v: "1",
        tid: TRACKING_ID,
        cid: req.headers["x-forwarded-for"].split(".").join(""),
        uip: req.headers["x-forwarded-for"],
        ua: req.headers["user-agent"],
        t: "event",
        ec: "Short URL Redirect",
        ea: "redirected",
        el: `Redirecting to ${location} from ${req.url}`,
        cn: source
      });

  fetch(`https://www.google-analytics.com/collect?${query}`);
};
