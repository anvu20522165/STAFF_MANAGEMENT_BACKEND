const Request = require("../models/Request");




const requestController = {

  //GET ALL REQUEST
  getAllRequests: async (req, res) => {
    try {
      const requests = await Request.find();

      res.status(200).json(requests);
    } catch (err) {
      res.status(500).json(err);
    }
  },


  //ADD A NEW REQUEST
  addNewRequest: async (req, res) => {
    try {
      const { title } = req.body;
      const createdDate = new Date();
      const request = new Request({ title, createdDate});
      await request.save();
      return res.status(201).json(request);
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi khi thêm yêu cầu.' });
    }
  },
};

module.exports = requestController;
