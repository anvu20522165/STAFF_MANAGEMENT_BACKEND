const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const hardwareController = require('../controllers/hardwareController');
const { verifyToken } = require('../controllers/verifyToken');

const checkAccess = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    const userPosition = decoded.position;
    const userDepartment = decoded.department;
  
    if (userPosition === 'TRUONG_PHONG' && userDepartment === 'PHONG_KY_THUAT') {
      next();
    } else {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập.' });
    }
};

router.post('/add-hardware', checkAccess, hardwareController.addHardware);
router.put('/update-hardware/:id', checkAccess, hardwareController.updateHardware);
router.delete('/delete-hardware/:id', checkAccess, hardwareController.deleteHardware);
router.get('/get-all-hardware', verifyToken, hardwareController.getAllHardware);

module.exports = router;
