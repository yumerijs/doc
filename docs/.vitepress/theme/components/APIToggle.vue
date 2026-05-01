<script setup>
import { apiType } from '../api-state'

const toggle = (type) => {
  apiType.value = type
}
</script>

<template>
  <div class="api-toggle">
    <button 
      class="toggle-btn" 
      :class="{ active: apiType === 'functional' }"
      @click="toggle('functional')"
    >
      函数式 API
    </button>
    <button 
      class="toggle-btn" 
      :class="{ active: apiType === 'decorator' }"
      @click="toggle('decorator')"
    >
      装饰器 API
    </button>
  </div>
</template>

<style scoped>
.api-toggle {
  display: flex;
  padding: 16px 24px;
  gap: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  position: sticky;
  top: 0;
  z-index: 10;
}

.toggle-btn {
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  transition: all 0.25s;
  border: 1px solid var(--vp-c-divider);
}

.toggle-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-brand-1);
}

.toggle-btn.active {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

@media (max-width: 959px) {
  .api-toggle {
    padding: 12px 12px 0;
  }
}
</style>
