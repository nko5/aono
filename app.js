const express = require('express')
const ipfsAPI = require('ipfs-api')

const ipfsConfig = {
  production: {
    host: 'ipfs.io',
    port: 80
  },
  dev: {
    host: 'localhost',
    port: 5001
  }
}

const ipfsCfg = ipfsConfig[process.env.NODE_ENV] || ipfsConfig.dev

const ipfs = ipfsAPI(ipfsCfg.host, ipfsCfg.port)

const app = express()

app.get('/', (req, res) => {
  res.send('<a href="/QmYrf7ezt4TppARKyzt95KRy8nKzY5Z9Jw4qX3DeexsBHY">code</a>')
})

app.get('/:hash', (req, res) => {
  ipfs.cat(req.params.hash, (err, file) => {
    if (err || !file) {
      return console.error(err)
    }

    if(file.readable) {
      file.pipe(res)
    } else {
      res.send(file)
    }
    res.setHeader("Access-Control-Allow-Origin", "*")
  })
})

const port = process.env.PORT || 8081
app.set('x-powered-by', false)
app.listen(port)
console.log('Express server started on port %s', port)
