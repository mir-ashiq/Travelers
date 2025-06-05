export interface Destination {
  id: number;
  name: string;
  region: string;
  description: string;
  image: string;
  featured: boolean;
}

export const destinations: Destination[] = [
  {
    id: 1,
    name: 'Dal Lake',
    region: 'Kashmir',
    description: 'Known as the "Jewel in the crown of Kashmir", Dal Lake is famous for its houseboats and floating gardens.',
    image: 'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: true
  },
  {
    id: 2,
    name: 'Gulmarg',
    region: 'Kashmir',
    description: 'A premier ski destination with breathtaking meadows, Gulmarg offers stunning views of snow-capped mountains.',
    image: 'https://images.pexels.com/photos/4254554/pexels-photo-4254554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: true
  },
  {
    id: 3,
    name: 'Pangong Lake',
    region: 'Ladakh',
    description: 'This stunning high-altitude lake changes colors throughout the day and is surrounded by barren mountains.',
    image: 'https://images.pexels.com/photos/37057/scooter-india-nomad-landscape.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: true
  },
  {
    id: 4,
    name: 'Nubra Valley',
    region: 'Ladakh',
    description: 'Known for its orchards, rare double-humped camels and dramatic landscapes.',
    image: 'https://images.pexels.com/photos/9726393/pexels-photo-9726393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: true
  },
  {
    id: 5,
    name: 'Gurez Valley',
    region: 'Gurez',
    description: 'A remote and untouched valley with pristine beauty, traditional villages, and stunning mountain views.',
    image: 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: true
  },
  {
    id: 6,
    name: 'Vaishno Devi',
    region: 'Jammu',
    description: 'One of the most revered Hindu pilgrimage sites, nestled in the Trikuta Mountains.',
    image: 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: true
  },
  {
    id: 7,
    name: 'Sonamarg',
    region: 'Kashmir',
    description: 'Meaning "Meadow of Gold", Sonamarg offers breathtaking vistas of snow-clad mountains and glaciers.',
    image: 'https://images.pexels.com/photos/12918978/pexels-photo-12918978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: false
  },
  {
    id: 8,
    name: 'Leh Palace',
    region: 'Ladakh',
    description: 'A former royal palace with a striking resemblance to the Potala Palace in Tibet.',
    image: 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featured: false
  }
];