import { ref, watch, onMounted } from 'vue'

export const API_TYPE_KEY = 'yumeri-api-type'
export const apiType = ref('functional')

const updateClass = (type) => {
  if (typeof document === 'undefined') return
  const el = document.documentElement
  if (type === 'functional') {
    el.classList.add('functional-api')
    el.classList.remove('decorator-api')
  } else {
    el.classList.add('decorator-api')
    el.classList.remove('functional-api')
  }
}

// 初始化
if (typeof localStorage !== 'undefined') {
  const saved = localStorage.getItem(API_TYPE_KEY)
  if (saved === 'functional' || saved === 'decorator') {
    apiType.value = saved
  }
}

// 监听变化
watch(apiType, (val) => {
  updateClass(val)
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(API_TYPE_KEY, val)
  }
}, { immediate: true })

// 确保在客户端挂载时应用类名
export function useApiType() {
  onMounted(() => {
    updateClass(apiType.value)
  })
}
