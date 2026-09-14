import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    githubId: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
export type UserDocument = mongoose.InferSchemaType<typeof UserSchema>;
