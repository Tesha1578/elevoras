import { create } from 'zustand'

// Interfaces
export interface Customer {
  id: string
  name: string
  mobile: string
  flatId: string
  flatNumber: string
  locationId: string
  locationName: string
  vehicleNumber: string
  vehicleType: 'car' | 'bike' | 'both'
  cleanerId: string
  cleanerName: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface Cleaner {
  id: string
  name: string
  employeeId: string
  mobile: string
  photoUrl?: string
  assignedFlats: string[]
  assignedFlatCount: number
  status: 'active' | 'inactive' | 'on_leave'
  washesToday: number
  createdAt: string
}

export interface Flat {
  id: string
  flatNumber: string
  locationId: string
  locationName: string
  customerId?: string
  customerName?: string
  cleanerId?: string
  cleanerName?: string
  status: 'occupied' | 'vacant' | 'inactive'
}

export interface Location {
  id: string
  name: string
  address: string
  totalFlats: number
  occupiedFlats: number
  status: 'active' | 'inactive'
}

export interface Wash {
  id: string
  customerId: string
  customerName: string
  flatId: string
  flatNumber: string
  locationName: string
  cleanerId: string
  cleanerName: string
  startTime: string
  endTime?: string
  duration?: number // minutes
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed'
  imageUrl?: string
  rating?: number
  review?: string
  paymentAmount: number
  paymentStatus: 'pending' | 'success' | 'failed' | 'refunded'
}

export interface Attendance {
  id: string
  cleanerId: string
  cleanerName: string
  date: string
  checkIn: string
  checkOut?: string
  hoursWorked?: number
  status: 'present' | 'late' | 'absent' | 'on_leave'
}

export interface Payment {
  id: string
  transactionId: string
  customerId: string
  customerName: string
  amount: number
  type: 'per_wash' | 'wallet'
  status: 'pending' | 'success' | 'failed' | 'refunded'
  date: string
  washId?: string
  invoiceUrl?: string
}

export interface Review {
  id: string
  washId: string
  customerId: string
  customerName: string
  cleanerId: string
  cleanerName: string
  rating: number
  review: string
  date: string
}

export interface Settings {
  businessName: string
  logoUrl?: string
  defaultCheckInTime: string
  defaultLateThreshold: string
  currency: string
  timezone: string
  gatewayMode: 'sandbox' | 'production'
  emailNotificationsEnabled: boolean
  smsNotificationsEnabled: boolean
}

interface MockStoreState {
  locations: Location[]
  flats: Flat[]
  cleaners: Cleaner[]
  customers: Customer[]
  washes: Wash[]
  attendance: Attendance[]
  payments: Payment[]
  reviews: Review[]
  settings: Settings
  currentAdmin: { name: string; email: string; role: 'Super Admin' | 'Manager' | 'Viewer' } | null
  
  // Actions
  login: (email: string, password: string) => boolean
  logout: () => void
  
  // Customers CRUD
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  
  // Cleaners CRUD
  addCleaner: (cleaner: Omit<Cleaner, 'id' | 'createdAt' | 'assignedFlatCount' | 'washesToday' | 'assignedFlats'>) => void
  updateCleaner: (id: string, cleaner: Partial<Cleaner>) => void
  deleteCleaner: (id: string) => void
  
  // Locations & Flats
  addLocation: (location: Omit<Location, 'id' | 'occupiedFlats'>) => void
  updateLocation: (id: string, location: Partial<Location>) => void
  deleteLocation: (id: string) => void
  assignCleanerToFlat: (flatId: string, cleanerId: string) => void
  assignCustomerToFlat: (flatId: string, customerId: string) => void
  
  // Washes Actions
  scheduleWash: (wash: Omit<Wash, 'id' | 'status' | 'paymentStatus'>) => void
  startWash: (washId: string) => void
  completeWash: (washId: string, imageUrl: string) => void
  failWash: (washId: string) => void
  rateWash: (washId: string, rating: number, reviewText: string) => void
  
  // Attendance
  clockInCleaner: (cleanerId: string, checkInTime?: string) => void
  clockOutCleaner: (cleanerId: string, checkOutTime?: string) => void
  updateAttendanceStatus: (id: string, status: Attendance['status']) => void
  
