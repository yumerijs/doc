<template>
  <div class="sb-field" :style="{ marginLeft: (level * 16) + 'px' }">
    <div class="sb-field__row">
      <input class="sb-input" v-model="field.name" placeholder="字段名" />
      <select class="sb-select" v-model="field.type">
        <option v-for="t in types" :key="t.value" :value="t.value">{{ t.label }}</option>
      </select>
      <label class="sb-check">
        <input type="checkbox" v-model="field.required" />
        必填
      </label>
      <button class="sb-btn sb-btn--danger" @click="$emit('remove')">删除</button>
    </div>

    <div class="sb-field__row">
      <input class="sb-input sb-input--grow" v-model="field.description" placeholder="描述（可选）" />
      <input class="sb-input sb-input--grow" v-model="field.defaultValue" placeholder="默认值（JSON 或字符串）" />
    </div>

    <div v-if="field.type === 'enum'" class="sb-field__row">
      <input class="sb-input sb-input--grow" v-model="field.enumValues" placeholder="枚举值，使用逗号分隔" />
    </div>

    <div v-if="field.type === 'array'" class="sb-field__row">
      <span class="sb-label">数组元素类型</span>
      <select class="sb-select" v-model="field.itemType">
        <option v-for="t in types" :key="t.value" :value="t.value">{{ t.label }}</option>
      </select>
      <button v-if="field.itemType === 'object'" class="sb-btn sb-btn--ghost" @click="onAddChild">添加子字段</button>
    </div>

    <div v-if="field.type === 'object'" class="sb-field__row">
      <button class="sb-btn sb-btn--ghost" @click="onAddChild">添加子字段</button>
    </div>

    <div v-if="field.children && field.children.length" class="sb-field__children">
      <SchemaBuilderField
        v-for="(child, idx) in field.children"
        :key="child.id"
        :field="child"
        :level="level + 1"
        @remove="field.children.splice(idx, 1)"
        @add-child="() => field.children.push(newChild())"
      />
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'SchemaBuilderField' })

const props = defineProps({
  field: { type: Object, required: true },
  level: { type: Number, required: true },
})

defineEmits(['remove', 'add-child'])

const types = [
  { value: 'string', label: 'string' },
  { value: 'number', label: 'number' },
  { value: 'boolean', label: 'boolean' },
  { value: 'array', label: 'array' },
  { value: 'object', label: 'object' },
  { value: 'enum', label: 'enum' },
]

const newChild = () => ({
  id: Date.now() + Math.random(),
  name: '',
  type: 'string',
  required: false,
  description: '',
  defaultValue: '',
  enumValues: '',
  itemType: 'string',
  children: [],
})

const onAddChild = () => {
  props.field.children.push(newChild())
}
</script>
