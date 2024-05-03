const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    nameDocument: {
      type: String,
      required: true,
    },
    Source: {
      type: String,
      required:true,
    },
    NumberOfDocument: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("document", documentSchema);
