import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {ParkingSpace} from '@/types'
import apiClient from '@/api'

export const useParkingSpaceStore = defineStore('parkingSpace', () => {
    const parkingSpaces = ref<ParkingSpace[]>([])
    const currentSpace = ref<ParkingSpace | null>(null)

    const fetchParkingSpaces = async () => {
        try {
            const response = await apiClient.get('/parking-space/all')
            parkingSpaces.value = response.data
            return parkingSpaces.value
        } catch (error) {
            console.error('Fetching all spaces error: ', error)
            return []
        }
    }

    const createParkingSpace = async (space: Omit<ParkingSpace, 'id'>) => {
        try {
            const response = await apiClient.post('/parking-space', space)
            return response.data
        } catch (error) {
            console.error('Creating parking spacer error: ', error)
            throw error
        }
    }

    const updateParkingSpace = async (space: ParkingSpace) => {
        try {
            const response = await apiClient.put('/parking-space', space)
            return response.data
        } catch (error) {
            console.error('Updatin parking space error: ', error)
        }
    }

    const deleteParkingSpace = async (id: number) => {
        try{
            await apiClient.delete(`/parking-space/${id}`)
        } catch (error) {
            console.log('Deleting parking space error: ', error)
        }
    }

    return {
        parkingSpaces,
        currentSpace,
        fetchParkingSpaces,
        createParkingSpace,
        updateParkingSpace,
        deleteParkingSpace
    }
})