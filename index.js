const http = require('http');
const fs = require('fs');
const path = require('path');
const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, resp) => {
  console.log('Request for ' + req.url + ' by method ' + req.method);

  
  if (req.method === 'GET') {
    let fileURL;
    if (req.url === '/') {
      fileURL = '/index.html';
    } else {
      fileURL = req.url;
    }

    const filePath = path.resolve('./public' + fileURL);
    const fileExt = path.extname(filePath);

    if (fileExt === '.html') {
      fs.exists(filePath, (exists) => {
        if (!exists) {
          resp.statusCode = 404;
          resp.setHeader('Content-Type', 'text/html');
          resp.end('<html><body><h1>Error 404: ' + fileURL + ' does not exist</h1></body></html>');
          return; 
        }

        resp.statusCode = 200;
        resp.setHeader('Content-Type', 'text/html');
        fs.createReadStream(filePath).pipe(resp);
      });
    } else {
      resp.statusCode = 404; 
      resp.setHeader('Content-Type', 'text/html');
      resp.end('<html><body><h1>Error 404: ' + fileURL + ' is not an HTML file</h1></body></html>');
    }
  } else {
    resp.statusCode = 405; 
    resp.setHeader('Content-Type', 'text/html');
    resp.end('<html><body><h1>Error 405: ' + req.method + ' not supported</h1></body></html>');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
