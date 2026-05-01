import DefaultTheme from 'vitepress/theme'
import './style/var.css'
import './style/fonts.css'
import './style/index.css' // 确保导入了样式
import Layout from './Layout.vue'
import VPHome from './components/VPHome.vue'
import PluginMarket from './components/YMRMarket.vue'
import SchemaBuilder from './components/SchemaBuilder.vue'

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({app}) {
    // 注册全局组件
    app.component('VPHome' , VPHome)
    app.component('PluginMarket', PluginMarket)
    app.component('SchemaBuilder', SchemaBuilder)
  },
}
