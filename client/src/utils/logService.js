export async function Log(stack, level, pkg, message) {
  const validStacks = ["frontend"];
  const validLevels = ["debug", "info", "warn", "error", "fatal"];
  const validPackages = ["api", "component", "hook", "page", "state", "style", "auth", "config", "middleware", "utils"];

  stack = stack.toLowerCase();
  level = level.toLowerCase();
  pkg = pkg.toLowerCase();
  
  if (!validStacks.includes(stack)) throw new Error("Invalid stack");
  if (!validLevels.includes(level)) throw new Error("Invalid level");
  if (!validPackages.includes(pkg)) throw new Error("Invalid package for frontend");
  const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaGFuYXdhei5tb2hkLmtAZ21haWwuY29tIiwiZXhwIjoxNzUzNjgzMDQ0LCJpYXQiOjE3NTM2ODIxNDQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIyYmRkMjM3Ni02OGJhLTQ1ZGQtOGE5NC02MDc4YTUyZjlhMjciLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrYXRpa2EgbW9oYW1tZWQgc2hhbmF3YXoiLCJzdWIiOiIyYTA1ODM0My1hMzY2LTQ3MjYtYmVhZi0yMTc0YmRmYzdhZjcifSwiZW1haWwiOiJzaGFuYXdhei5tb2hkLmtAZ21haWwuY29tIiwibmFtZSI6ImthdGlrYSBtb2hhbW1lZCBzaGFuYXdheiIsInJvbGxObyI6IjIyODgxYTA1ZjgiLCJhY2Nlc3NDb2RlIjoid1BFZkdaIiwiY2xpZW50SUQiOiIyYTA1ODM0My1hMzY2LTQ3MjYtYmVhZi0yMTc0YmRmYzdhZjciLCJjbGllbnRTZWNyZXQiOiJHemJkY01KSlZ1UUZoZnBLIn0.m9tPGCDc4j5SSmjFyGDwv6530bW6Fjxonhhu6-LZovM"
  try {
    await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stack, level, package: pkg, message }),
      Authorization: 'Bearer ${access_token}'
    });
  } catch (err) {
    console.error("Logging failed (frontend):", err);
  }
}
