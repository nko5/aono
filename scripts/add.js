'use strict'

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
        let libExists = false
        libraries.forEach(lib => {
          
          if (lib.name === libName) {
            libExists = true
            let versionExists = false

            lib.versions.forEach(ver => {
              if (ver.version === libVersion) {
                versionExists = true
              }
            })

            if (!versionExists) {
              lib.versions.push({
                version: libVersion,
                hash: file.Hash
              })
            }
          }
        })

        if (!libExists) {
          libraries.push({
            name: file.Name,
            versions: [{
              version: libVersion,
              hash: file.Hash
            }]
          })
        }

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
