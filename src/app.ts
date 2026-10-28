import express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./db.js";
import { assignNext } from "./assign.js";

export function createApp() {
  const app = express();
  app.use(express.json());

  // Debug helper: everything that has been assigned so far.
  app.get("/assignments", async (_req, res) => {
    res.json(await collections().assignments.find().toArray());
  });

  // Gives the judge their next project.
  app.post("/assign/:judgeId", async (req, res, next) => {
    try {
      const { judgeId } = req.params;
      if (!(await collections().judges.findOne({ _id: judgeId }))) {
        res.status(404).json({ error: "unknown judge" });
        return;
      }
      const result = await assignNext(judgeId);
      switch (result.kind) {
        case "assigned":
          res.status(201).json(result.assignment);
          return;
        case "judge-busy":
          res.status(409).json({ error: "judge already has an active project" });
          return;
        case "none-available":
          res.status(404).json({ error: "no projects available" });
          return;
      }
    } catch (err) {
      next(err);
    }
  });

  // The judge finishes judging their current project.
  app.post("/assignments/:id/complete", async (req, res, next) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json({ error: "bad id" });
        return;
      }
      const updated = await collections().assignments.findOneAndUpdate(
        { _id: new ObjectId(req.params.id), status: "QUEUED" },
        { $set: { status: "COMPLETED" } },
        { returnDocument: "after" }
      );
      if (!updated) {
        res.status(404).json({ error: "no active assignment with that id" });
        return;
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

  return app;
}
