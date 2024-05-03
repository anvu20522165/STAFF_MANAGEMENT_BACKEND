const MultiTask = require("../models/MultiTask");




const requestController = {

  //GET ALL REQUEST
  getAllMultiTask: async (req, res) => {
    try {
      const multiTasks = await MultiTask.find().populate('requestid');

      res.status(200).json(multiTasks);
    } catch (err) {
      res.status(500).json(err);
    }
  },


  //ADD A NEW REQUEST
  addNewMultiTask: async (req, res) => {
    try {
      const { requestid, tasks } = req.body;
      const multiTask = new MultiTask({ requestid, tasks});
      multiTask.status = '0/' + multiTask.tasks.length + ' hoàn thành'
      await multiTask.save();
      return res.status(201).json(multiTask);
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi khi thêm yêu cầu liên đơn vị.' });
    }
  },
};

module.exports = requestController;
