import { collections, type Assignment } from "./db.js";

export type AssignResult =
  | { kind: "assigned"; assignment: Assignment }
  | { kind: "judge-busy" } // the judge already holds a QUEUED assignment
  | { kind: "none-available" }; // no project is eligible for this judge right now

/**
 * TODO: implement. See the README for the rules.
 *
 * `judgeId` is already validated to exist by the route. Use `collections()` from ./db.js.
 * Add any helpers you need.
 */


export async function assignNext(judgeId: string): Promise<AssignResult> {
  
  // get assignments
  const assi = collections().assignments;

  // check if judge is busy
  const existingAssignment = await assi.findOne({
    judgeId,
    status: "QUEUED",
  });

  if (existingAssignment) {
    return { kind: "judge-busy" };
  }

  // find prev assignments
  const prevAssi = await assi
    .find({ judgeId })
    .toArray();

  // get proj IDs
  const previouslyAssignedProjectIds = prevAssi.map(
    (assi) => assi.projectId
  );

  // proj assigned to other projects
  const queuedAssignments = await assi
    .find({
      status: "QUEUED",
      judgeId: { $ne: judgeId },
    })
    .toArray();

  // unavil proj IDs
  const unavailableProjectIds = queuedAssignments.map(
    (assignment) => assignment.projectId
  );

  const unavailableIds = [
    ...previouslyAssignedProjectIds,
    ...unavailableProjectIds,
  ];

  // avail proj
  const availableProjects = await collections().projects
    .find({
      _id: { $nin: unavailableIds },
    })
    .toArray();

  if (availableProjects.length === 0) {
    return { kind: "none-available" };
  }

  // count completed assignments
  const completedCounts = await assi
    .aggregate([
      {
        $match: {
          status: "COMPLETED",
        },
      },
      {
        $group: {
          _id: "$projectId",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  // join each proj with count of completed
  const projectCounts = availableProjects.map((project) => {
    const completed = completedCounts.find(
      (item) => item._id === project._id
    );

    return {
      project,
      count: completed ? completed.count : 0,
    };
  });

  // find min
  const minimumCount = Math.min(
    ...projectCounts.map((item) => item.count)
  );

  // filter proj w min
  const candidates = projectCounts.filter(
    (item) => item.count === minimumCount
  );

  // random selection
  const selectedProject =
    candidates[Math.floor(Math.random() * candidates.length)].project;

  // create assignment
  const newAssignment = {
    judgeId,
    projectId: selectedProject._id,
    status: "QUEUED" as const,
    createdAt: new Date(),
  };

  // return
  await assi.insertOne(newAssignment);

  return {
    kind: "assigned",
    assignment: newAssignment as Assignment,
  };
}
