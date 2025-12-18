import {defineStore} from 'pinia'
import {ref} from 'vue'
import type { Booking, BookingDetailedResponse } from '@/types'
import apiClient from '@/api'
import { tr } from 'element-plus/es/locales.mjs'

export const useBookingStore = defineStore('booking', () => {
    const bookings = ref<Booking[]>([])
    const currentBooking = ref<BookingDetailedResponse | null>(null)
    const bookingsDetailed = ref<BookingDetailedResponse[]>([])

    const fetchAllBookings = async () => {
        try {
            const response = await apiClient.get('booking/all')
            bookings.value = response.data
            return bookings.value
        } catch (error) {
            console.error('Fetcging all bookings error: ', error)
            return []
        }
    }

    const fetchAllBookingsDetailed = async () => {
        try {
            const response = await apiClient.get('booking/all/detailed')
            bookingsDetailed.value = response.data
            return bookingsDetailed.value
        } catch (error) {
            console.error('Fetcging all bookings detailed error: ', error)
            return []
        }
    }

    const createBooking = async (booking: Omit<Booking, 'id'>) => {
        try {
        const response = await apiClient.post('/booking', booking)
        return response.data
        } catch (error) {
            console.error('Creating new booking error: ', error)
            throw error
        }
    }

    const updateBooking = async (booking: Booking) => {
        try {
            const response = await apiClient.put('/booking', booking)
            return response.data
        } catch (error){
            console.error('Updating booking error', error)
        }
    }

    const deleteBooking = async (id: number) => {
        try {
            await apiClient.delete(`/booking/${id}`)
        } catch (error) {
            console.error('Deleting booking error: ', error)
        }
    }

    const getBookingDetailed = async(id: number) => {
        try {
            const response = await apiClient.get(`/booking/${id}`)
            currentBooking.value = response.data
            return currentBooking.value
        } catch (error) {
            console.error('Getting booking detailed error: ', error)
        }
    }

    const updateBookingPayment = async (bookingId: number, isPaid: boolean) => {
        try {
            const response = await apiClient.patch(`/booking/${bookingId}/payment`, { isPaid })
            return response.data
            } catch (error) {
                console.error('Error updating payment:', error)
                throw error
                            }
    }

    return {
        bookings,
        currentBooking,
        fetchAllBookings,
        createBooking,
        updateBooking,
        deleteBooking,
        getBookingDetailed,
        fetchAllBookingsDetailed,
        updateBookingPayment
    }
})