// const webpack = require('webpack');
// const paths = require('./paths');

import { paths }    from './paths.js';

// module.exports = {
const prodConfig = {
    mode: 'production',
    performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize:      512000,
    },
    output: {
        path: paths.outputPath,
        filename:      'js/[name]-[contenthash:8].js',
        chunkFilename: 'js/[name]-[contenthash:8].js',
    },
    plugins: [
    ],
    // https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 30000,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name( /* module */) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        // const packageName = module.context.match(
                        //     /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                        // )[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        // return `vendor.${packageName.replace('@', '')}`;

                        // all node-modules in one chunk
                        return 'vendor';
                    },
                },
                assets: {
                    test: /[\\/]assets[\\/]/,
                    name() {
                        return 'assets';
                    },
                },
                worker: {
                    test: /[\\/]worker[\\/]/,
                    name() {
                        return 'worker';
                    },
                },
            },
        },
    },
};

export { prodConfig };
