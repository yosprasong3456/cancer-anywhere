const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const personHisRouter = require('./routes/personHis');
const helmet = require("helmet");
const cron = require('node-cron');
const hisController = require('./controllers/hisController')
// const queController = require('./controllers/queController')

const app = express();
app.use(helmet());
app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const task = cron.schedule('29 16 * * *', async() =>{
  console.log('Tik');
  console.log('Run task every minute');
  const line = await hisController.lineNortify()
}, {
  scheduled: true,
  timezone: "Asia/Bangkok"
});
task.start()

const taskClearQue = cron.schedule('40 18 * * *', async() =>{
  const DelQue = await queController.index()
}, {
  scheduled: true,
  timezone: "Asia/Bangkok"
});
taskClearQue.start()

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/personHis', personHisRouter);

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
  res.render('error');
});

module.exports = app;
