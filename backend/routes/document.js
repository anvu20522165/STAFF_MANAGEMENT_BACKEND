const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const documentController = require('../controllers/documentController');
const { verifyToken } = require('../controllers/verifyToken');

const checkAccess = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    const userPosition = decoded.position;
    const userDepartment = decoded.department;
  
    if (userPosition === 'TRUONG_PHONG' && userDepartment === 'PHONG_NHAN_SU') {
      next();
    } else {
        return res.status(403).json({ message: 'Bạn không có quyền truy cập.' });
    }
  };

router.post('/add-document', checkAccess, documentController.addDocument);
router.put('/update-document/:id', checkAccess, documentController.updateDocument);
router.delete('/delete-document/:id', checkAccess, documentController.deleteDocument);
router.get('/get-all-documents',verifyToken, documentController.getAllDocuments);

module.exports = router;
