const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    mode: 'production',
    // Другие настройки Webpack здесь
    optimization: {
        minimizer: [new TerserPlugin()],
    },
    resolve: {
        fallback: {
            "util": require.resolve("util/")
        }
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader',
                },
            },
        ],
    },
};