var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('isomorphic-fetch');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-compass')({mode: 'expanded'}));
app.use(express.static(path.join(__dirname, 'public')));

// const pcUrl = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';

let pc = {"board":{"vendor":"IBM","model":"IBM-PC S-100","cpu":{"model":"80286","hz":12000},"image":"http://www.s100computers.com/My%20System%20Pages/80286%20Board/Picture%20of%2080286%20V2%20BoardJPG.jpg","video":"http://www.s100computers.com/My%20System%20Pages/80286%20Board/80286-Demo3.mp4"},"ram":{"vendor":"CTS","volume":1048576,"pins":30},"os":"MS-DOS 1.25","floppy":0,"hdd":[{"vendor":"Samsung","size":33554432,"volume":"C:"},{"vendor":"Maxtor","size":16777216,"volume":"D:"},{"vendor":"Maxtor","size":8388608,"volume":"C:"}],"monitor":null,"length":42,"height":21,"width":54};
// fetch(pcUrl)
//   .then(function(res) {
//     if (res.status >= 400) {
//       throw new Error("Bad response from gist.githubusercontent.com");
//     }
//     pc = res.json();
//   })
//   .catch(err => {
//     console.log('Bad response from gist.githubusercontent.com:', err);
//   });

app.all('*', function (req, res, next) {
  let url = req.url.replace(/\?.*$/i, '');
  let isError = false;
  let result = pc;
  if (url == '/volumes') {
    let hdd = {};
    if (typeof pc['hdd'] != 'undefined') {
      pc.hdd.forEach(function(item, i, arr) {
        if (typeof item['volume'] != 'undefined' && typeof item['size'] != 'undefined') {
          if (typeof hdd[item['volume']] == 'undefined') {
            hdd[item['volume']] = 0;
          }
          hdd[item['volume']] = hdd[item['volume']] + item['size'];
        } else isError = true;
      });
      result = hdd;
    } else isError = true;
  } else if (url != '/') {
    let jsonPath = url.substr(1).split('/');
    jsonPath.forEach(function (item, i, jsonPath) {
      if (!isError) {
        if (typeof result[item] != 'undefined') {
          result = result[item];
        } else {
          isError = true;
        }
      }
    });
  }
  if (isError) {
    next();
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(result);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
