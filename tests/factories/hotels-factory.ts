import faker from '@faker-js/faker';
import { prisma } from '@/config';

//Sabe criar objetos - Hotel do banco
export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '1020',
      capacity: 3,
      hotelId: hotelId,
    },
  });
}

export function createHotelMock() {
  return {
    id: 1,
    name: '1020',
    image: 'imageurl.com',
  };
}

export function createRoomMock() {
  return {
    id: 1,
    name: '1020',
    capacity: 3,
    hotelId: 1,
  };
}

export function createHotelWithRoomMock() {
  return {
    id: 1,
    name: '1020',
    image: 'imageurl.com',
    Rooms: [
      {
        id: 1,
        name: '1020',
        capacity: 3,
        hotelId: 1,
      },
    ],
  };
}
