<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useParkingSpaceStore } from '@/stores/parkingSpaceStore'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { ParkingSpace } from '@/types'

interface Props {
  modelValue: boolean
  parkingSpace?: ParkingSpace
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'success'])

const parkingSpaceStore = useParkingSpaceStore()

const dialogVisible = ref(props.modelValue)
const formRef = ref<FormInstance>()
const isEditing = ref(false)
const submitting = ref(false)

const form = reactive({
  id: 0,
  number: '',
  isAvailable: true
})

const rules: FormRules = {
  number: [
    { required: true, message: 'Введите номер места', trigger: 'blur' }
  ]
}

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
  if (val && props.parkingSpace) {
    isEditing.value = true
    form.id = props.parkingSpace.id
    form.number = props.parkingSpace.number
    form.isAvailable = props.parkingSpace.isAvailable
  } else if (val) {
    resetForm()
  }
})

watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    resetForm()
  }
})

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  isEditing.value = false
  submitting.value = false
}

const submitForm = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  submitting.value = true

  try {
    const spaceData = {
      number: form.number.trim(),
      isAvailable: form.isAvailable
    }
    
    console.log('Отправляемые данные нового Parking Space:', spaceData)
    if (isEditing.value) {
      const updatedSpace = { id: form.id, ...spaceData }
      await parkingSpaceStore.updateParkingSpace(updatedSpace as ParkingSpace)
      ElMessage.success('Парковочное место успешно обновлено')
    } else {
      await parkingSpaceStore.createParkingSpace(spaceData)
      ElMessage.success('Парковочное место успешно создано')
    }

    emit('success')
    dialogVisible.value = false
  } catch (error: any) {
    console.error('Error saving parking space:', error)
    ElMessage.error(error.response?.data?.message || 'Ошибка при сохранении парковочного места')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEditing ? 'Редактирование парковочного места' : 'Добавление парковочного места'"
    width="450px"
    @closed="resetForm"
  >
    <el-form 
      ref="formRef"
      :model="form" 
      :rules="rules" 
      label-width="140px"
      label-position="top"
    >
      <el-form-item label="Номер места" prop="number" required>
        <el-input 
          v-model="form.number" 
          placeholder="Например: A-01, B-12, или просто номер" 
          maxlength="5"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="Доступность места" prop="isAvailable">
        <el-switch
          v-model="form.isAvailable"
          active-text="Доступно"
          inactive-text="Занято"
          :active-value="true"
          :inactive-value="false"
          style="--el-switch-on-color: green; --el-switch-off-color: red;"
        />
      </el-form-item>

      <el-form-item label="ID места" v-if="isEditing">
        <el-text type="info" size="small">
          ID: {{ form.id }}
        </el-text>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Отмена</el-button>
        <el-button 
          type="primary" 
          @click="submitForm"
          :loading="submitting"
          :disabled="!form.number.trim()"
        >
          {{ isEditing ? 'Обновить' : 'Создать' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>