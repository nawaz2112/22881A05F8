// server/utils/logService.js
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function Log(stack, level, pkg, message) {
  const validStacks = ["backend"];
  const validLevels = ["debug", "info", "warn", "error", "fatal"];
  const validPackages = [
    "cache", "controller", "cron_job", "db", "domain",
    "handler", "repository", "route", "service", "auth",
    "config", "middleware", "utils"
  ];

  stack = stack.toLowerCase();
  level = level.toLowerCase();
  pkg = pkg.toLowerCase();

  if (!validStacks.includes(stack)) throw new Error(`Invalid stack: ${stack}`);
  if (!validLevels.includes(level)) throw new Error(`Invalid level: ${level}`);
  if (!validPackages.includes(pkg)) throw new Error(`Invalid package: ${pkg}`);

  const access_token = process.env.ACCESS_TOKEN;
  if (!access_token) throw new Error("Access token is missing from environment variables");

  try {
    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });

    const result = await response.json();
    console.log("Log sent:", result);
    return result;
  } catch (err) {
    console.error("Logging failed:", err.message);
    return null;
  }
}

module.exports = { Log };
