const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const methodOverride = require('method-override');

const upload = multer({ dest: 'uploads/' });

router.use(methodOverride('_method'));

router.post('/api/posts', upload.single('media'), (req, res) => {
  const { title, content } = req.body;
  const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/posts.json')));
  const newPost = { id: Date.now().toString(), title, content };
  if (req.file) {
    const mediaPath = `/uploads/${req.file.filename}`;
    if (req.file.mimetype.startsWith('image/')) {
      newPost.imageUrl = mediaPath;
    } else if (req.file.mimetype.startsWith('video/')) {
      newPost.videoUrl = mediaPath;
    }
  }
  posts.push(newPost);
  fs.writeFileSync(path.join(__dirname, '../data/posts.json'), JSON.stringify(posts, null, 2));
  res.redirect('/admin');
});

router.put('/api/posts/:id', upload.single('media'), (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/posts.json')));
  const post = posts.find(p => p.id === id);
  post.title = title;
  post.content = content;
  if (req.file) {
    const mediaPath = `/uploads/${req.file.filename}`;
    if (req.file.mimetype.startsWith('image/')) {
      post.imageUrl = mediaPath;
    } else if (req.file.mimetype.startsWith('video/')) {
      post.videoUrl = mediaPath;
    }
  }
  fs.writeFileSync(path.join(__dirname, '../data/posts.json'), JSON.stringify(posts, null, 2));
  res.redirect('/admin');
});

router.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/posts.json')));
  const updatedPosts = posts.filter(p => p.id !== id);
  fs.writeFileSync(path.join(__dirname, '../data/posts.json'), JSON.stringify(updatedPosts, null, 2));
  res.redirect('/admin');
});

module.exports = router;
