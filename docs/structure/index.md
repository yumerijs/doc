---
layout: page
title: 特别鸣谢
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'
const Server = [
    {
    avatar: 'https://koishi.chat/logo.png',
    name: 'Koishi',
    title: '灵感来源',
    desc: '开发规范、插件语法借鉴，灵感来源',
  },
{
    avatar: 'https://api.flweb.cn/logos/my/fireguo.png',
    name: 'FireGuo',
    title: '开发',
    desc: '风梨团队创始人，主要开发人员',
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>特别鸣谢</template>
  </VPTeamPageTitle>
  <VPTeamMembers size="medium" :members="Server" />

</VPTeamPage>
