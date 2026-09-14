import mongoose, { Schema, model, models } from "mongoose";

const SessionSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default models.Session || model("Session", SessionSchema);
export type SessionDocument = mongoose.InferSchemaType<typeof SessionSchema>;
