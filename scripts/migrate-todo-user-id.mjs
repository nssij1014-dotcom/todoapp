import mongoose from "mongoose";

function parseUserId(argv) {
  const arg = argv.find((a) => a.startsWith("--user-id="));
  if (!arg) return null;
  const value = arg.slice("--user-id=".length);
  if (!/^[0-9a-fA-F]{24}$/.test(value)) return null;
  return value;
}

async function main() {
  const userId = parseUserId(process.argv.slice(2));
  if (!userId) {
    console.error(
      "Usage: node --env-file=.env.local scripts/migrate-todo-user-id.mjs --user-id=<24-hex-char MongoDB ObjectId>"
    );
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI environment variable.");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const Todo = mongoose.model("Todo", new mongoose.Schema({}, { strict: false }), "todos");

  const result = await Todo.updateMany(
    { userId: { $exists: false } },
    { $set: { userId: new mongoose.Types.ObjectId(userId) } }
  );

  console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
