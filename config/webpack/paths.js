
import { resolve } from 'path';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// module.exports = {
const paths = {
    assetsSource: 	  resolve(__dirname,   '../', '../', 'src', 'assets'),
    externSource: 	  resolve(__dirname,   '../', '../', 'src', 'extern'),
    sourcePath: 	  resolve(__dirname,   '../', '../', 'src'),
    contextPath: 	  resolve(__dirname,   '../', '../', 'src'),
    outputPath: 	  resolve(__dirname,   '../', '../', 'dist'),
    staticSource:     resolve(__dirname,   '../', '../', 'dist',   'static'),
    bundleReportPath: resolve(__dirname,   '../', '../', 'dist',   'bundle-report.html'),
    entryPath: 		  resolve(__dirname,   '../', '../', 'src/index.ts'),
    templatePath: 	  resolve(__dirname,   '../', '../', 'src/index.html'),
    envDevPath: 	  resolve(__dirname,   '../', 'environment', '.env.development'),
    envProdPath: 	  resolve(__dirname,   '../', 'environment' , '.env.production'),
    envPath: 		  resolve(__dirname,   '../', 'environment' , '.env'),
    staticTarget:     resolve(__dirname,   '../', '../', 'assets', 'static'),
};

export { paths };
