const mongoose = require("mongoose");

const multiTaskSchema = new mongoose.Schema(
  {

    requestid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",       
    },
    tasks: [
      {
        department: {
          type: String,
        },
        title: {
          type: String,
        },
        status: {
          type: Boolean,
          default: false,
        },     
      }
    ],
    status: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MultiTask", multiTaskSchema);
