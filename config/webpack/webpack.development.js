// import { paths }    from './paths.js';

const devConfig = {
    mode: 'development',
    devtool: 'source-map',             // slow eval-source-map
    devServer: {
        hot: true,
        server: {
            type: 'https',
            options: {
                key: './certs/localhost.key',
                cert: './certs/localhost.crt',
                requestCert: false,
            },
        },
        // static: ['public'],
        static: ['static'],
        // // https://jaketrent.com/post/pushstate-webpack-dev-server
        // historyApiFallback: true,
        port: 3000,
        host: '0.0.0.0',
        headers: {
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Opener-Policy':   'same-origin',
        },
        onListening: function(devServer) {
            const port = devServer.server.address().port;
            console.log('Listening on port:', port);
        },
    },
};

export { devConfig };
