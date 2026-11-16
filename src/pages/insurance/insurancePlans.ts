export type InsurancePlan = {
  id: string
  name: string
  medicalLimit: number
  price: number
  coverage: string[]
  detailsCoverage: string[]
  description: string
}

export const insurancePlans: InsurancePlan[] = [
  {
    id: 'basic',
    name: 'Базовая защита',
    medicalLimit: 3000000,
    price: 1490,
    coverage: ['Врач и лекарства', 'Багаж'],
    detailsCoverage: ['Врач и лекарства', 'Багаж до 40 000 ₽', 'Экстренная стоматология'],
    description:
      'Не покрываются хронические заболевания, алкогольное опьянение и занятия экстремальным спортом.',
  },
  {
    id: 'extended',
    name: 'Расширенная защита',
    medicalLimit: 6000000,
    price: 2990,
    coverage: ['Врач и лекарства', 'Багаж'],
    detailsCoverage: ['Врач и лекарства', 'Багаж'],
    description: 'Условия покрытия и исключения уточняются.',
  },
]
