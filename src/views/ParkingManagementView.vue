<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCarOwnerStore } from '@/stores/carOwnerStore'
import { useCarStore } from '@/stores/carStore'
import { useParkingSpaceStore } from '@/stores/parkingSpaceStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import OwnerDialog from '@/components/OwnerDialog.vue'
import CarDialog from '@/components/CarDialog.vue'
import ParkingSpaceDialog from '@/components/ParkingSpaceDialog.vue'
import type { Car, CarOwner, ParkingSpace } from '@/types'

const carOwnerStore = useCarOwnerStore()
const carStore = useCarStore()
const parkingSpaceStore = useParkingSpaceStore()

const activeTab = ref('owners')
const ownerSearch = ref('')
const carSearch = ref('')

const showAddOwnerDialog = ref(false)
const showAddCarDialog = ref(false)
const showAddSpaceDialog = ref(false)

const allOwners = ref<any[]>([])
const searchOwnerResults = ref<any[]>([])

const allCars = ref<any[]>([])
const searchCarResults = ref<any[]>([])

const allSpaces = ref<any[]>([])

const editingOwner = ref<any>(null)
const editingCar = ref<any>(null)
const editingSpace = ref<any>(null)

onMounted(() => {
  loadAllOwners()
  loadAllCars()
  loadAllSpaces()
})

const loadAllOwners = async () => {
  try {
    allOwners.value = await carOwnerStore.fetchAllOwners()
  } catch (error) {
    console.error('Ошибка загрузки клиентов:', error)
    ElMessage.error('Не удалось загрузить клиентов')
  }
}

const searchOwners = async () => {
  if (ownerSearch.value.trim()) {
    searchOwnerResults.value = await carOwnerStore.searchOwners(ownerSearch.value)
  }
}

const loadAllCars = async () => {
  try {
    allCars.value = await carStore.fetchAllCars()
  } catch (error) {
    console.error('Ошибка загрузки автомобилей:', error)
    ElMessage.error('Не удалось загрузить автомобили')
  }
}

const searchCars = async () => {
  if (carSearch.value.trim()) {
    searchCarResults.value = await carStore.searchCars(carSearch.value)
  }
}

const loadAllSpaces = async () => {
  try {
    allSpaces.value = await parkingSpaceStore.fetchParkingSpaces()
  } catch (error) {
    console.error('Ошибка загрузки мест:', error)
  }
}


const editOwner = (owner: CarOwner) => {
  editingOwner.value = owner
  showAddOwnerDialog.value = true
}

const editCar = (car: Car) => {
  editingCar.value = car
  showAddCarDialog.value = true
}

const editSpace = (space: ParkingSpace) => {
  editingSpace.value = space
  showAddSpaceDialog.value = true
}

const deleteOwner = async (id: number) => {
  try {
    await ElMessageBox.confirm('Удалить клиента?', 'Подтверждение', {
      type: 'warning',
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена'
    })
    await carOwnerStore.deleteOwner(id)
    ElMessage.success('Клиент удален')
    loadAllOwners()
  } catch (error) {
    console.log('Удаление отменено')
  }
}

const deleteCar = async (id: number) => {
  try {
    await ElMessageBox.confirm('Удалить автомобиль?', 'Подтверждение', {
      type: 'warning',
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена'
    })
    await carStore.deleteCar(id)
    ElMessage.success('Автомобиль удален')
    loadAllCars()
  } catch (error) {
    console.log('Удаление отменено')
  }
}

const deleteSpace = async (id: number) => {
  try {
    await ElMessageBox.confirm('Удалить парковочное место?', 'Подтверждение', {
      type: 'warning',
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена'
    })
    await parkingSpaceStore.deleteParkingSpace(id)
    ElMessage.success('Парковочное место удалено')
    loadAllSpaces()
  } catch (error) {
    console.log('Удаление отменено')
  }
}


const handleOwnerSuccess = () => {
  showAddOwnerDialog.value = false
  editingOwner.value = null 
  loadAllOwners()
}

const handleCarSuccess = () => {
  showAddCarDialog.value = false
  editingCar.value = null
  loadAllCars()
}

const handleSpaceSuccess = () => {
  showAddSpaceDialog.value = false
  editingSpace.value = null
  loadAllSpaces()
}
</script>

