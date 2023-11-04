const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/test/': {
        target: 'https://devops100.site',
      },
    }
  }
})
