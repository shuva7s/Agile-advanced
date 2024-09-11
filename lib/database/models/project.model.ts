import { Schema, model, Document, models, Types, SchemaType } from "mongoose";

export interface ITask {
  _id: Types.ObjectId;
  taskName: string;
  taskDescription: string;
  assignedPeople: Types.ObjectId[];
  currentStage:
    | "requirements"
    | "designing"
    | "development"
    | "testing"
    | "deployment"
    | "done";

  designingMembers: Types.ObjectId[];
  timeTakenByDesigning: number;

  developmentMembers: Types.ObjectId[];
  timeTakenByDevelopment: number;

  testingMembers: Types.ObjectId[];
  timetakenByTesting: number;

  deploymentMembers: Types.ObjectId[];
  timeTakenByDeployment: number;

  isComplete: boolean;
}

export const TaskSchema = new Schema<ITask>({
  taskName: { type: String, required: true },
  taskDescription: { type: String, default: "" },
  assignedPeople: [{ type: Schema.Types.ObjectId, ref: "User" }],
  currentStage: {
    type: String,
    enum: [
      "requirements",
      "designing",
      "development",
      "testing",
      "deployment",
      "done",
    ],
    default: "requirements",
  },
  designingMembers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  timeTakenByDesigning: { type: Number, default: 0 },
  developmentMembers: [
    { type: Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  timeTakenByDevelopment: { type: Number, default: 0 },
  testingMembers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  timetakenByTesting: { type: Number, default: 0 },
  deploymentMembers: [
    { type: Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  timeTakenByDeployment: { type: Number, default: 0 },
  isComplete: { type: Boolean, default: false },
});

export interface IProject extends Document {
  _id: Types.ObjectId;
  hostId: Types.ObjectId;

  projectName: string;
  projectDescription: string;

  members: Types.ObjectId[];
  joinRequests: Types.ObjectId[];

  requirements: ITask[];
  designing: ITask[];
  pending_designing: ITask[];
  development: ITask[];
  pending_development: ITask[];
  testing: ITask[];
  pending_testing: ITask[];
  deployment: ITask[];
  pending_deployment: ITask[];
  done: ITask[];

  totalSprints: number;
  currentSprint: number;
  sprints: Types.ObjectId[];

  allowMembersToJoinTask: boolean;

  timeSlice: number;
  hasStarted: boolean;
  hasCompleted: boolean;
  dayCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  hostId: { type: Schema.Types.ObjectId, ref: "User" },

  projectName: { type: String, required: true },
  projectDescription: { type: String, default: "" },

  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  joinRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],

  requirements: [TaskSchema],

  totalSprints: { type: Number, default: 1 },
  currentSprint: { type: Number, default: 0 },
  sprints: [{ type: Schema.Types.ObjectId, ref: "Sprint" }],

  allowMembersToJoinTask: { type: Boolean, default: true },

  timeSlice: { type: Number, default: 0 },
  hasStarted: { type: Boolean, default: false },
  hasCompleted: { type: Boolean, default: false },
  dayCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project = models?.Project || model<IProject>("Project", ProjectSchema);

export default Project;
