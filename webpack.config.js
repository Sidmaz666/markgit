const path = require('path')

module.exports = [
  // Browser build (UMD)
  {
    entry: './build/main.js',
    mode: 'production',
    output: {
      filename: "markgit.js",
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'MarkGit',
        type: 'umd',
      },
      globalObject: 'this',
    },
  },
  // Browser ES6 module build
  {
    entry: './src/index.esm.ts',
    mode: 'production',
    target: 'web',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.esm.json'
            }
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    experiments: {
      outputModule: true,
    },
    output: {
      filename: "markgit.esm.js",
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'module',
      },
      chunkFormat: 'module',
    },
  },
  // Node.js CommonJS build
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
  },
  // Node.js ES6 module build
  {
    entry: './src/index.esm.ts',
    mode: 'production',
    target: 'node',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.esm.json'
            }
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    experiments: {
      outputModule: true,
    },
    output: {
      filename: "markgit-node.esm.js",
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'module',
      },
      chunkFormat: 'module',
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