<template>
  <div>
    <h1>Учет мест, автомобилей и клиентов</h1>
    
    <el-tabs v-model="activeTab" type="border-card">
      <!-- Вкладка Клиенты -->
      <el-tab-pane label="Клиенты" name="owners">
        <div>
          <h3>Клиенты</h3>
          
          <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <el-input 
              v-model="ownerSearch" 
              placeholder="Введите имя для поиска" 
              style="width: 300px;"
              @keyup.enter="searchOwners"
            />
            <el-button type="primary" @click="searchOwners">Поиск</el-button>
            <el-button @click="ownerSearch = ''; searchOwnerResults = []">Показать всех</el-button>
            <el-button type="success" @click="showAddOwnerDialog = true">Добавить клиента</el-button>
          </div>
          
          <div v-if="ownerSearch.trim() && searchOwnerResults.length > 0">
            <h4>Результаты поиска:</h4>
            <el-table :data="searchOwnerResults" style="width: 100%; margin-bottom: 20px;">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="fullName" label="ФИО" />
              <el-table-column label="Действия" width="180">
                <template #default="scope">
                  <el-button size="small" @click="editOwner(scope.row)">Редактировать</el-button>
                  <el-button size="small" @click="deleteOwner(scope.row.id)">Удалить</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <div v-if="!ownerSearch.trim() || searchOwnerResults.length === 0">
            <h4>Все клиенты:</h4>
            <el-table :data="allOwners" style="width: 100%">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="fullName" label="ФИО" />
              <el-table-column label="Действия" width="180">
                <template #default="scope">
                  <el-button size="small" @click="editOwner(scope.row)">Редактировать</el-button>
                  <el-button size="small" @click="deleteOwner(scope.row.id)">Удалить</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <div v-if="ownerSearch.trim() && searchOwnerResults.length === 0" style="text-align: center; padding: 40px;">
            <p>Клиенты не найдены</p>
          </div>
        </div>
      </el-tab-pane>
      
      <!-- Вкладка Автомобили -->
      <el-tab-pane label="Автомобили" name="cars">
        <div>
          <h3>Автомобили</h3>
          
          <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <el-input 
              v-model="carSearch" 
              placeholder="Введите номер автомобиля" 
              style="width: 300px;"
              @keyup.enter="searchCars"
            />
            <el-button type="primary" @click="searchCars">Поиск</el-button>
            <el-button @click="carSearch = ''; searchCarResults = []">Показать всех</el-button>
            <el-button type="success" @click="showAddCarDialog = true">Добавить автомобиль</el-button>
          </div>
          
          <div v-if="carSearch.trim() && searchCarResults.length > 0">
            <h4>Результаты поиска:</h4>
            <el-table :data="searchCarResults" style="width: 100%; margin-bottom: 20px;">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="number" label="Номер" />
              <el-table-column prop="owner.fullName" label="Владелец" />
              <el-table-column label="Действия" width="180">
                <template #default="scope">
                  <el-button size="small" @click="editCar(scope.row)">Редактировать</el-button>
                  <el-button size="small" @click="deleteCar(scope.row.id)">Удалить</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <div v-if="!carSearch.trim() || searchCarResults.length === 0">
            <h4>Все автомобили:</h4>
            <el-table :data="allCars" style="width: 100%">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="number" label="Номер" />
              <el-table-column prop="owner.fullName" label="Владелец" />
              <el-table-column label="Действия" width="180">
                <template #default="scope">
                  <el-button size="small" @click="editCar(scope.row)">Редактировать</el-button>
                  <el-button size="small" @click="deleteCar(scope.row.id)">Удалить</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <div v-if="carSearch.trim() && searchCarResults.length === 0" style="text-align: center; padding: 40px;">
            <p>Автомобили не найдены</p>
          </div>
        </div>
      </el-tab-pane>
      
      <!-- Вкладка Парковочные места -->
      <el-tab-pane label="Парковочные места" name="spaces">
        <div class="section">
          <h3>Парковочные места</h3>
          
          <div style="margin-bottom: 20px;">
            <el-button type="success" @click="showAddSpaceDialog = true">Добавить место</el-button>
          </div>
          
          <h4>Все места:</h4>
          <el-table :data="allSpaces" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="number" label="Номер места" />
            <el-table-column prop="isAvailable" label="Доступно" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.isAvailable ? 'success' : 'danger'">
                  {{ scope.row.isAvailable ? 'Да' : 'Нет' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Действия" width="180">
              <template #default="scope">
                <el-button size="small" @click="editSpace(scope.row)">Редактировать</el-button>
                <el-button size="small" @click="deleteSpace(scope.row.id)">Удалить</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <div v-if="allSpaces.length === 0" style="text-align: center; padding: 40px;">
            <p>Нет парковочных мест</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <OwnerDialog 
      v-model="showAddOwnerDialog" 
      :owner="editingOwner"
      @success="handleOwnerSuccess" 
    />
    
    <CarDialog 
      v-model="showAddCarDialog" 
      :car="editingCar"
      @success="handleCarSuccess" 
    />
    
    <ParkingSpaceDialog 
      v-model="showAddSpaceDialog" 
      :parking-space="editingSpace"
      @success="handleSpaceSuccess" 
    />
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 20px;
  color: #1a1c1f;
}

h3 {
  margin-bottom: 15px;
  color: #5a6d92;
}

h4 {
  margin-bottom: 10px;
  color: #4a5261;
}
</style>