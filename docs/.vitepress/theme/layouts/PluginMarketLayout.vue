<template>
  <div class="w-full max-w-7xl mx-auto px-4 py-6">
    <!-- 标题 -->
    <h1 class="text-3xl font-bold text-center mb-2">插件市场</h1>
    <!-- 插件总数 -->
    <p class="text-center text-gray-600 dark:text-gray-400 mb-6">
      当前一共有 {{ plugins.length }} 个 Yumeri 插件
    </p>

    <!-- 搜索框 -->
    <div class="flex justify-center mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="搜索插件..."
        class="border rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <!-- 加载 / 错误 -->
    <div v-if="loading" class="text-center text-gray-500">正在加载插件列表...</div>
    <div v-else-if="error" class="text-center text-red-500">加载失败：{{ error }}</div>

    <!-- 插件列表 -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="plugin in paginatedPlugins" :key="plugin.name">
          <div
            class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            @click="goToNpm(plugin.name)"
          >
            <h3 class="font-semibold text-lg text-blue-600 dark:text-blue-300 mb-2">
              {{ plugin.name }}
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
              {{ plugin.description || '暂无描述' }}
            </p>
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-3">
              <span class="block">作者：{{ plugin.author }}</span>
              <span class="block">更新：{{ plugin.updatedAt }}</span>
              <span class="block">体积：{{ plugin.unpackedSize }}</span>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="k in plugin.keywords"
                :key="k"
                class="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded"
              >
                #{{ k }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="flex justify-center gap-2 mt-6">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
        >
          上一页
        </button>
        <span class="px-2 py-1">{{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const plugins = ref<any[]>([])
const search = ref('')
const loading = ref(true)
const error = ref<string | null>(null)

const currentPage = ref(1)
const perPage = 10

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
    (p.keywords?.some(k => k.toLowerCase().includes(keyword)) || false)
  )
})

const totalPages = computed(() => Math.ceil(filteredPlugins.value.length / perPage))

const paginatedPlugins = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredPlugins.value.slice(start, start + perPage)
})

const goToNpm = (name: string) => {
  window.open(`https://www.npmjs.com/package/${name}`, '_blank')
}

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>