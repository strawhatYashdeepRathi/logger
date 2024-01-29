const express = require('express');

//create http server for socket.io to work
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const cors = require('cors');
app.use(cors());
const moment = require('moment');

const io = require('socket.io')(http, {cors: {origin: "*"}});
const path = require('path');

const Watcher = require('./filewatcher');
const { count } = require('console');

let watcher = new Watcher("demo.txt");
// moment.utc(elem).format("MM-DD-YYYY")

watcher.start();

app.get('/log', (req, res)=> {
  console.log("req received");
  var options = {
    root: path.join(__dirname)
  };
  var fileName = 'index.html';
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('sent', fileName);
    }
  })
})

io.on('connection', function(socket) {
  console.log("new connection created:", socket.id);
  watcher.on('process', function process(data) {
    socket.emit("update-log", data);
  })
  let data = watcher.getlogs();
  socket.emit("init", data)
})

let counter = 1;
fs.appendFile("demo.txt",Date.now().toString(),(err) => {
    if(err) throw err;
    console.log("test file initialized");
});
counter++;
let ii = setInterval(function(){
    fs.appendFile("demo.txt","\n"+moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a').toString(),(err) => {
    if(err) console.log(err);
    console.log("log updated");
    });
    counter++;
},2000);


http.listen(8080, function(){
  console.log("localhost is okay")
})




