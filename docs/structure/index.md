---
layout: page
title: MCWindyPear
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
    avatar: '/teammate/2/SuiFeng.jpg',
    name: '随风潜入夜',
    title: '技术支持',
    desc: 'MCJPG组织成员，提供网站基础架构',
  },
{
    avatar: 'https://api.flweb.cn/logos/my/fireguo.png',
    name: 'FireGuo',
    title: '技术支持',
    desc: '腐竹，风梨团队创始人',
  },
]
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>组织架构</template>
  </VPTeamPageTitle>
  <VPTeamMembers size="medium" :members="Server" />

</VPTeamPage>
