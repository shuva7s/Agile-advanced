"use server";

import { Types } from "mongoose";
import Project, { IProject } from "../database/models/project.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { userInfo } from "./userInfo.action";
import Sprint from "../database/models/sprint.model";

// export async function createProject(projectData: CreateProjectParams) {
//   try {
//     await connectToDatabase();
//     const { userId, userName, userMail } = await userInfo();
//     if (!userId || !userName || !userMail) return { message: "invalid_ids" };
//     const user = await User.findOne({
//       clerkId: userId,
//       username: userName,
//       email: userMail,
//     });
//     if (!user) return { message: "user_not_found" };
//     const newProject = await Project.create(projectData);
//     newProject.hostId = user._id;
//     newProject.members.push(user._id);
//     await newProject.save();
//     user.hostedProjects.push(newProject._id);
//     await user.save();
//     return {
//       message: "success",
//       data: JSON.parse(JSON.stringify(newProject)),
//     };
//   } catch (error) {
//     handleError(error);
//     return { message: "swr" };
//   }
// }

export async function createProject(projectData: CreateProjectParams) {
  try {
    await connectToDatabase();
    const { userId, userName, userMail } = await userInfo();
    if (!userId || !userName || !userMail) return { message: "invalid_ids" };

    // Step 1: Find the user
    const user = await User.findOne({
      clerkId: userId,
      username: userName,
      email: userMail,
    });
    if (!user) return { message: "user_not_found" };

    // Step 2: Start a transaction for consistency
    const session = await Project.startSession();
    session.startTransaction();

    // Step 3: Create the project
    const newProject = await Project.create([projectData], { session });
    newProject[0].hostId = user._id;
    newProject[0].members.push(user._id);

    // Step 4: Create sprints based on totalSprints
    const sprintIds: Types.ObjectId[] = [];
    for (let i = 0; i < newProject[0].totalSprints; i++) {
      const sprint = new Sprint({
        projectRef: newProject[0]._id,
        designing: [],
        development: [],
        testing: [],
        deployment: [],
        done: [],
      });
      await sprint.save({ session });
      sprintIds.push(sprint._id);
    }

    // Step 5: Update the project with sprint references
    newProject[0].sprints = sprintIds;
    await newProject[0].save({ session });

    // Step 6: Update the user with the hosted project
    user.hostedProjects.push(newProject[0]._id);
    await user.save({ session });

    // Step 7: Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      message: "success",
      data: JSON.parse(JSON.stringify(newProject[0])),
    };
  } catch (error) {
    handleError(error);
    return { message: "swr" };
  }
}

export async function checkProjectAccessAndReturnData(project_id: string) {
  try {
    await connectToDatabase();
    const { userId, userName, userMail } = await userInfo();
    if (!userId || !userName || !userMail) return { message: "invalid_ids" };
    const project = await Project.findOne({
      _id: new Types.ObjectId(project_id),
    });
    if (!project) return { message: "not_found" };
    const user = await User.findOne({
      clerkId: userId,
      username: userName,
      email: userMail,
    });
    if (!user) return { message: "user_not_found" };
    if (project.hostId.equals(user._id)) {
      return { message: "host", data: project };
    }
    if (
      project.members.some((memberId: Types.ObjectId) =>
        memberId.equals(user._id)
      )
    ) {
      return { message: "member", data: project };
    }

    return { message: "access_denied" };
  } catch (error) {
    handleError(error);
    return { message: "swr" };
  }
}

export async function getProjects(
  type: "hosted" | "working",
  page: number,
  limit: number
): Promise<{ projects: IProject[]; hasMoreProjects: boolean }> {
  try {
    await connectToDatabase();
    const { userId: clerkId } = await userInfo(); // clerkId is coming from userInfo
    if (!clerkId) throw new Error("User not found");

    // Find the user by their clerkId
    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");

    const offset = (page - 1) * limit;

    let projectsJson: string;
    let totalProjectsCount: number;

    if (type === "hosted") {
      // Fetch hosted projects
      projectsJson = JSON.stringify(
        await Project.find({ hostId: user._id })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean<IProject[]>()
          .exec()
      );

      totalProjectsCount = await Project.countDocuments({
        hostId: user._id,
      });
    } else {
      // Fetch working-on projects, excluding hosted ones
      projectsJson = JSON.stringify(
        await Project.find({
          members: user._id,
          hostId: { $ne: user._id }, // Exclude hosted projects
        })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean<IProject[]>()
          .exec()
      );

      totalProjectsCount = await Project.countDocuments({
        members: user._id,
        hostId: { $ne: user._id }, // Exclude hosted projects
      });
    }

    // Parse JSON string to objects
    const projects: IProject[] = JSON.parse(projectsJson);

    // Determine if there are more projects to load
    const hasMoreProjects = offset + limit < totalProjectsCount;

    return { projects, hasMoreProjects };
  } catch (error) {
    handleError(error);
    return { projects: [], hasMoreProjects: false };
  }
}

