'use strict'

const ejs = require('ejs')
const express = require('express')
const ipfsAPI = require('ipfs-api')
const libraries = require('./libraries.json');

const config = {
  production: {
    ipfsHost: 'ipfs.io',
    ipfsPort: 80,
    baseUrl: 'http://aono.2015.nodeknockout.com/'
  },
  dev: {
    ipfsHost: 'localhost',
    ipfsPort: 5001,
    baseUrl: 'http://localhost/'
  }
}

const cfg = config[process.env.NODE_ENV] || config.dev
const ipfs = ipfsAPI(cfg.ipfsHost, cfg.ipfsPort)

const app = express()

app.get('/', (req, res) => {
  res.render('index', {
    libraries,
    baseUrl: cfg.baseUrl
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
