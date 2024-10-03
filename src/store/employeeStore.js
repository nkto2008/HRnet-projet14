import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useEmployeeStore = create(
    persist(
        (set) => ({
            employees: [],
            addEmployee: (employee) => set((state) => ({
                employees: [...state.employees, { ...employee, id: Date.now() }]
            })),
            getEmployees: () => set((state) => ({ employees: state.employees })),
        }),
        {
            name: 'employee-storage', // nom de la clé dans le localStorage
            getStorage: () => localStorage, // on utilise le localStorage
        }
    )
)

export default useEmployeeStore;