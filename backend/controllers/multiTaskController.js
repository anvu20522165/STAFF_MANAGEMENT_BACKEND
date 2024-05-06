const MultiTask = require("../models/MultiTask");
const Request = require("../models/Request");

const requestController = {
  //GET ALL REQUEST
  getAllMultiTask: async (req, res) => {
    try {
      const multiTasks = await MultiTask.find().populate("requestid");

      res.status(200).json(multiTasks);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getById: async (req, res) => {
    try {
      const multiTask = await MultiTask.findById(req.params.id).populate(
        "requestid"
      );
      if (!multiTask) {
        return res.status(404).json("Can't find multiTask!");
      }

      return res.status(200).json(multiTask);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  //ADD A NEW REQUEST
  addNewMultiTask: async (req, res) => {
    try {
      const { requestid, tasks } = req.body;
      const multiTask = new MultiTask({ requestid, tasks });
      multiTask.status = "0/" + multiTask.tasks.length + " hoàn thành";
      await multiTask.save();
      const request = await Request.findById(requestid);
      request.isApproved = "Approved";
      await request.save();
      return res.status(201).json(multiTask);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi khi thêm yêu cầu liên đơn vị." });
    }
  },

  updateDeparmentStatus: async (req, res) => {
    try {
      const multiTask = await MultiTask.findById(req.params.id);
      const { taskid } = req.body;
      console.log(taskid)

      const particularTask = multiTask.tasks.find(
        (item) => item._id.toString() === taskid
      );
      console.log(particularTask)
      if (particularTask) {
        particularTask.status = true;
        let count = 0
        for (let index = 0; index < multiTask.tasks.length; index++) {
          if (multiTask.tasks[index].status === true)
          count++;
        }
        multiTask.status = count + "/" + multiTask.tasks.length + " hoàn thành";
        await multiTask.save()
        return res.status(200).json(multiTask);
      }
      else {
        console.log("Fail to find product")
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi khi cập nhật yêu cầu liên đơn vị." });
    }
  },
};

module.exports = requestController;
