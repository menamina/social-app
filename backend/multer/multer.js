const multer = require("multer");

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

module.exports = {
  single: upload.single.bind(upload),
  array: upload.array.bind(upload),
  fields: upload.fields.bind(upload),
};
