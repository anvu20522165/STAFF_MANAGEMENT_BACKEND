const Hardware = require('../models/Hardware');

exports.addHardware = async (req, res) => {
  try {
    const { deviceName, description, NumberOfDevice, mainowner } = req.body;
    const hardware = new Hardware({ deviceName, description, NumberOfDevice, mainowner });
    await hardware.save();
    return res.status(201).json(hardware);
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi khi thêm thiết bị.' });
  }
};

exports.updateHardware = async (req, res) => {
  try {
    const { id } = req.params;
    const { deviceName, description, NumberOfDevice, mainowner } = req.body;
    const hardware = await Hardware.findByIdAndUpdate(id, { deviceName, description, NumberOfDevice, mainowner }, { new: true });
    return res.status(200).json(hardware);
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi khi cập nhật thiết bị.' });
  }
};

exports.deleteHardware = async (req, res) => {
  try {
    const { id } = req.params;
    await Hardware.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Xóa thiết bị thành công.' });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi khi xóa thiết bị.' });
  }
};

exports.getAllHardware = async (req, res) => {
  try {
    const deviceName = req.query.deviceName || '';
    const mainowner = req.query.mainowner || '';
    const hardware = await Hardware.find(
      {
        "$and": [
          { "deviceName": { $regex: '.*' + deviceName + '.*' } },
          { "mainowner": { $regex: '.*' + mainowner + '.*' } },
        ]
      }
    );
    return res.status(200).json(hardware);
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi khi lấy thiết bị.' });
  }
};
