export interface CarOwner {
    id: number
    fullName: string
}

export interface Car {
    id: number
    number: string
    owner: CarOwner
}

export interface ParkingSpace {
    id: number
    number: string
    isAvailable: boolean
}

export interface Booking {
    id: number
    carId: number
    parkingSpaceId: number
    isPaid: boolean
}

export interface BookingDetailedResponse extends Booking{
  id: number
  car: Car
  parkingSpace: ParkingSpace
  isPaid: boolean
}

