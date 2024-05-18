const MultiTask = require("../models/MultiTask");
const Request = require("../models/Request");

const requestController = {
  //GET ALL REQUEST
  getAllMultiTask: async (req, res) => {
    try {
      let finalResults = [];
      let department = req.query.department || "";
      if (department === "BAN_GIAM_DOC") {
        department = "";
      }
      const multiTasks = await MultiTask.find().populate("requestid");
      if (department != "") {
        for (let index = 0; index < multiTasks.length; index++) {
          const results = multiTasks[index].tasks.find((item) => item.department.value === department);
          if (results) {
            finalResults.push(multiTasks[index])
          }
        }
        return  res.status(200).json(finalResults);

      }
      return res.status(200).json(multiTasks);
    } catch (err) {
      return res.status(500).json(err.message);
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

  getByRequestId: async (req, res) => {
    try {
      const requestId = req.params.requestid
      const multiTasks = await MultiTask.find().populate(
        "requestid"
      );;

        const result = multiTasks.find((item) => item.requestid._id.toString() === requestId);
        if (result) {
          return res.status(200).json(result);
        }
        else {
          return res.status(400).json("buồi");

        }
      
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
      console.log(taskid);

      const particularTask = multiTask.tasks.find(
        (item) => item._id.toString() === taskid
      );
      console.log(particularTask);
      if (particularTask) {
        particularTask.status = true;
        let count = 0;
        for (let index = 0; index < multiTask.tasks.length; index++) {
          if (multiTask.tasks[index].status === true) count++;
        }
        if (count == multiTask.tasks.length) {
          multiTask.status = "Đã Hoàn Thành"
        }
        else {
          multiTask.status = count + "/" + multiTask.tasks.length + " hoàn thành";
        }
        await multiTask.save();
        return res.status(200).json(multiTask);
      } else {
        console.log("Fail to find product");
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Lỗi khi cập nhật yêu cầu liên đơn vị." });
    }
  },
};

module.exports = requestController;
