const path = require('path')

module.exports = {
  entry: './build/main.js',
  mode: 'production',
  output: {
    filename : "markgit.js",
    path: path.resolve(__dirname,'dist'),
    library: {
      name: 'MarkGit',
      type: 'var',
    },
  },
}
