// Ghana regions with their major cities
export const GHANA_REGIONS = [
  {
    id: 'ashanti',
    name: 'Ashanti Region',
    capital: 'Kumasi',
    cities: ['Kumasi', 'Obuasi', 'Ejisu', 'Bekwai', 'Akropong'],
  },
  {
    id: 'central',
    name: 'Central Region',
    capital: 'Cape Coast',
    cities: ['Cape Coast', 'Sekondi', 'Takoradi', 'Winneba', 'Dunkwa'],
  },
  {
    id: 'eastern',
    name: 'Eastern Region',
    capital: 'Koforidua',
    cities: ['Koforidua', 'Akim Oda', 'Nkawkaw', 'Aburi', 'Begoro'],
  },
  {
    id: 'greater_accra',
    name: 'Greater Accra Region',
    capital: 'Accra',
    cities: ['Accra', 'Tema', 'Kaneshie', 'Legon', 'Dansoman'],
  },
  {
    id: 'northern',
    name: 'Northern Region',
    capital: 'Tamale',
    cities: ['Tamale', 'Kumbungu', 'Savelugu', 'Gushegu', 'Nalerigu'],
  },
  {
    id: 'north_east',
    name: 'North East Region',
    capital: 'Nalerigu',
    cities: ['Nalerigu', 'Bawku', 'Bolgatanga', 'Gowrie', 'Gambaga'],
  },
  {
    id: 'savannah',
    name: 'Savannah Region',
    capital: 'Damongo',
    cities: ['Damongo', 'Sawla', 'Funsi', 'Busunu', 'Laribanga'],
  },
  {
    id: 'upper_east',
    name: 'Upper East Region',
    capital: 'Bolgatanga',
    cities: ['Bolgatanga', 'Navrongo', 'Bawku', 'Kandiga', 'Paga'],
  },
  {
    id: 'upper_west',
    name: 'Upper West Region',
    capital: 'Wa',
    cities: ['Wa', 'Lawra', 'Nadowli', 'Nandom', 'Hamile'],
  },
  {
    id: 'oti',
    name: 'Oti Region',
    capital: 'Dambai',
    cities: ['Dambai', 'Krachi', 'Nkwanta', 'Jasikan', 'Kadjebi'],
  },
  {
    id: 'western',
    name: 'Western Region',
    capital: 'Sekondi-Takoradi',
    cities: ['Sekondi', 'Takoradi', 'Tarkwa', 'Prestea', 'Enchi'],
  },
  {
    id: 'western_north',
    name: 'Western North Region',
    capital: 'Sefwi-Wiawso',
    cities: ['Sefwi-Wiawso', 'Juaso', 'Acherensua', 'Bia', 'Wassa'],
  },
  {
    id: 'ahafo',
    name: 'Ahafo Region',
    capital: 'Goaso',
    cities: ['Goaso', 'Duayaw Nkwanta', 'Bechem', 'Kenyasi', 'Hwidiem'],
  },
  {
    id: 'bono',
    name: 'Bono Region',
    capital: 'Sunyani',
    cities: ['Sunyani', 'Berekum', 'Dormaa Ahenkro', 'Wenchi', 'Sampa'],
  },
  {
    id: 'bono_east',
    name: 'Bono East Region',
    capital: 'Techiman',
    cities: ['Techiman', 'Kintampo', 'Nkoranza', 'Yeji', 'Atebubu'],
  },
  {
    id: 'volta',
    name: 'Volta Region',
    capital: 'Ho',
    cities: ['Ho', 'Hohoe', 'Kpando', 'Aflao', 'Sogakope'],
  },
];

export const GHANA_CITIES = GHANA_REGIONS.flatMap(region =>
  region.cities.map(city => ({
    city,
    region: region.name,
    regionId: region.id,
  }))
);

export const getRegionById = (regionId: string) =>
  GHANA_REGIONS.find(r => r.id === regionId);

export const getCitiesByRegion = (regionId: string) => {
  const region = getRegionById(regionId);
  return region?.cities || [];
};
