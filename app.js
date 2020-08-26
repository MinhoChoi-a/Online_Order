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
    day_num: 6,
    dac_limit: 50,
    cake_limit: 3,    
    },
    {
    date:'0927',
    day_num: 7,
    dac_limit: 50,
    cake_limit: 3,
    }
]

//mongoose get array which dac and cake limit are 0

router.get('/', function (req, res) {
  console.log(object)  ;
  res.render('index', {limit_data: object});
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
  res.send(err.message);
});

module.exports = app;