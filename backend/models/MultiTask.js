const mongoose = require("mongoose");

const multiTaskSchema = new mongoose.Schema(
  {

    requestid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",       
    },
    tasks: [
      {
        department: 
          {
          value: String,         
          label: String,       
        },
        name: {
          type: String,
        },
        status: {
          type: Boolean,
          default: false,
        },     
      }
    ],
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MultiTask", multiTaskSchema);
