export const fallbackAnimals = [
  {
    id: 1,
    name: 'Shurjo',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Bengal_tiger_in_Sanjay_Dubri_Tiger_Reserve_December_2024_by_Tisha_Mukherjee_11.jpg/960px-Bengal_tiger_in_Sanjay_Dubri_Tiger_Reserve_December_2024_by_Tisha_Mukherjee_11.jpg',
    healthStatus: 'HEALTHY',
    dob: '2017-03-12T00:00:00.000Z',
    species: {
      name: 'Bengal Tiger',
      dietType: 'CARNIVORE',
      habitat: 'Tropical forest and mangrove edges',
      description: 'A flagship South Asian big cat and one of the most popular learning exhibits.',
    },
    zone: { name: 'Tiger Trail' },
    feedingSchedules: [{ time: '08:30', frequency: 'Daily', quantity: '7 kg', foodItem: { name: 'Beef' } }],
  },
  {
    id: 2,
    name: 'Megh',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Elephas_maximus_%28Bandipur%29.jpg/960px-Elephas_maximus_%28Bandipur%29.jpg',
    healthStatus: 'HEALTHY',
    dob: '2011-02-09T00:00:00.000Z',
    species: {
      name: 'Asian Elephant',
      dietType: 'HERBIVORE',
      habitat: 'Open grassland with shaded water access',
      description: 'Large social herbivore known for intelligence, memory, and family groups.',
    },
    zone: { name: 'Elephant Meadow' },
    feedingSchedules: [{ time: '10:00', frequency: 'Daily', quantity: '30 kg', foodItem: { name: 'Bamboo' } }],
  },
  {
    id: 3,
    name: 'Ruby',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Ara_macao%2C_Ara_ararauna_and_Ara_militaris.jpg',
    healthStatus: 'HEALTHY',
    dob: '2020-03-19T00:00:00.000Z',
    species: {
      name: 'Aviary Bird',
      dietType: 'OMNIVORE',
      habitat: 'Aviary trees, ponds, and nesting spaces',
      description: 'Bird collection highlighting migration, feathers, color, and flight.',
    },
    zone: { name: 'Aviary Garden' },
    feedingSchedules: [{ time: '08:15', frequency: 'Daily', quantity: '2 kg', foodItem: { name: 'Seeds' } }],
  },
]

export const fallbackZones = [
  { id: 1, name: 'Tiger Trail', capacity: 420, description: 'Leafy big-cat habitat with shaded family viewing.', _count: { animals: 3 } },
  { id: 2, name: 'Elephant Meadow', capacity: 520, description: 'Keeper-talk meadow for large herbivores.', _count: { animals: 2 } },
  { id: 3, name: 'Aviary Garden', capacity: 450, description: 'Colorful bird route with quiet learning corners.', _count: { animals: 5 } },
]