  // Payments
  addPayment: (payment: Omit<Payment, 'id' | 'transactionId' | 'date'>) => void
  processRefund: (paymentId: string) => void
  
  // Settings
  updateSettings: (settings: Partial<Settings>) => void

  // Theme Toggle
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

// Helper: Generate date string relative to today
const getRelativeDateString = (daysOffset: number, hoursOffset: number = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + daysOffset)
  d.setHours(d.getHours() + hoursOffset)
  return d.toISOString()
}

// Programmatic Seed Data Generators
const mockLocations: Location[] = [
  { id: 'loc-1', name: 'Prestige Shantiniketan', address: 'ITPL Main Road, Whitefield, Bangalore', totalFlats: 120, occupiedFlats: 22, status: 'active' },
  { id: 'loc-2', name: 'DLF Gardencity', address: 'OMR Road, Semmancheri, Chennai', totalFlats: 200, occupiedFlats: 18, status: 'active' },
  { id: 'loc-3', name: 'Hiranandani Parks', address: 'Oragadam, Chennai', totalFlats: 150, occupiedFlats: 15, status: 'active' },
]

const mockCleaners: Cleaner[] = [
  { id: 'cl-1', name: 'Ramesh Kumar', employeeId: 'ELV-CLN-001', mobile: '9840123456', status: 'active', assignedFlats: ['f-1', 'f-4', 'f-7'], assignedFlatCount: 3, washesToday: 2, createdAt: getRelativeDateString(-90) },
  { id: 'cl-2', name: 'Suresh Pillai', employeeId: 'ELV-CLN-002', mobile: '9840123457', status: 'active', assignedFlats: ['f-2', 'f-5', 'f-8'], assignedFlatCount: 3, washesToday: 1, createdAt: getRelativeDateString(-85) },
  { id: 'cl-3', name: 'Anbu Chezhian', employeeId: 'ELV-CLN-003', mobile: '9840123458', status: 'active', assignedFlats: ['f-3', 'f-6', 'f-9'], assignedFlatCount: 3, washesToday: 0, createdAt: getRelativeDateString(-70) },
  { id: 'cl-4', name: 'Ganesh Murugan', employeeId: 'ELV-CLN-004', mobile: '9840123459', status: 'active', assignedFlats: [], assignedFlatCount: 0, washesToday: 0, createdAt: getRelativeDateString(-60) },
  { id: 'cl-5', name: 'Selvam R.', employeeId: 'ELV-CLN-005', mobile: '9840123460', status: 'on_leave', assignedFlats: [], assignedFlatCount: 0, washesToday: 0, createdAt: getRelativeDateString(-50) },
  { id: 'cl-6', name: 'Mani K.', employeeId: 'ELV-CLN-006', mobile: '9840123461', status: 'active', assignedFlats: [], assignedFlatCount: 0, washesToday: 1, createdAt: getRelativeDateString(-45) },
  { id: 'cl-7', name: 'Arun Mozhi', employeeId: 'ELV-CLN-007', mobile: '9840123462', status: 'active', assignedFlats: [], assignedFlatCount: 0, washesToday: 2, createdAt: getRelativeDateString(-30) },
  { id: 'cl-8', name: 'Karthik S.', employeeId: 'ELV-CLN-008', mobile: '9840123463', status: 'inactive', assignedFlats: [], assignedFlatCount: 0, washesToday: 0, createdAt: getRelativeDateString(-25) },
  { id: 'cl-9', name: 'Murugan P.', employeeId: 'ELV-CLN-009', mobile: '9840123464', status: 'active', assignedFlats: [], assignedFlatCount: 0, washesToday: 0, createdAt: getRelativeDateString(-15) },
  { id: 'cl-10', name: 'Prakash R.', employeeId: 'ELV-CLN-010', mobile: '9840123465', status: 'active', assignedFlats: [], assignedFlatCount: 0, washesToday: 0, createdAt: getRelativeDateString(-10) }
]

// Pre-fill flats across locations
const mockFlats: Flat[] = []
mockLocations.forEach(loc => {
  const blocks = ['A', 'B', 'C', 'D']
  blocks.forEach(block => {
    for (let floor = 1; floor <= 4; floor++) {
      for (let door = 1; door <= 4; door++) {
        const flatNumber = `${block}-${floor}0${door}`
        const id = `f-${loc.id}-${flatNumber}`
        mockFlats.push({
          id,
          flatNumber,
          locationId: loc.id,
          locationName: loc.name,
          status: 'vacant'
        })
      }
    }
  })
})

// Generate 55 customers
const firstNames = ['Amit', 'Vijay', 'Rajesh', 'Siddharth', 'Arjun', 'Priya', 'Deepa', 'Srinivasan', 'Harish', 'Nandini', 'Rohan', 'Sneha', 'Karan', 'Vikram', 'Divya', 'Ketan', 'Pranav', 'Lakshmi', 'Nitin', 'Rahul']
const lastNames = ['Sharma', 'Verma', 'Nair', 'Iyer', 'Patel', 'Reddy', 'Rao', 'Joshi', 'Gupta', 'Choudhury', 'Mehta', 'Kulkarni', 'Subramanian', 'Pillai', 'Raman', 'Kumar', 'Singh', 'Deshmukh', 'Das', 'Sen']
const mockCustomers: Customer[] = []
for (let i = 1; i <= 55; i++) {
  const locationIdx = i % 3
  const location = mockLocations[locationIdx]
  
  // Find vacant flat in location
  const flat = mockFlats.find(f => f.locationId === location.id && f.status === 'vacant')
  const flatNumber = flat ? flat.flatNumber : `A-10${i}`
  const flatId = flat ? flat.id : `f-${location.id}-${flatNumber}`
  
  const firstName = firstNames[i % firstNames.length]
  const lastName = lastNames[(i * 3) % lastNames.length]
  const name = `${firstName} ${lastName}`
  const mobile = `9884${String(i).padStart(6, '0')}`
  
  const vType = i % 5 === 0 ? 'both' : i % 3 === 0 ? 'bike' : 'car'
  const vehicleNumber = `${locationIdx === 0 ? 'KA' : 'TN'}-0${5 + locationIdx}-${blockCode(i)}-${1000 + i}`
  
  const cleanerIdx = i % 4 // distribute among active cleaners 1-4
  const cleaner = mockCleaners[cleanerIdx]
  
  const customer: Customer = {
    id: `cust-${i}`,
    name,
    mobile,
    flatId,
    flatNumber,
    locationId: location.id,
    locationName: location.name,
    vehicleNumber,
    vehicleType: vType,
    cleanerId: cleaner.id,
    cleanerName: cleaner.name,
    status: i === 55 ? 'inactive' : 'active',
    createdAt: getRelativeDateString(-30 + (i % 20))
  }
  
  mockCustomers.push(customer)
  
  // update flat status
  if (flat) {
    flat.status = 'occupied'
    flat.customerId = customer.id
    flat.customerName = customer.name
    flat.cleanerId = cleaner.id
    flat.cleanerName = cleaner.name
  }
  
  // append flatId to cleaner assigned flats
  if (cleaner && !cleaner.assignedFlats.includes(flatId)) {
    cleaner.assignedFlats.push(flatId)
    cleaner.assignedFlatCount = cleaner.assignedFlats.length
  }
}

function blockCode(num: number) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return letters[num % 26] + letters[(num + 7) % 26]
}

