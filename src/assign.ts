import { MongoServerError, ObjectId } from "mongodb";
import { collections, type Assignment } from "./db.js";

export type AssignResult =
  | { kind: "assigned"; assignment: Assignment }
  | { kind: "judge-busy" } // the judge already holds a QUEUED assignment
  | { kind: "none-available" }; // no project is eligible for this judge right now

export async function assignNext(judgeId: string): Promise<AssignResult> {
  const { projects, assignments } = collections();

  while (true) {
    
    if (await assignments.findOne({ judgeId, status: "QUEUED" })) return { kind: "judge-busy" };

    const seen = await assignments.distinct("projectId", { judgeId });
    const queued = await assignments.distinct("projectId", { status: "QUEUED" });
    const open = await projects.distinct("_id", { _id: { $nin: [...seen, ...queued] } });

    if (open.length === 0) return { kind: "none-available" };

    const counts = await assignments
      .aggregate<{ _id: string; n: number }>([
        { $match: { status: "COMPLETED", projectId: { $in: open } } },
        { $group: { _id: "$projectId", n: { $sum: 1 } } },
      ])
      .toArray();

    const done = new Map(counts.map((c) => [c._id, c.n]));
    const fewest = Math.min(...open.map((p) => done.get(p) ?? 0));
    const tied = open.filter((p) => (done.get(p) ?? 0) === fewest);

    const assignment: Assignment = {
      _id: new ObjectId(),
      judgeId,
      projectId: tied[Math.floor(Math.random() * tied.length)],
      status: "QUEUED",
      createdAt: new Date(),
    };

    try {

      await assignments.insertOne(assignment);
      return { kind: "assigned", assignment };

    } catch (err) {

      if (!(err instanceof MongoServerError && err.code === 11000)) throw err;

    }
  }
}
