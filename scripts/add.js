const fs = require('fs')
const ipfsAPI = require('ipfs-api')
const rs = require('request-promise')

const ipfs = ipfsAPI('localhost', '5001')

const source = process.argv[2]
const sourceSplit = source.split('/')
const fileName = sourceSplit[sourceSplit.length - 1]

rs(source).then((resp) => {
  fs.writeFile(`/tmp/${fileName}`, resp, (err) => {
    if(err) {
      return console.log(err)
    }

    ipfs.add(`/tmp/${fileName}`, (err, res) => {
      if(err || !res) {
        return console.error(err)
      }

      res.forEach((file) => {
        console.log('hash',file.Hash)
        console.log('name',file.Name)
      })
    })
  })
})
