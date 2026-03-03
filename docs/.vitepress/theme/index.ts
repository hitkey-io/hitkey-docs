import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import BetaBadge from './BetaBadge.vue'
import ApiBetaBanner from './ApiBetaBanner.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-title-after': () => h(BetaBadge),
      'doc-before': () => h(ApiBetaBanner),
    })
  },
}
