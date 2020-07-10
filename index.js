require('dotenv').config();
var EchonetLite = require('node-echonet-lite');
var el = new EchonetLite({
  'lang'   : 'ja',
  'type'   : 'wisunb',
  'adapter': 'rl7023',
  'path'   : process.env.BROUTE_PATH,
  'id'     : process.env.BROUTE_ID,
  'pass'   : process.env.BROUTE_PASS,
  'baud'   : 115200
});

el.init((err) => {
  if(err) {
    console.log('[ERROR] '+ err.toString());
    process.exit();
  } else {
    el.startDiscovery((err, res) => {
      el.stopDiscovery();
      if(err) {
        console.log('[ERROR] '+ err.toString());
        process.exit();
      } else {
        // Do something
      }
    });
    el.on('data-serial', (res) => {
      console.log(res['data']);
    });
    el.on('sent-serial', (res) => {
      console.log('> ' + res['data']);
    });
  }
});
