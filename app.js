//update check

const path = require('path');
const express = require('express');
const app = express();
const router = express.Router();
 
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'pug');

app.use('/', router);

var object = [
    {
    date:'0926',
    dac__blac: ['black', 10],
    dac__mach: ['matcha', 5],
    dac__lemo: ['lemon', 0],
    },
    {
    date:'0927',
    dac__blac: ['black', 10],
    dac__mach: ['matcha', 0],
    dac__lemo: ['lemon', 5],
    }
]


router.get('/', function (req, res) {
    res.render('index', {baking__data: object});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('we got the error');
});

module.exports = app;