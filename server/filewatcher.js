const fs = require('fs');
const events = require('events');
const bf = require('buffer');
const { log } = require('console');
const txtfile = "demo.txt";

const NoOfLines = 10;
const buffer = Buffer.alloc(bf.constants.MAX_STRING_LENGTH);

class Watcher extends events.EventEmitter {

  constructor (txtfile) {
    super();
    this.txtfile = txtfile;
    this.store = [];
  }

  getlogs () {
    return this.store;
  }

  watch (curr, prev) {
    const watcher = this;
    fs.open(this.txtfile, (err, fd)=> {
      if(err){
        throw err;
      }
      let data = "";
      let logs = [];
      fs.read(fd, buffer, 0, buffer.length, prev.size, (err, bytesRead) => {
        if(err){
          throw err;
        }
        if (bytesRead > 0) {
          data = buffer.slice(0, bytesRead).toString();
          logs = data.split(/\r?\n/).slice(1);
          console.log("running in watcher e2", logs)
          console.log("test logs", logs);
          if (logs.length >= NoOfLines) {
            logs.slice(-10).forEach((ele)=> {
              this.store.push(ele)
            })
          }
          else{
            logs.forEach((ele)=> {
              if (this.store.length == NoOfLines) {
                console.log("logs full already");
                this.store.shift();
              }
              this.store.push(ele);
            })
          }
          watcher.emit("process", logs);
        }
      })
    })
  }

  start () {
    var watcher = this;
    fs.open(this.txtfile, (err, fd) => {
      if(err){
        throw err;
      }
      let data = "";
      let logs = [];
      fs.read(fd, buffer, 0, buffer.length, 0, (err, bytesRead)=> {
        if(err){
          throw err;
        }
        if (bytesRead > 0){
          data = buffer.slice(0, bytesRead).toString('utf-8');
          console.log("running", data.split(/\r?\n/).slice(1));
          logs = data.split(/\r?\n/).slice(1);
          this.store = [];
          logs.slice(-10).forEach((ele)=> {
            this.store.push(ele);
          })
        }
        fs.close(fd);
      })
      fs.watchFile (this.txtfile, {'interval': 1000}, function(curr, prev) {
        watcher.watch(curr, prev);
      })
    })
  }
}
module.exports = Watcher;

