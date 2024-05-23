module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
        'react-markdown': 'node_modules/react-markdown/react-markdown.min.js',
    },
    transformIgnorePatterns: ["node_modules/(?!axios)"],
    module: {
        rules: [
            {
                test: /\.json$/,
                loader: 'json-loader',
                type: 'javascript/auto'
            }
        ]
    }
};