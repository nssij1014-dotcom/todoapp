import mongoose, { Schema, model, models } from "mongoose";

const GoalSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

export default models.Goal || model("Goal", GoalSchema);
export type GoalDocument = mongoose.InferSchemaType<typeof GoalSchema>;
