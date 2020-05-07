module.exports = {
    publicPath: '/',
    assetsDir: 'static',
    lintOnSave: true,
    productionSourceMap: false,
    css: {
        sourceMap: false
    },
    pwa: {
        iconPaths: {
            favicon32: './favicon.ico',
            favicon16: './favicon.ico',
            appleTouchIcon: './favicon.ico',
            maskIcon: './favicon.ico',
            msTileImage: './favicon.ico'
        }
    }
};
