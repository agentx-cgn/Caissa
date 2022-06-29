const env          = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

import { resolve } from 'path';
import { paths } from './paths.js';
import { rules } from './rules.js';

const common = {
    stats:  {
        loggingDebug: ["sass-loader"],  // does this work??
        // logging: "error",
        assets: false,
        modules: false,
        entrypoints: false,
    },
    context: paths.contextPath,

    output: {
        filename: '[name].js',
        path: paths.outputPath,
        clean: true,
        module: true,
        publicPath: isProduction ? '' : '/', //!isProduction ? 'https://localhost:3000/' : '/',
    },

    entry: {
        main: paths.entryPath,
    },
    module: {
        rules,
    },
    experiments: {
        outputModule: true
    },
    resolve: {
        modules:    ['src', 'node_modules'],
        extensions: ['.ts', '.tsx', '.js', '.scss', '.css'],
        alias: {
            '@app/config':    resolve(paths.sourcePath, 'config'),
            "@app/views":     resolve(paths.sourcePath, 'views'),
            "@app/pages":     resolve(paths.sourcePath, 'views', 'pages'),
            "@app/cells":     resolve(paths.sourcePath, 'views', 'cells'),
            "@app/atoms":     resolve(paths.sourcePath, 'views', 'atoms'),
            "@app/services":  resolve(paths.sourcePath, 'services'),
            "@app/domain":    resolve(paths.sourcePath, 'domain'),
            "@app/data":      resolve(paths.sourcePath, 'data'),
            "@app/assets":    resolve(paths.sourcePath, 'assets'),
            "@app/extern":    resolve(paths.sourcePath, 'extern'),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            m: 'mithril', //Global access
        }),
        new HtmlWebpackPlugin({
            template: paths.templatePath,
        }),
        new MiniCssExtractPlugin(),
        new CopyPlugin({
          patterns: [
              // { from: "other", to: "public" },
            { from: "assets/static", to: "static" },
            // { from: "assets/publi", to: "publi" },
          ],
        }),
    ],
};

export { common };
