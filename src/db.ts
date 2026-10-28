import { MongoClient, ObjectId, type Db } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

export type AssignmentStatus = "QUEUED" | "COMPLETED";

export interface Project {
  _id: string;
  name: string;
}

export interface Judge {
  _id: string;
  name: string;
}

export interface Assignment {
  _id: ObjectId;
  judgeId: string;
  projectId: string;
  status: AssignmentStatus;
  createdAt: Date;
}

let server: MongoMemoryServer | undefined;
let client: MongoClient | undefined;
let db: Db | undefined;

/** Starts an in-memory MongoDB (first run downloads a mongod binary) and connects to it. */
export async function startDb(): Promise<Db> {
  server = await MongoMemoryServer.create();
  client = await MongoClient.connect(server.getUri());
  db = client.db("expo");
  return db;
}

export async function stopDb(): Promise<void> {
  await client?.close();
  await server?.stop();
  client = server = db = undefined;
}

export function collections() {
  if (!db) throw new Error("db not started");
  return {
    projects: db.collection<Project>("projects"),
    judges: db.collection<Judge>("judges"),
    assignments: db.collection<Assignment>("assignments"),
  };
}

/** Resets the data to 10 projects (p1-p10), 12 judges (j1-j12) and no assignments. */
export async function seed(): Promise<void> {
  const { projects, judges, assignments } = collections();
  await Promise.all([projects.deleteMany({}), judges.deleteMany({}), assignments.deleteMany({})]);
  await projects.insertMany(
    Array.from({ length: 10 }, (_, i) => ({ _id: `p${i + 1}`, name: `Project ${i + 1}` }))
  );
  await judges.insertMany(
    Array.from({ length: 12 }, (_, i) => ({ _id: `j${i + 1}`, name: `Judge ${i + 1}` }))
  );
}
