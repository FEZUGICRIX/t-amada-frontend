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
    medicalLimit: 600000,
    price: 75,
    coverage: ['Врач и лекарства'],
    detailsCoverage: [
      'Врач и лекарства',
      'Экстренная стоматология',
      'Транспортировка до клиники по медицинским показаниям',
    ],
    description:
      'Не покрываются расходы на лечение хронических заболеваний, случаи, связанные с алкогольным опьянением, и травмы при занятиях экстремальным спортом.',
  },
  {
    id: 'extended',
    name: 'Расширенная защита',
    medicalLimit: 1000000,
    price: 90,
    coverage: ['Врач и лекарства', 'Задержка рейса от 2 часов'],
    detailsCoverage: [
      'Врач и лекарства',
      'Экстренная стоматология',
      'Транспортировка до клиники по медицинским показаниям',
      'Задержка рейса от 2 часов',
    ],
    description:
      'Не покрываются расходы на лечение хронических заболеваний, случаи, связанные с алкогольным опьянением, и травмы при занятиях экстремальным спортом.',
  },
]
