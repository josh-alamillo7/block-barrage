const http = require('http')
const fs = require('fs')
const path = require('path')

const port = process.env.PORT || 3330

const server = http.createServer((request, response) => {

  let filePath = path.join(__dirname, '../client/dist') + request.url

  //let filePath = '/Users/joshalamillo/Desktop/Personal Projects/minigames/block-barrage/client/dist' + request.url


  if (request.url == '/') {
    filePath += 'index.html';
  }

  // const filePath = '/Users/joshalamillo/Desktop/Personal Projects/minigames/block-barrage/client/dist/index.html'

  const extname = String(path.extname(filePath)).toLowerCase();
  
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css'
  }

  const contentType = mimeTypes[extname]

  const fileToServe = fs.readFileSync(filePath)

  response.end(fileToServe)

})

server.listen(port, function() {
  console.log('listening on port 3330...')
})