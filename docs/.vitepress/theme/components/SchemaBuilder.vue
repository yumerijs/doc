<template>
  <div class="schema-builder">
    <div class="schema-builder__panel">
      <div class="schema-builder__header">
        <h2>Schema 结构</h2>
        <button class="sb-btn" @click="addField()">添加字段</button>
      </div>

      <div v-if="fields.length === 0" class="schema-builder__empty">
        还没有字段，点击“添加字段”开始。
      </div>

      <div v-else class="schema-builder__fields">
        <SchemaBuilderField
          v-for="(field, idx) in fields"
          :key="field.id"
          :field="field"
          :level="0"
          @remove="removeField(idx)"
          @add-child="addChild(field)"
        />
      </div>
    </div>

    <div class="schema-builder__panel">
      <div class="schema-builder__header">
        <h2>生成结果</h2>
        <button class="sb-btn sb-btn--ghost" @click="reset">清空</button>
      </div>

      <div class="schema-builder__block">
        <div class="schema-builder__label">Schema 代码</div>
        <textarea class="schema-builder__textarea" :value="schemaCode" readonly></textarea>
      </div>

      <div class="schema-builder__block">
        <div class="schema-builder__label">配置示例</div>
        <textarea class="schema-builder__textarea" :value="yamlSample" readonly></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SchemaBuilderField from './SchemaBuilderField.vue'

const typeOptions = [
  { value: 'string', label: 'string' },
  { value: 'number', label: 'number' },
  { value: 'boolean', label: 'boolean' },
  { value: 'array', label: 'array' },
  { value: 'object', label: 'object' },
  { value: 'enum', label: 'enum' },
]

let uid = 0
const newField = () => ({
  id: ++uid,
  name: '',
  type: 'string',
  required: false,
  description: '',
  defaultValue: '',
  enumValues: '',
  itemType: 'string',
  children: [],
})

const fields = ref([])

const addField = () => fields.value.push(newField())
const removeField = (idx) => fields.value.splice(idx, 1)
const addChild = (field) => field.children.push(newField())
const reset = () => {
  fields.value.splice(0, fields.value.length)
}

const quote = (v) => `'${String(v).replace(/'/g, "\\'")}'`

const parseDefault = (raw) => {
  if (raw === '' || raw === null || raw === undefined) return { ok: false, value: '' }
  try {
    const val = JSON.parse(raw)
    return { ok: true, value: val }
  } catch {
    return { ok: true, value: raw }
  }
}

const formatDefault = (raw) => {
  const parsed = parseDefault(raw)
  if (!parsed.ok) return ''
  const v = parsed.value
  if (typeof v === 'string') return quote(v)
  return JSON.stringify(v)
}

const buildSchema = (nodes, indent = 2) => {
  const pad = ' '.repeat(indent)
  const inner = nodes
    .filter((n) => n.name.trim())
    .map((n) => {
      const name = n.name.trim()
      const desc = n.description ? quote(n.description) : ''
      let expr = ''

      if (n.type === 'string') expr = `Schema.string(${desc})`
      if (n.type === 'number') expr = `Schema.number(${desc})`
      if (n.type === 'boolean') expr = `Schema.boolean(${desc})`
      if (n.type === 'enum') {
        const values = n.enumValues
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
          .map((v) => (isNaN(Number(v)) ? quote(v) : Number(v)))
        expr = `Schema.enum([${values.map((v) => (typeof v === 'string' ? v : v)).join(', ')}]${desc ? `, ${desc}` : ''})`
      }
      if (n.type === 'array') {
        const innerType = n.itemType || 'string'
        let innerExpr = `Schema.${innerType}()`
        if (innerType === 'object') {
          innerExpr = `Schema.object({\n${buildSchema(n.children, indent + 2)}\n${pad}})`
        }
        expr = `Schema.array(${innerExpr}${desc ? `, ${desc}` : ''})`
      }
      if (n.type === 'object') {
        expr = `Schema.object({\n${buildSchema(n.children, indent + 2)}\n${pad}}${desc ? `, ${desc}` : ''})`
      }

      if (n.required) expr += '.required()'
      if (n.defaultValue !== '') expr += `.default(${formatDefault(n.defaultValue)})`

      return `${pad}${name}: ${expr}`
    })
    .join(',\n')
  return inner || ''
}

const schemaCode = computed(() => {
  const body = buildSchema(fields.value, 2)
  if (!body) return `import { Schema } from 'yumeri'\n\nexport const config = Schema.object({\n  // ...\n})`
  return `import { Schema } from 'yumeri'\n\nexport const config = Schema.object({\n${body}\n})`
})

const buildYaml = (nodes, indent = 2) => {
  const pad = ' '.repeat(indent)
  return nodes
    .filter((n) => n.name.trim())
    .map((n) => {
      const key = n.name.trim()
      if (n.type === 'object') {
        const inner = buildYaml(n.children, indent + 2)
        return `${pad}${key}:\n${inner || `${pad}  {}`}`
      }
      if (n.type === 'array') {
        return `${pad}${key}:\n${pad}- item`
      }
      if (n.type === 'boolean') return `${pad}${key}: false`
      if (n.type === 'number') return `${pad}${key}: 0`
      if (n.type === 'enum') {
        const first = n.enumValues.split(',').map((v) => v.trim()).filter(Boolean)[0] || ''
        return `${pad}${key}: ${first}`
      }
      return `${pad}${key}: ''`
    })
    .join('\n')
}

const yamlSample = computed(() => {
  const body = buildYaml(fields.value, 2)
  if (!body) return `plugins:\n  your-plugin:\n    # ...`
  return `plugins:\n  your-plugin:\n${body}`
})

</script>

<style scoped>
.schema-builder {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 960px) {
  .schema-builder {
    grid-template-columns: 1fr 1fr;
  }
}

.schema-builder__panel {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
}

.schema-builder__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.schema-builder__empty {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.schema-builder__block {
  margin-top: 12px;
}

.schema-builder__label {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
}

.schema-builder__textarea {
  width: 100%;
  min-height: 180px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  padding: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.sb-field {
  border: 1px dashed var(--vp-c-divider);
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 12px;
  background: var(--vp-c-bg);
}

.sb-field__row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.sb-field__children {
  margin-top: 8px;
}

.sb-input {
  padding: 6px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 12px;
}

.sb-input--grow {
  flex: 1 1 200px;
}

.sb-select {
  padding: 6px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 12px;
}

.sb-btn {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-brand);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}

.sb-btn--ghost {
  background: transparent;
  color: var(--vp-c-text-1);
}

.sb-btn--danger {
  background: #e74c3c;
  border-color: #e74c3c;
}

.sb-check {
  font-size: 12px;
  color: var(--vp-c-text-1);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.sb-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
