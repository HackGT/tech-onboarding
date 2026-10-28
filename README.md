# Judge assignment exercise

A tiny API that hands out projects to judges at a hackathon expo. Implement one function.

## Run it

```bash
npm install
npm start      # API on http://localhost:3000
npm test       # run the tests
```

Needs Node 20+. There is nothing else to install: MongoDB runs in memory and is seeded on start.
The first run downloads a MongoDB binary (~200MB), so it can take a minute.

## The data

10 projects (`p1`-`p10`), 12 judges (`j1`-`j12`), and assignments. An assignment links a judge to a
project and is either `QUEUED` (the judge is judging it now) or `COMPLETED`.

## Your task

Implement `assignNext(judgeId)` in `src/assign.ts`. It backs `POST /assign/:judgeId`.

1. A judge never gets a project they have been assigned before (any status).
2. A project that another judge currently has `QUEUED` is not available.
3. Among the projects that are available, pick one with the fewest `COMPLETED` assignments.
   Break ties randomly.
4. A judge can hold only one `QUEUED` assignment at a time. If they already have one, return `judge-busy`.
5. If nothing is available, return `none-available`.

The routes in `src/app.ts` already map those results to HTTP codes. Make `npm test` pass. Tests are not comprehensive.
Change whatever you need, but keep the `assignNext(judgeId)` signature and the seed data.
