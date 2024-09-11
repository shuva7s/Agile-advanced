import { model, models, Schema } from "mongoose";
import { TaskSchema } from "./project.model";

const SprintSchema = new Schema({
  projectRef: { type: Schema.Types.ObjectId, ref: "Project" },
  designing: [TaskSchema],
  development: [TaskSchema],
  testing: [TaskSchema],
  deployment: [TaskSchema],
  done: [TaskSchema],
});

const Sprint = models?.Sprint || model("Sprint", SprintSchema);

export default Sprint;
