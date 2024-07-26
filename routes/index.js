const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/posts.json')));
  res.render('index', { posts });
});

module.exports = router;
