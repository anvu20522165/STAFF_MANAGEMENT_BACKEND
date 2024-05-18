const Request = require("../models/Request");




const requestController = {

  //GET ALL REQUEST
  getAllRequests: async (req, res) => {
    try {
      let department = req.query.department || '';
      let useriId  = req.query.userid || '';
      if (department === "BAN_GIAM_DOC") {
        department = "";
        const requests = await Request.find({
          "$and": 
          [
          {"department": { $regex: department }},
        ]
        });
        return res.status(200).json(requests); 
      }
      else {
        const requests = await Request.find();
        const results = requests.filter((item) => item.userid.toString() === useriId);
        return res.status(200).json(results); 
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },


  //ADD A NEW REQUEST
  addNewRequest: async (req, res) => {
    try {
      const { title, department, userid } = req.body;
    
      const request = new Request({ title, department, userid});
      await request.save();
      return res.status(201).json(request);
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi khi thêm yêu cầu.' });
    }
  },

  getById: async (req, res) => {
    try {
      const request = await Request.findById(req.params.id);
      if (!request) {
        return res.status(404).json("Can't find request!");
      }
      return res.status(200).json(request);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  declineRequest: async (req, res) => {
    try {
      const request = await Request.findById(req.params.id);
      if (!request) {
        return res.status(404).json("Can't find request!");
      }
      request.isApproved = "Declined"
      await request.save();
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = requestController;
