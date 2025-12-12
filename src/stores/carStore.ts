import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {Car} from '@/types'
import apiClient from '@/api'

export const useCarStore = defineStore('car', () => {
    const cars = ref<Car[]>([])
    const currentCar = ref<Car | null>(null)
    const searchResults = ref<Car[]>([])

    const searchCars = async (number : string) => {
        try {
            const response = await apiClient.get('/car/search', {
                params : {number}
            })
            searchResults.value = response.data
            return searchResults.value
        } catch (error) {
            console.error('Search cars error: ', error)
            return []
        }
    }

    const createCar = async (car: Omit<Car, 'id'>) => {
     try {
        const response = await apiClient.post('/car', car)
        return response.data
     } catch(error) {
        console.log('Creating car error: ', error)
        throw error
     }
    }

    const updateCar = async (car: Car) => {
        try {
            const response = await apiClient.put('/car', car)
            return response.data
        } catch (error) {
            console.error('Updating car error: ', error)
            throw error
        }
    }

    const deleteCar = async (id: number) => {
        try {
            await apiClient.delete('/car/${id}')
        } catch (error) {
            console.error('Deleting car error: ', error)
        }
    }

    return {
        cars,
        currentCar,
        searchResults,
        searchCars,
        createCar,
        updateCar,
        deleteCar
    }
})