require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const methodOverride = require('method-override');
const fs = require('fs');

// Ensure sessions directory exists
const sessionsDir = path.join(__dirname, process.env.SESSION_DIR || 'sessions');
if (!fs.existsSync(sessionsDir)){
    fs.mkdirSync(sessionsDir);
}

const app = express();

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const postsRouter = require('./routes/posts');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  store: new FileStore({ path: sessionsDir }),
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/', adminRouter);
app.use('/', postsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});



