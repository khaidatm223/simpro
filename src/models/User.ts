// src/models/User.ts
import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  role: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