// Generate 200+ Wash History spanning 14 days
const mockWashes: Wash[] = []
const mockPayments: Payment[] = []
const mockReviews: Review[] = []

const reviewTexts = [
  'Excellent wash. Very clean!',
  'Cleaned all the dust. Prompt completion.',
  'Decent job, but left some dirt on the back windshield.',
  'Fantastic service, the tire dressing was great!',
  'Wash was late but quality was excellent.',
  'Satisfied with the service, very quick.',
  'Spotless cleaning inside-out. Thanks Ramesh!',
  'Very professional and clean finish.',
  'Got proof photo immediately, highly convenient.',
  'Excellent community car wash platform.'
]

let washIdCounter = 1
let txIdCounter = 1

for (let day = -14; day <= 0; day++) {
  // Washes per day (around 15 washes per day)
  const isToday = day === 0
  const washesTodayCount = isToday ? 8 : 15 + (day % 3)
  
  for (let w = 1; w <= washesTodayCount; w++) {
    const custIdx = (Math.abs(day) * w + w) % mockCustomers.length
    const customer = mockCustomers[custIdx]
    if (customer.status === 'inactive') continue
    
    const cleaner = mockCleaners.find(c => c.id === customer.cleanerId) || mockCleaners[0]
    
    // Status distribution
    let status: Wash['status'] = 'completed'
    let paymentStatus: Wash['paymentStatus'] = 'success'
    let rating: number | undefined = undefined
    let review: string | undefined = undefined
    
    if (isToday) {
      if (w === 1) {
        status = 'in_progress'
        paymentStatus = 'pending'
      } else if (w === 2) {
        status = 'scheduled'
        paymentStatus = 'pending'
      } else if (w === 3) {
        status = 'failed'
        paymentStatus = 'failed'
      }
    } else {
      if (w % 15 === 0) {
        status = 'failed'
        paymentStatus = 'failed'
      } else if (w % 20 === 0) {
        status = 'completed'
        paymentStatus = 'refunded'
      }
    }
    
    // Ratings for completed/refunded
    if (status === 'completed' && w % 2 === 0) {
      rating = 4 + (w % 2) // 4 or 5 stars
      if (w % 6 === 0) rating = 3 // occasional 3 star
      review = reviewTexts[w % reviewTexts.length]
    }
    
    const startTime = getRelativeDateString(day, 6 + (w % 4))
    const endTime = status === 'completed' ? getRelativeDateString(day, 6 + (w % 4) + 0.5) : undefined
    const duration = status === 'completed' ? 20 + (w % 15) : undefined
    
    const washAmount = customer.vehicleType === 'both' ? 150 : customer.vehicleType === 'car' ? 100 : 60
    
    // Image proof for completed washes
    const imageUrl = status === 'completed'
      ? `https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=60`
      : undefined
      
    const wash: Wash = {
      id: `w-${washIdCounter++}`,
      customerId: customer.id,
      customerName: customer.name,
      flatId: customer.flatId,
      flatNumber: customer.flatNumber,
      locationName: customer.locationName,
      cleanerId: cleaner.id,
      cleanerName: cleaner.name,
      startTime,
      endTime,
      duration,
      status,
      imageUrl,
      rating,
      review,
      paymentAmount: washAmount,
      paymentStatus
    }
    
    mockWashes.push(wash)
    
    // Create matching payment transactions
    const paymentType = w % 4 === 0 ? 'wallet' : 'per_wash'
    const payId = `tx-${txIdCounter++}`
    const pay: Payment = {
      id: payId,
      transactionId: `TXN${String(txIdCounter).padStart(8, '0')}`,
      customerId: customer.id,
      customerName: customer.name,
      amount: washAmount,
      type: paymentType,
      status: paymentStatus,
      date: startTime,
      washId: wash.id,
      invoiceUrl: status === 'completed' ? `/invoices/INV-${payId}.pdf` : undefined
    }
    mockPayments.push(pay)
    
    // Create reviews
    if (rating && review) {
      mockReviews.push({
        id: `rev-${washIdCounter}`,
        washId: wash.id,
        customerId: customer.id,
        customerName: customer.name,
        cleanerId: cleaner.id,
        cleanerName: cleaner.name,
        rating,
        review,
        date: startTime
      })
    }
  }
}

