const env          = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

import MiniCssExtractPlugin from "mini-css-extract-plugin";

import { resolve } from 'path';
import { paths } from './paths.js';

const imageInlineSizeLimit = 10000;
const fontInlineSizeLimit  = 10000;

/**
    asset/resource : Equivalent to file-loader.
    asset/inline: Equivalent to url-loader.
    asset/source: Equivalent to raw-loader.
    asset/raw:    Equivalent to url-loader with a limit size.
    Raw-loader imports your file as a string,
    Url-loader is used to inline your file as a data URI and
    file-loader is used to emit your file in the output directory.
 *
 */

// module.exports = [
const rules = [
    {
        test: /\.wasm\.js$/,
        // loaders: ['wasm-loader'],
    },
    {
        test: /\.(json)$/i,
        type: 'asset/source',
    },
    {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
    },
    {
        test: /\.(svg|ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        type: 'asset/resource',
        generator: {
            filename: 'assets/fonts/[name][ext]',
        },
    },
    {   // these should become chunks
        // test: /\.(png|jpe?g|gif)$/,
        test: /images.*\.(png|jpe?g|gif)$/,
        type: 'asset/resource',
        generator: {
            filename: 'assets/images/[name][ext]',
        },
    },
    {   // these should become files
        test: /pictures.*\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        generator: {
            filename: 'assets/pictures/[name][ext]',
        },
    },
    // {
    //     test: /\.(css)$/,
    //     type: 'asset/resource',
    //     generator: {
    //         filename: 'styles/[name][ext]',
    //     },
    // },
    // {
    //     test: /images.*\.(png|jpe?g|gif|svg)$/,
    //     type: 'asset/inline',
    //     generator: {
    //         filename: './images/[name][ext]',
    //     },
    // },
    {
        test: /\.(txt|pgn)$/i,
        type: 'asset/source',
        generator: {
            filename: 'games/[name][ext]',
        },
    },
    {
        test: /\.(sa|sc|c)ss$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                // options: {
                //     publicPath: resolve(paths.outputPath, 'styles/'),
                // },
            },
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                },
            },
            {
                loader: 'sass-loader',
            },
        ],
    },
];

export { rules };
