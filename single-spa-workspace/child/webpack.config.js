const { merge } = require("webpack-merge")
const singleSpaDefaults = require("webpack-config-single-spa")

module.exports = () => {
    const defaultConfig = singleSpaDefaults({
        // 组织名称
        orgName: "codeteenager",
        // 项目名称
        projectName: "child"
    })
    return merge(defaultConfig, {
        devServer: {
            port: 9001
        }
    })
}