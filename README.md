# p2pjs

A peer-to-peer JavaScript CDN built on top of [IPFS](https://ipfs.io).

### Dependencies

* Node.js 4.0 or above
* npm
* [IPFS](https://ipfs.io/docs/getting-started/) running locally with default settings.

### Getting Started

Clone the repository and `cd` into it.

`git clone git@github.com:nko5/aono.git`

`cd aono`

Install the project dependencies.

`npm install`

Start the server.

`npm start`

Navigate to `localhost:8081` in your browser of choice.

### Development

You can run `npm run watch` to watch for changes and restart the server during development.

Adding a resource is currently done via an npm run task, `npm run add -- <script>`. `<script>` only currently supports passing in an [npmcdn.com](http://npmcdn.com) url, any other value passed in is unlikely to work. Future version will support a much more robust upload process.
