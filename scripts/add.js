const ipfsAPI = require('ipfs-api')

const ipfs = ipfsAPI('localhost', '5001')
const files = []

files.push(process.argv[2])

ipfs.add(files, function(err, res) {
    if(err || !res) return console.error(err)

    res.forEach(function(file) {
        console.log(file.Hash)
        console.log(file.Name)
    })
})
