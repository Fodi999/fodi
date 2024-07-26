const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Загружаем переменные окружения
require('dotenv').config();

router.get('/admin', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/posts.json')));

  if (!req.session.user) {
    res.render('admin', { user: null, posts: [] });
  } else {
    res.render('admin', { user: req.session.user, posts });
  }
});

router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.session.user = { username };
    res.redirect('/admin');
  } else {
    res.redirect('/admin');
  }
});

module.exports = router;


 