<script setup>
import { useData, useRouter } from 'vitepress'
import { computed } from 'vue'
import { apiType } from '../api-state'

const { lang } = useData()
const router = useRouter()

const isEn = computed(() => lang.value.startsWith('en'))

const texts = computed(() => ({
  label: isEn.value ? 'API Preference' : 'API 风格偏好',
  functional: isEn.value ? 'Functional' : '函数式 API',
  decorator: isEn.value ? 'Decorator' : '装饰器 API',
  helpLink: isEn.value ? '/en/dev/decorator' : '/dev/decorator'
}))

const toggle = (type) => {
  apiType.value = type
}

const goToHelp = () => {
  router.go(texts.value.helpLink)
}
</script>

<template>
  <div class="api-toggle-container">
    <div class="api-toggle-header">
      <span class="api-toggle-label">{{ texts.label }}</span>
      <button class="help-btn" @click="goToHelp" title="Help">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      </button>
    </div>
    <div class="api-toggle">
      <button 
        class="toggle-btn" 
        :class="{ active: apiType === 'functional' }"
        @click="toggle('functional')"
      >
        {{ texts.functional }}
      </button>
      <button 
        class="toggle-btn" 
        :class="{ active: apiType === 'decorator' }"
        @click="toggle('decorator')"
      >
        {{ texts.decorator }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.api-toggle-container {
  padding: 16px 24px;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
}

.api-toggle-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 4px;
}

.api-toggle-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.help-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
  transition: color 0.25s;
}

.help-btn:hover {
  color: var(--vp-c-brand-1);
}

.api-toggle {
  display: flex;
  gap: 4px;
  background-color: var(--vp-c-bg-mute);
  padding: 2px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
}

.toggle-btn {
  flex: 1;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 0;
  border-radius: 4px;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}

.toggle-btn:hover {
  color: var(--vp-c-text-1);
}

.toggle-btn.active {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  box-shadow: var(--vp-shadow-1);
}

@media (max-width: 959px) {
  .api-toggle-container {
    padding: 12px 16px;
  }
}
</style>
