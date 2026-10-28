import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { createApp } from "../src/app.js";
import { collections, seed, startDb, stopDb } from "../src/db.js";

let server: Server;
let base: string;

before(async () => {
  await startDb();
  server = createApp().listen(0);
  base = `http://localhost:${(server.address() as AddressInfo).port}`;
});

after(async () => {
  server.close();
  await stopDb();
});

beforeEach(seed);

const assign = (judgeId: string) => fetch(`${base}/assign/${judgeId}`, { method: "POST" });
const complete = (id: string) => fetch(`${base}/assignments/${id}/complete`, { method: "POST" });

describe("assign", () => {
  it("gives a judge a QUEUED project", async () => {
    const res = await assign("j1");
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.judgeId, "j1");
    assert.equal(body.status, "QUEUED");
  });

  it("returns 409 while the judge still has an active project", async () => {
    assert.equal((await assign("j1")).status, 201);
    assert.equal((await assign("j1")).status, 409);
  });

  it("does not give a judge the same project twice", async () => {
    const first = await (await assign("j1")).json();
    await complete(first._id);
    const second = await (await assign("j1")).json();
    assert.notEqual(second.projectId, first.projectId);
  });

  it("prefers the project with the fewest completed judgments", async () => {
    for (let i = 1; i <= 9; i++) {
      await collections().assignments.insertOne({
        judgeId: "j2",
        projectId: `p${i}`,
        status: "COMPLETED",
        createdAt: new Date(),
      } as never);
    }
    const body = await (await assign("j1")).json();
    assert.equal(body.projectId, "p10");
  });
});