// Generate Attendance Logs (Past 14 days for all 10 cleaners)
const mockAttendance: Attendance[] = []
let attCounter = 1
for (let day = -14; day <= 0; day++) {
  const dateStr = new Date()
  dateStr.setDate(dateStr.getDate() + day)
  const dateFormatted = dateStr.toISOString().split('T')[0]
  
  mockCleaners.forEach(cleaner => {
    if (cleaner.status === 'inactive') return
    
    // Ramesh, Suresh, Anbu have stable attendance. Others vary.
    let attStatus: Attendance['status'] = 'present'
    let checkIn = '07:15 AM'
    let checkOut: string | undefined = '11:45 AM'
    let hoursWorked: number | undefined = 4.5
    
    const random = Math.abs(day * parseInt(cleaner.id.split('-')[1]) + 3)
    
    if (cleaner.status === 'on_leave') {
      attStatus = 'on_leave'
      checkIn = '--'
      checkOut = undefined
      hoursWorked = 0
    } else if (random % 12 === 0) {
      attStatus = 'absent'
      checkIn = '--'
      checkOut = undefined
      hoursWorked = 0
    } else if (random % 8 === 0) {
      attStatus = 'late'
      checkIn = '09:45 AM'
      checkOut = '01:15 PM'
      hoursWorked = 3.5
    }
    
    // Today's clock-out depends on time
    if (day === 0 && attStatus !== 'absent' && attStatus !== 'on_leave') {
      checkOut = undefined
      hoursWorked = undefined
    }
    
    mockAttendance.push({
      id: `att-${attCounter++}`,
      cleanerId: cleaner.id,
      cleanerName: cleaner.name,
      date: dateFormatted,
      checkIn,
      checkOut,
      hoursWorked,
      status: attStatus
    })
  })
}

