<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useCarStore } from '@/stores/carStore'
import { useCarOwnerStore } from '@/stores/carOwnerStore'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { Car, CarOwner } from '@/types'
import { useRouter } from 'vue-router'

interface Props {
  modelValue: boolean
  car?: Car
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'success'])

const carStore = useCarStore()

const dialogVisible = ref(props.modelValue)
const formRef = ref<FormInstance>()
const isEditing = ref(false)
const owners = ref<CarOwner[]>([])

const form = reactive({
  id: 0,
  number: '',
  ownerId: undefined as number | undefined,
})

const rules: FormRules = {
  number: [
    { required: true, message: 'Введите номер автомобиля', trigger: 'blur' },
    { min: 6, message: 'Номер должен быть не менее 6 символов', trigger: 'blur' }
  ],
  ownerId: [
    { required: true, message: 'Введите владельца' }
  ]
}

watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
  if (val && props.car) {
    isEditing.value = true
    form.id = props.car.id
    form.number = props.car.number
    form.ownerId = props.car.owner?.id
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
}

const submitForm = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    const carData = {
      number: form.number.trim(),
      owner: {
        id: form.ownerId!,
        fullName: owners.value.find(o => o.id === form.ownerId)?.fullName || ''
      }
    }

    if (isEditing.value) {
      const updatedCar = { id: form.id, ...carData }
      await carStore.updateCar(updatedCar as Car)
      ElMessage.success('Автомобиль успешно обновлен')
    } else {
      await carStore.createCar(carData)
      ElMessage.success('Автомобиль успешно создан')
    }

    emit('success')
    dialogVisible.value = false
  } catch (error: any) {
    console.error('Error saving car:', error)
    ElMessage.error(error.response?.data?.message || 'Ошибка при сохранении автомобиля')
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEditing ? 'Редактирование автомобиля' : 'Добавление автомобиля'"
    width="500px"
    @closed="resetForm"
  >
    <el-form 
      ref="formRef"
      :model="form" 
      :rules="rules" 
      label-width="120px"
      label-position="top"
    >
      <el-form-item label="Номер автомобиля" prop="number" required>
        <el-input 
          v-model="form.number" 
          placeholder="Например: А123ВС77" 
          maxlength="10"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="Владелец" prop="ownerId" required>
        <el-input 
          v-model="form.ownerId" 
          placeholder="Введите id владельца" 
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">Отмена</el-button>
        <el-button 
          type="primary" 
          @click="submitForm"
          :disabled="!form.ownerId || !form.number.trim()"
        >
          {{ isEditing ? 'Обновить' : 'Создать' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>