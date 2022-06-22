
const env          = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

import { merge } from 'webpack-merge';
import { common } from './webpack.common.js';
import { devConfig } from './webpack.development.js';
import { prodConfig } from './webpack.production.js';

// console.log("##############", env);

export default ({ addon } = {}) => {
    if ( isProduction) {
        return merge(common, prodConfig);
    } else {
        return merge(common, devConfig);
    }
};
