---
layout: home

hero:
  name: MC WindyPear高版本社区服
  tagline: 为创造我的世界良好的养老社区环境而努力
  image:
    src: https://api.flweb.cn/logos/MCWP/icon.jpg
    alt: MCWP
  actions:
    - theme: brand
      text: 加入QQ群组
      link: https://go.flweb.cn/mcwindypear

---
<script>
export default {
  mounted() {
    this.shuffleElements();
    // 如果确实需要在挂载后调用 reload() 方法，确保该方法已经定义
    // this.reload();
  },
  methods: {
    shuffleElements() {
      const elements = Array.from(document.querySelectorAll('div.VPFeatures .container .items .item'));
      const parent = document.querySelector('div.VPFeatures .container .items');

      for (let i = elements.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = elements[i];
        elements[i] = elements[j];
        elements[j] = temp;
      }

      // 清空父元素并将重新排序后的元素添加到父元素中
      parent.innerHTML = '';
      elements.forEach(element => {
        parent.appendChild(element);
      });
    }
  }
}
</script>