// Zustand Core Store
export const useMockStore = create<MockStoreState>((set, get) => ({
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', newTheme)
    set({ theme: newTheme })
  },
  locations: mockLocations,
  flats: mockFlats,
  cleaners: mockCleaners,
  customers: mockCustomers,
  washes: mockWashes.reverse(), // latest first
  attendance: mockAttendance.reverse(),
  payments: mockPayments.reverse(),
  reviews: mockReviews.reverse(),
  settings: {
    businessName: 'SparkleDrop Car Care',
    defaultCheckInTime: '07:30 AM',
    defaultLateThreshold: '09:30 AM',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    gatewayMode: 'sandbox',
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: true
  },
  currentAdmin: {
    name: 'AXOWEB Operator',
    email: 'admin@axoweb.in',
    role: 'Super Admin'
  },
  
  login: (email, password) => {
    if (email === 'admin@axoweb.in' && password === 'admin123') {
      set({
        currentAdmin: {
          name: 'AXOWEB Operator',
          email: 'admin@axoweb.in',
          role: 'Super Admin'
        }
      })
      return true
    }
    return false
  },
  
  logout: () => {
    set({ currentAdmin: null })
  },
  
  addCustomer: (cust) => {
    const newId = `cust-${get().customers.length + 1}`
    const createdAt = new Date().toISOString()
    const newCustomer: Customer = {
      ...cust,
      id: newId,
      createdAt
    }
    
    // Update flats
    const updatedFlats = get().flats.map(f => {
      if (f.id === cust.flatId) {
        return {
          ...f,
          status: 'occupied' as const,
          customerId: newId,
          customerName: cust.name,
          cleanerId: cust.cleanerId,
          cleanerName: cust.cleanerName
        }
      }
      return f
    })
    
    // Update cleaner assignments
    const updatedCleaners = get().cleaners.map(c => {
      if (c.id === cust.cleanerId) {
        const assigned = [...c.assignedFlats, cust.flatId]
        return {
          ...c,
          assignedFlats: assigned,
          assignedFlatCount: assigned.length
        }
      }
      return c
    })
    
    set(state => ({
      customers: [newCustomer, ...state.customers],
      flats: updatedFlats,
      cleaners: updatedCleaners
    }))
  },
  
  updateCustomer: (id, updatedFields) => {
    set(state => {
      const oldCustomer = state.customers.find(c => c.id === id)
      if (!oldCustomer) return state
      
      const updatedCustomer = { ...oldCustomer, ...updatedFields }
      
      // If flat changes or cleaner changes, we sync flat and cleaner lists
      let updatedFlats = [...state.flats]
      let updatedCleaners = [...state.cleaners]
      
      if (updatedFields.flatId && updatedFields.flatId !== oldCustomer.flatId) {
        // Free old flat
        updatedFlats = updatedFlats.map(f => {
          if (f.id === oldCustomer.flatId) {
            return { ...f, status: 'vacant', customerId: undefined, customerName: undefined, cleanerId: undefined, cleanerName: undefined }
          }
          if (f.id === updatedFields.flatId) {
            return {
              ...f,
              status: 'occupied',
              customerId: id,
              customerName: updatedCustomer.name,
              cleanerId: updatedCustomer.cleanerId,
              cleanerName: updatedCustomer.cleanerName
            }
          }
          return f
        })
      }
      
      // Update name on flat
      if (updatedFields.name && updatedFields.name !== oldCustomer.name) {
        updatedFlats = updatedFlats.map(f => {
          if (f.customerId === id) {
            return { ...f, customerName: updatedFields.name }
          }
          return f
        })
      }
      
      // Update cleaner assignment change
      if (updatedFields.cleanerId && updatedFields.cleanerId !== oldCustomer.cleanerId) {
        const newCleaner = state.cleaners.find(c => c.id === updatedFields.cleanerId)
        updatedCustomer.cleanerName = newCleaner ? newCleaner.name : ''
        
        // Remove from old cleaner list
        updatedCleaners = updatedCleaners.map(c => {
          if (c.id === oldCustomer.cleanerId) {
            const assigned = c.assignedFlats.filter(fid => fid !== oldCustomer.flatId)
            return { ...c, assignedFlats: assigned, assignedFlatCount: assigned.length }
          }
          if (c.id === updatedFields.cleanerId) {
            const assigned = [...c.assignedFlats, updatedCustomer.flatId]
            return { ...c, assignedFlats: assigned, assignedFlatCount: assigned.length }
          }
          return c
        })
        
        // Sync flat cleaner details
        updatedFlats = updatedFlats.map(f => {
          if (f.customerId === id) {
            return { ...f, cleanerId: updatedCustomer.cleanerId, cleanerName: updatedCustomer.cleanerName }
          }
          return f
        })
      }
      
      return {
        customers: state.customers.map(c => c.id === id ? updatedCustomer : c),
        flats: updatedFlats,
        cleaners: updatedCleaners
      }
    })
  },
  
  deleteCustomer: (id) => {
    set(state => {
      const customer = state.customers.find(c => c.id === id)
      if (!customer) return state
      
      // Free Flat
      const updatedFlats = state.flats.map(f => {
        if (f.id === customer.flatId) {
          return { ...f, status: 'vacant' as const, customerId: undefined, customerName: undefined, cleanerId: undefined, cleanerName: undefined }
        }
        return f
      })
      
      // Free Cleaner Assigned Flat
      const updatedCleaners = state.cleaners.map(c => {
        if (c.id === customer.cleanerId) {
          const assigned = c.assignedFlats.filter(fid => fid !== customer.flatId)
          return { ...c, assignedFlats: assigned, assignedFlatCount: assigned.length }
        }
        return c
      })
      
      return {
        customers: state.customers.filter(c => c.id !== id),
        flats: updatedFlats,
        cleaners: updatedCleaners
      }
    })
  },
  
  addCleaner: (cleaner) => {
    const newId = `cl-${get().cleaners.length + 1}`
    const newCleaner: Cleaner = {
      ...cleaner,
      id: newId,
      assignedFlats: [],
      assignedFlatCount: 0,
      washesToday: 0,
      createdAt: new Date().toISOString()
    }
    set(state => ({
      cleaners: [...state.cleaners, newCleaner]
    }))
  },
  
  updateCleaner: (id, fields) => {
    set(state => ({
      cleaners: state.cleaners.map(c => c.id === id ? { ...c, ...fields } : c)
    }))
  },
  
  deleteCleaner: (id) => {
    set(state => {
      // Reassign customer cleaner back to null / unassigned
      const updatedCustomers = state.customers.map(cust => {
        if (cust.cleanerId === id) {
          return { ...cust, cleanerId: '', cleanerName: 'Unassigned' }
        }
        return cust
      })
      
      return {
        cleaners: state.cleaners.filter(c => c.id !== id),
        customers: updatedCustomers
      }
    })
  },
  
  addLocation: (loc) => {
    const newId = `loc-${get().locations.length + 1}`
    const newLoc: Location = {
      ...loc,
      id: newId,
      occupiedFlats: 0
    }
    set(state => ({
      locations: [...state.locations, newLoc]
    }))
  },
  
  updateLocation: (id, fields) => {
    set(state => ({
      locations: state.locations.map(l => l.id === id ? { ...l, ...fields } : l)
    }))
  },
  
  deleteLocation: (id) => {
    set(state => ({
      locations: state.locations.filter(l => l.id !== id)
    }))
  },
  
  assignCleanerToFlat: (flatId, cleanerId) => {
    set(state => {
      const cleaner = state.cleaners.find(c => c.id === cleanerId)
      const cleanerName = cleaner ? cleaner.name : 'Unassigned'
      
      // Update flats
      const updatedFlats = state.flats.map(f => {
        if (f.id === flatId) {
          return { ...f, cleanerId, cleanerName }
        }
        return f
      })
      
      // Update customer if occupied
      const updatedCustomers = state.customers.map(c => {
        if (c.flatId === flatId) {
          return { ...c, cleanerId, cleanerName }
        }
        return c
      })
      
      // Update cleaner assignments count
      const updatedCleaners = state.cleaners.map(c => {
        if (c.id === cleanerId && !c.assignedFlats.includes(flatId)) {
          const assigned = [...c.assignedFlats, flatId]
          return { ...c, assignedFlats: assigned, assignedFlatCount: assigned.length }
        }
        // Remove from other cleaners if it was assigned
        if (c.id !== cleanerId && c.assignedFlats.includes(flatId)) {
          const assigned = c.assignedFlats.filter(fid => fid !== flatId)
          return { ...c, assignedFlats: assigned, assignedFlatCount: assigned.length }
        }
        return c
      })
      
      return {
        flats: updatedFlats,
        customers: updatedCustomers,
        cleaners: updatedCleaners
      }
    })
  },
  
  assignCustomerToFlat: (flatId, customerId) => {
    set(state => {
      const customer = state.customers.find(c => c.id === customerId)
      const customerName = customer ? customer.name : ''
      
      const updatedFlats = state.flats.map(f => {
        if (f.id === flatId) {
          return {
            ...f,
            status: (customerId ? 'occupied' : 'vacant') as Flat['status'],
            customerId,
            customerName
          }
        }
        return f
      })
      
      return { flats: updatedFlats }
    })
  },
  
  scheduleWash: (wash) => {
    const newId = `w-${get().washes.length + 100}`
    const newWash: Wash = {
      ...wash,
      id: newId,
      status: 'scheduled',
      paymentStatus: 'pending'
    }
    set(state => ({
      washes: [newWash, ...state.washes]
    }))
  },
  
  startWash: (washId) => {
    set(state => ({
      washes: state.washes.map(w => w.id === washId ? { ...w, status: 'in_progress', startTime: new Date().toISOString() } : w)
    }))
  },
  
  completeWash: (washId, imageUrl) => {
    set(state => {
      const wash = state.washes.find(w => w.id === washId)
      if (!wash) return state
      
      const endTime = new Date().toISOString()
      const diff = Math.round((new Date(endTime).getTime() - new Date(wash.startTime).getTime()) / 60000)
      
      // Create transaction
      const payId = `tx-${state.payments.length + 1}`
      const newPayment: Payment = {
        id: payId,
        transactionId: `TXN${String(state.payments.length + 1).padStart(8, '0')}`,
        customerId: wash.customerId,
        customerName: wash.customerName,
        amount: wash.paymentAmount,
        type: 'per_wash',
        status: 'success',
        date: endTime,
        washId: wash.id,
        invoiceUrl: `/invoices/INV-${payId}.pdf`
      }
      
      // Update cleaner wash count
      const updatedCleaners = state.cleaners.map(c => {
        if (c.id === wash.cleanerId) {
          return { ...c, washesToday: c.washesToday + 1 }
        }
        return c
      })
      
      return {
        washes: state.washes.map(w => w.id === washId ? {
          ...w,
          status: 'completed',
          endTime,
          duration: diff > 0 ? diff : 22,
          imageUrl,
          paymentStatus: 'success'
        } : w),
        payments: [newPayment, ...state.payments],
        cleaners: updatedCleaners
      }
    })
  },
  
  failWash: (washId) => {
    set(state => ({
      washes: state.washes.map(w => w.id === washId ? { ...w, status: 'failed', paymentStatus: 'failed' } : w)
    }))
  },
  
  rateWash: (washId, rating, reviewText) => {
    set(state => {
      const wash = state.washes.find(w => w.id === washId)
      if (!wash) return state
      
      const newReview: Review = {
        id: `rev-${state.reviews.length + 1}`,
        washId,
        customerId: wash.customerId,
        customerName: wash.customerName,
        cleanerId: wash.cleanerId,
        cleanerName: wash.cleanerName,
        rating,
        review: reviewText,
        date: new Date().toISOString()
      }
      
      return {
        washes: state.washes.map(w => w.id === washId ? { ...w, rating, review: reviewText } : w),
        reviews: [newReview, ...state.reviews]
      }
    })
  },
  
  clockInCleaner: (cleanerId, checkInTime) => {
    set(state => {
      const cleaner = state.cleaners.find(c => c.id === cleanerId)
      if (!cleaner) return state
      
      const dateFormatted = new Date().toISOString().split('T')[0]
      const time = checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      
      // check threshold (Late if checked in after defaultLateThreshold = 09:30 AM)
      const isLate = parseInt(time.split(':')[0]) >= 9 && parseInt(time.split(':')[1]) > 30
      
      const newAttendance: Attendance = {
        id: `att-${state.attendance.length + 1}`,
        cleanerId,
        cleanerName: cleaner.name,
        date: dateFormatted,
        checkIn: time,
        status: isLate ? 'late' : 'present'
      }
      
      // Update cleaner status
      const updatedCleaners = state.cleaners.map(c => c.id === cleanerId ? { ...c, status: 'active' as const } : c)
      
      return {
        attendance: [newAttendance, ...state.attendance],
        cleaners: updatedCleaners
      }
    })
  },
  
  clockOutCleaner: (cleanerId, checkOutTime) => {
    set(state => {
      const dateFormatted = new Date().toISOString().split('T')[0]
      const time = checkOutTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      
      const updatedAttendance = state.attendance.map(att => {
        if (att.cleanerId === cleanerId && att.date === dateFormatted) {
          // Calculate hours
          return {
            ...att,
            checkOut: time,
            hoursWorked: 4.5 // static mock average
          }
        }
        return att
      })
      
      return { attendance: updatedAttendance }
    })
  },
  
  updateAttendanceStatus: (id, status) => {
    set(state => ({
      attendance: state.attendance.map(att => att.id === id ? { ...att, status } : att)
    }))
  },
  
  addPayment: (payment) => {
    const payId = `tx-${get().payments.length + 1}`
    const newPayment: Payment = {
      ...payment,
      id: payId,
      transactionId: `TXN${String(get().payments.length + 1).padStart(8, '0')}`,
      date: new Date().toISOString(),
      invoiceUrl: `/invoices/INV-${payId}.pdf`
    }
    set(state => ({
      payments: [newPayment, ...state.payments]
    }))
  },
  
  processRefund: (paymentId) => {
    set(state => {
      const payment = state.payments.find(p => p.id === paymentId)
      if (!payment) return state
      
      // Update transaction status
      const updatedPayments = state.payments.map(p => p.id === paymentId ? { ...p, status: 'refunded' as const } : p)
      
      // Update wash paymentStatus if connected
      const updatedWashes = state.washes.map(w => {
        if (w.id === payment.washId) {
          return { ...w, paymentStatus: 'refunded' as const }
        }
        return w
      })
      
      return {
        payments: updatedPayments,
        washes: updatedWashes
      }
    })
  },
  
  updateSettings: (newSettings) => {
    set(state => ({
      settings: { ...state.settings, ...newSettings }
    }))
  }
}))
