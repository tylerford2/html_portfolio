const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const photos = [];
const PASSWORD = process.env.PASSWORD || 'superstar';

app.post('/upload', upload.single('photo'), (req, res) => {
  const { password, caption } = req.body;
  if (password !== PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const newPhoto = {
    filename: req.file.filename,
    caption: caption || ''
  };
  photos.push(newPhoto);
  res.json({ message: 'Photo uploaded successfully', photo: newPhoto });
});

app.get('/photos', (req, res) => {
  res.json(photos);
});

app.delete('/delete', (req, res) => {
  const { password, filename } = req.body;

  if (password !== PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const photoIndex = photos.findIndex(p => p.filename === filename);
  if (photoIndex === -1) {
    return res.status(404).json({ error: 'Photo not found' });
  }

  const filePath = path.join(__dirname, 'uploads', filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete file' });
    }

    photos.splice(photoIndex, 1);
    res.json({ message: 'Photo deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
