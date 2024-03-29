import mongoose from "mongoose";

const waveSchema = new mongoose.Schema({
  text: { type: String, require: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wave",
    },
  ],
});

const Wave = mongoose.models.Wave || mongoose.model("Wave", waveSchema);

export default Wave;
