<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useCarOwnerStore } from '@/stores/carOwnerStore'
import { ElMessage, type FormInstance } from 'element-plus'
import type { CarOwner } from '@/types'

interface Props {
  modelValue: boolean
  owner?: CarOwner 
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'success'])

const carOwnerStore = useCarOwnerStore()
const dialogVisible = ref(props.modelValue)
const formRef = ref<FormInstance>()
const isEditing = ref(false)

const form = reactive({
  id: 0,
  fullName: ''
})

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
  if (val && props.owner) {
    isEditing.value = true
    form.id = props.owner.id
    form.fullName = props.owner.fullName
  } else {
    resetForm()
  }
})

watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

const resetForm = () => {
  formRef.value?.resetFields()
  form.id = 0
  form.fullName = ''
  isEditing.value = false
}

const submitForm = async () => {
  if (!form.fullName.trim()) {
    ElMessage.warning('Введите ФИО')
    return
  }

  try {
    if (isEditing.value) {
      await carOwnerStore.updateOwner(form as CarOwner)
      ElMessage.success('Клиент обновлен')
    } else {
      await carOwnerStore.createOwner({ fullName: form.fullName })
      ElMessage.success('Клиент создан')
    }
    
    emit('success')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('Ошибка при сохранении')
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEditing ? 'Редактирование клиента' : 'Добавление клиента'"
    width="500px"
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="ФИО" required>
        <el-input v-model="form.fullName" placeholder="Введите ФИО" />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Отмена</el-button>
        <el-button type="primary" @click="submitForm">
          {{ isEditing ? 'Обновить' : 'Создать' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>