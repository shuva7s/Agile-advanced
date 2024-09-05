import { Schema, model, Document, models, Types } from "mongoose";

export interface ITask {
  _id: Types.ObjectId;
  taskName: string;
  taskDescription: string;
  assignedPeople: Types.ObjectId[];
  isComplete: boolean;
}

const TaskSchema = new Schema<ITask>({
  taskName: { type: String, required: true },
  taskDescription: { type: String, default: "" },
  assignedPeople: [{ type: Schema.Types.ObjectId, ref: "User" }],
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
  designing: [TaskSchema],
  pending_designing: [TaskSchema],
  development: [TaskSchema],
  pending_development: [TaskSchema],
  testing: [TaskSchema],
  pending_testing: [TaskSchema],
  deployment: [TaskSchema],
  pending_deployment: [TaskSchema],
  done: [TaskSchema],

  timeSlice: { type: Number, default: 0 },
  hasStarted: { type: Boolean, default: false },
  hasCompleted: { type: Boolean, default: false },
  dayCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project = models?.Project || model<IProject>("Project", ProjectSchema);

export default Project;
