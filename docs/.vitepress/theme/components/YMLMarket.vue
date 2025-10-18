<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const plugins = ref<any[]>([])
const search = ref('')
const loading = ref(true)
const error = ref<string | null>(null)

const fetchPlugins = async () => {
  try {
    const res = await fetch('https://registry.yumeri.dev')
    if (!res.ok) throw new Error('请求失败')
    plugins.value = await res.json()
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchPlugins)

const filteredPlugins = computed(() => {
  if (!search.value) return plugins.value
  const keyword = search.value.toLowerCase()
  return plugins.value.filter(p =>
    p.name.toLowerCase().includes(keyword) ||
    p.description?.toLowerCase().includes(keyword) ||
    p.keywords?.some((k: string) => k.toLowerCase().includes(keyword))
  )
})

const goToNpm = (name: string) => {
  window.open(`https://www.npmjs.com/package/${name}`, '_blank')
}
</script>

<template>
  <div class="yumeri-market-container px-4 py-6">
    <h2 class="text-2xl font-bold mb-4 text-center">🪐 Yumeri 插件市场</h2>

    <div class="flex justify-center mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="搜索插件..."
        class="border rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <div v-if="loading" class="text-center text-gray-500">正在加载插件列表...</div>
    <div v-else-if="error" class="text-center text-red-500">加载失败：{{ error }}</div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <div
        v-for="plugin in filteredPlugins"
        :key="plugin.name"
        class="border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700"
        @click="goToNpm(plugin.name)"
      >
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-lg text-blue-600 dark:text-blue-300">
            {{ plugin.name }}
          </h3>
          <span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 px-2 py-0.5 rounded">
            {{ plugin.version }}
          </span>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
          {{ plugin.description || '暂无描述' }}
        </p>

        <div class="text-xs text-gray-500 dark:text-gray-400 mt-3">
          <span class="block">作者：{{ plugin.author }}</span>
          <span class="block">更新：{{ plugin.updatedAt }}</span>
          <span class="block">体积：{{ plugin.unpackedSize }}</span>
        </div>

        <div class="flex flex-wrap gap-1 mt-3">
          <span
            v-for="k in plugin.keywords"
            :key="k"
            class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded"
          >
            #{{ k }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>