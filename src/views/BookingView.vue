<script setup lang="ts">
    import {ref, reactive, onMounted} from 'vue'
    import { useBookingStore } from '@/stores/bookingStore';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import type { Booking, BookingDetailedResponse } from '@/types';

    const bookingStore = useBookingStore()
    const currentBooking = ref<any>(null)
    const searchQuery = ref('')
    const newBooking = reactive({
        carId: 1,
        parkingSpaceId: 1,
        isPaid: false
    })

    const bookingsDetailed = ref<BookingDetailedResponse[]>([])

    onMounted(() => {
        loadBookings()
    })

    const loadBookings = async () => {
        bookingsDetailed.value = await bookingStore.fetchAllBookingsDetailed()
    }

    const createBooking = async () => {
        try {
            await bookingStore.createBooking({ ...newBooking})
            ElMessage.success('Бронирование создано')
            loadBookings()
            newBooking.carId = 1
            newBooking.parkingSpaceId = 1
            newBooking.isPaid = false
        } catch (error) {
            ElMessage.error('Ошибка при создании бронирования')
            console.error(error)
        }
    }

    const togglePayment = async (booking: BookingDetailedResponse) => {
        try {
              await bookingStore.updateBookingPayment(booking.id, !booking.isPaid)
              ElMessage.success('Статус оплаты обновлен')
              loadBookings() 
            } catch (error) {
                ElMessage.error('Ошибка при изменении статуса оплаты')
                console.error('Toggle payment error:', error)
            }
    }

    const deleteBooking = async (id: number) => {
        try {
            await ElMessageBox.confirm('Удалить бронирование?', 'Подтверждение', {type: 'warning'})
            await bookingStore.deleteBooking(id)
            ElMessage.success('Бронирование удалено')
            loadBookings()
        } catch (error) {
            ElMessage.error('Ошибка при удалении')
            console.error(error)
        }
    }

    const searchBooking = async () => {
        if (searchQuery.value) {
               try {
                const id = parseInt(searchQuery.value)
                if(!isNaN(id)) {
                    currentBooking.value = await bookingStore.getBookingDetailed(id)
                }
               } catch (error) {
                ElMessage.error('Бронирование не найдено')
               }
        }
    }

</script>

<template>
  <div>
    <h1>Бронирование и оплата мест</h1>
    
    <div>
      <h3>Создание бронирования</h3>
      <el-form :model="newBooking" label-width="200px" style="max-width: 600px">
        <el-form-item label="ID автомобиля">
          <el-input v-model="newBooking.carId"/>
        </el-form-item>
        <el-form-item label="ID парковочного места">
          <el-input v-model="newBooking.parkingSpaceId"/>
        </el-form-item>
        <el-form-item label="Оплачено">
          <el-switch v-model="newBooking.isPaid" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createBooking">Создать бронирование</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div>
      <h3>Все бронирования</h3>
      <el-button @click="loadBookings" style="margin-bottom: 20px">Обновить список</el-button>
      
  <el-table :data="bookingsDetailed" style="width: 100%" v-if="bookingsDetailed.length > 0">
  <el-table-column prop="id" label="ID" width="80" />
  
  <!-- Автомобиль -->
  <el-table-column label="Автомобиль" width="350">
    <template #default="scope">
      <div v-if="scope.row.car">
        <div><strong>ID:</strong> {{ scope.row.car.id }}</div>
        <div><strong>Номер:</strong> {{ scope.row.car.number }}</div>
        <div v-if="scope.row.car.owner">
          <strong>Владелец:</strong> {{ scope.row.car.owner.fullName }}
        </div>
      </div>
      <div v-else style="color: grey;">
        Авто не указан
      </div>
    </template>
  </el-table-column>
  
  <!-- Парковочное место -->
  <el-table-column label="Парковочное место" width="180">
    <template #default="scope">
      <div v-if="scope.row.parkingSpace">
        <div><strong>ID:</strong> {{ scope.row.parkingSpace.id }}</div>
        <div><strong>Номер:</strong> {{ scope.row.parkingSpace.number }}</div>
        <div>
          <strong>Доступно:</strong>
          <el-tag :type="scope.row.parkingSpace.isAvailable ? 'success' : 'danger'" size="small">
            {{ scope.row.parkingSpace.isAvailable ? 'Да' : 'Нет' }}
          </el-tag>
        </div>
      </div>
      <div v-else style="color: grey;">
        Место не указано
      </div>
    </template>
  </el-table-column>
  
  <!-- Оплата -->
  <el-table-column label="Оплачено" width="120">
    <template #default="scope">
      <el-tag :type="scope.row.isPaid ? 'success' : 'warning'" size="large">
        {{ scope.row.isPaid ? 'Да' : 'Нет' }}
      </el-tag>
    </template>
  </el-table-column>
  
  <!-- Действия -->
  <el-table-column label="Действия" width="300">
    <template #default="scope">
      <div style="display: flex; gap: 5px;">
        <el-button 
          size="small" 
          :type="scope.row.isPaid ? 'warning' : 'success'"
          @click="togglePayment(scope.row)"
        >
          {{ scope.row.isPaid ? 'Отменить оплату' : 'Отметить оплаченным' }}
        </el-button>
        <el-button 
          size="small" 
          type="danger" 
          @click="deleteBooking(scope.row.id)"
        >
          Удалить
        </el-button>
      </div>
    </template>
  </el-table-column>
</el-table>
      
      <div v-else style="text-align: center; padding: 40px; color: red;">
        <el-icon size="60"><list /></el-icon>
        <p style="margin-top: 10px;">Нет данных о бронированиях</p>
      </div>
    </div>
    
    <div>
      <h3>Показать детали бронирования</h3>
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <el-input 
          v-model="searchQuery" 
          placeholder="Введите ID бронирования" 
          style="width: 300px"
          @keyup.enter="searchBooking"
        />
        <el-button type="primary" @click="searchBooking">Показать</el-button>
      </div>
      
      <div v-if="currentBooking">
        <h4>Детали бронирования</h4>
        <el-descriptions :column="2">
          <el-descriptions-item label="ID">{{ currentBooking.id }}</el-descriptions-item>
          <el-descriptions-item label="Оплачено">
            <el-tag :type="currentBooking.isPaid ? 'success' : 'warning'">
              {{ currentBooking.isPaid ? 'Да' : 'Нет' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Автомобиль">
            {{ currentBooking.car?.number || 'Не указан' }}
          </el-descriptions-item>
          <el-descriptions-item label="Владелец">
            {{ currentBooking.car?.owner?.fullName || 'Не указан' }}
          </el-descriptions-item>
          <el-descriptions-item label="Парковочное место">
            {{ currentBooking.parkingSpace?.number || 'Не указано' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      
      <div v-else-if="searchQuery && !currentBooking" style="text-align: center; padding: 20px; color: gray;">
        <p>Введите ID бронирования для поиска</p>
      </div>
    </div>
  </div>
</template>