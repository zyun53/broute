require('dotenv').config();

const express = require('express');
const app = express();
const EchonetLite = require('node-echonet-lite');

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/b', async (req, res) => {
    const value = await getMeasuredValue('FE80:0000:0000:0000:021C:6400:034D:BC97', [ 2, 136, 1 ])
    res.json({
      energy: value
    })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

var el = new EchonetLite({
  'type'   : 'wisunb',
  'adapter': 'rl7023',
  'path'   : process.env.BROUTE_PATH,
  'id'     : process.env.BROUTE_ID,
  'pass'   : process.env.BROUTE_PASS,
});

// Initialize the EchonetLite object
el.init((err) => {
  if(err) { // An error was occurred
    showErrorExit(err);
  } else { // Start to discover devices
    discoverDevices();
  }
});

// Start to discover devices
function discoverDevices() {
  // Start to discover a smart electric energy meter
  // on Wi-SUN B-route using a Wi-SUN USB dongle
  el.startDiscovery((err, res) => {
    // Error handling
    if(err) {
      showErrorExit(err);
    }
    // Determine the type of the found device
    var device = res['device'];
    var address = device['address'];
    var eoj = device['eoj'][0];
    var group_code = eoj[0]; // Class group code
    var class_code = eoj[1]; // Class code
    if(group_code === 0x02 && class_code === 0x88) {
      // Stop to discovery process
      el.stopDiscovery();
      // This means that the found device belongs to
      // the low voltage smart electric energy meter class
      console.log('Found a smart electric energy meter (' + address + ').');
    }
  });
}

// Get the measured values
const getMeasuredValue = (address, eoj) => {
  var epc = 0xE7; // An property code which means "Measured instantaneous electric energy"
  return new Promise(resolve => {
    el.getPropertyValue(address, eoj, epc, (err, res) => {
      resolve(res['message']['data']['energy']);
    })
  })
}

// Print an error then terminate the process of this script
function showErrorExit(err) {
  console.log('[ERROR] '+ err.toString());
  process.exit();
}

function createLine(char) {
  var len = process.stdout.columns - 1;
  var line = '';
  for(var i=0; i<len; i++) {
    line += char;
  }
  return line;
}
