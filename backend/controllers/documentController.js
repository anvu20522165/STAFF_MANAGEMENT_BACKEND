const Document = require('../models/Document');

exports.addDocument = async (req, res) => {
  try {
    const { nameDocument, Source, NumberOfDocument } = req.body;
    const document = new Document({ nameDocument, Source, NumberOfDocument });
    await document.save();
    return res.status(201).json(document);
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi khi thêm tài liệu.' });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { nameDocument, Source, NumberOfDocument } = req.body;
    const document = await Document.findByIdAndUpdate(id, { nameDocument, Source, NumberOfDocument }, { new: true });
    return res.status(200).json(document);
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi khi cập nhật tài liệu.' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await Document.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Xóa tài liệu thành công.' });
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi khi xóa tài liệu.' });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const nameDocument = req.query.nameDocument || '';
    const Source = req.query.Source || '';
    const documents = await Document.find(
      {
        "$and": [
          { "nameDocument": { $regex: '.*' + nameDocument + '.*' } },
          { "Source": { $regex: '.*' + Source + '.*' } },
        ]
      }
    );
    return res.status(200).json(documents);
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi khi lấy tài liệu.' });
  }
};
