const path = require('path')

module.exports = [
  // Browser build
  {
    entry: './build/main.js',
    mode: 'production',
    output: {
      filename: "markgit.js",
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'MarkGit',
        type: 'var',
      },
    },
  },
  // Node.js build
  {
    entry: './build/main.js',
    mode: 'production',
    target: 'node',
    output: {
      filename: "markgit-node.js",
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'commonjs2',
      },
    },
    externals: {
      'axios': 'axios',
      'highlight.js': 'highlight.js',
      'markdown-it': 'markdown-it',
      'markdown-it-emoji': 'markdown-it-emoji',
      'markdown-it-deflist': 'markdown-it-deflist',
      'markdown-it-sub': 'markdown-it-sub',
      'markdown-it-sup': 'markdown-it-sup',
      'markdown-it-ins': 'markdown-it-ins',
      'markdown-it-mark': 'markdown-it-mark',
      'markdown-it-footnote': 'markdown-it-footnote'
    }
  }
]
