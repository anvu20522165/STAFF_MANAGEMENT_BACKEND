const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    nameAnnoucement: {
      type: String,
      required: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
    },
    listEmployee: [
      {
        type: String,
      },
    ],
    department: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("announcement", announcementSchema);
