const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    nameAnnouncement: {
      type: String,
      required: true,
    },
    startAt: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    meeting: {
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
