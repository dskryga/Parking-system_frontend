import {defineStore} from 'pinia'
import {ref} from 'vue'
import type { CarOwner } from '@/types'
import apiClient from '@/api'

export const useCarOwnerStore = defineStore('carOwner', () => {
const carOwners = ref<CarOwner[]>([])
const currentOwner = ref<CarOwner | null>(null)
const searchResult = ref<CarOwner[]>([])

const fetchAllOwners = async () => {
    try {
    const response = await apiClient.get('/car-owner/all')
      carOwners.value = response.data
      return carOwners.value
    } catch(error) {
        console.error('Error fetching carOwners: ', error)
        return []
    }
}

const searchOwners = async (name : string) => {
    try {
        const response = await apiClient.get('/car-owner/search', {
            params : {name}
        })
        searchResult.value = response.data
        return searchResult.value
    } catch(error) {
        console.error('Searching car owners error: ', error)
        return[]
    }
}

const createOwner = async (owner: Omit<CarOwner, 'id'>) => {
    try {
        const response = await apiClient.post('/car-owner', owner)
        return response.data
    } catch (error) {
        console.error('Creating car owner error: ', error)
        throw error
    }
}

const updateOwner = async (owner: CarOwner) => {
    try {
        const response = await apiClient.put('/car-owner', owner)
        return response.data
    } catch (error) {
        console.error('Updating car owner error: ', error)
        throw error
    }
}

const deleteOwner = async (id: number) => {
    try {
        await apiClient.delete(`/car-owner/${id}`)
    } catch (error) {
        console.error('Deleting car owner error: ', error)
    }
}

return {
    carOwners,
    currentOwner,
    searchResult,
    fetchAllOwners,
    searchOwners,
    createOwner,
    updateOwner,
    deleteOwner
}

})