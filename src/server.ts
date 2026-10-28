import { createApp } from "./app.js";
import { seed, startDb, stopDb } from "./db.js";

console.log("Starting in-memory MongoDB (the first run downloads a binary, ~200MB)...");
await startDb();
await seed();

const port = Number(process.env.PORT ?? 3000);
const server = createApp().listen(port, () => {
  console.log(`\nListening on http://localhost:${port}  (projects p1-p10, judges j1-j12)`);
  console.log(`  curl -X POST localhost:${port}/assign/j1`);
  console.log(`  curl localhost:${port}/assignments\n`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    server.close();
    await stopDb();
    process.exit(0);
  });
}
