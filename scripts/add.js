const fs = require('fs')
const ipfsAPI = require('ipfs-api')
const rs = require('request-promise')
const libraries = require('../libraries.json')

const ipfs = ipfsAPI('localhost', '5001')

const source = process.argv[2]
const sourceSplit = source.split('@')
const libName = sourceSplit[0].split('/')[3]
const libVersion = sourceSplit[1].split('/')[0]

rs(source).then((resp) => {
  fs.writeFile(`/tmp/${libName}`, resp, (err) => {
    if (err) {
      return console.log(err)
    }

    ipfs.add(`/tmp/${libName}`, (err, res) => {
      if (err || !res) {
        return console.error(err)
      }

      res.forEach((file) => {
        libraries.push({
          name: file.Name,
          version: libVersion,
          hash: file.Hash
        })

        fs.writeFile('libraries.json', JSON.stringify(libraries, null, '  '), function (err) {
          if (err) {
            return console.error(err)
          }

          return console.log('written to libraries.json')
        })
      })
    })
  })
})
