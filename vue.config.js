module.exports = {
    configureWebpack: {
        devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
    },
}