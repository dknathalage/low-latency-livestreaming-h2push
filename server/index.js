/**
 * Http2 server to handle encoding and file serving
 *
 *
 * HTTP2 always sends data in chunked mode so there is no need to define it explicitly
 */
const http2 = require("http2");
const fs = require("fs");
const frag = require("./src/fragmenter");

// Creating certification
// openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost-private.pem -out localhost-cert.pem
const server = http2.createSecureServer({
  key: fs.readFileSync("localhost-private.pem"),
  cert: fs.readFileSync("localhost-cert.pem"),
});

server.on("error", (err) => console.log(err));
server.on("stream", function (stream, headers) {
  
    // router
  switch (headers[":path"]) {
    case "/":
      serveStaticPage(stream, headers);
      break;
    default:
      stream.respond({
        ":status": 200,
      });
      stream.end("hell");
      break;
  }
});

server.listen(5000, async function () {
  console.log("server listening on port 5000");
});

async function serveStaticPage(stream, headers) {
  data = fs.readFileSync('./public/static/index.html');
  stream.respond({":status":200});
  stream.end(data);
}