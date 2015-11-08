const ejs = require('ejs')
const express = require('express')
const ipfsAPI = require('ipfs-api')
const libraries = require('./libraries.json');

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
  res.render('index', {
    libraries: libraries
  })
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
app.set('views', './views')
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.set('x-powered-by', false)
app.listen(port)
console.log('Express server started on port %s', port)
