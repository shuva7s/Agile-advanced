import { Schema, model, models, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  hostedProjects: Types.ObjectId[];
  workingOnProjects: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  photo: { type: String, required: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  hostedProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }], // Use Schema.Types.ObjectId
  workingOnProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }], // Use Schema.Types.ObjectId
});

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
