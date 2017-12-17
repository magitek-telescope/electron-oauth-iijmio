var dialog = require('electron').dialog;

var OAuthIIJ = require('../lib/');

var iij = new OAuthIIJ(process.env.IIJ_TOKEN);

(async () => {
  const result = await iij.startRequest()
  console.log(result)
})()
