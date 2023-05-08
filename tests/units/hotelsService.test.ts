import {
  createEnrollmentMock,
  createHotelMock,
  createHotelWithRoomMock,
  createTicketWithTicketType,
} from '../factories';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelRepository from '@/repositories/hotel-repository';
import hotelsService from '@/services/hotels-service';

describe('getHotels', () => {
  it('should return a list of hotels', async () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => createEnrollmentMock());

    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(hotelRepository, 'findHotels').mockImplementationOnce((): any => [createHotelMock()]);

    const result = await hotelsService.getHotels(1);

    expect(result).toEqual([createHotelMock()]);
    expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
    expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
    expect(hotelRepository.findHotels).toBeCalled();
  });

  it('should return notFoundError if there is no enrollment', () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => undefined);

    const promise = hotelsService.getHotels(1);

    expect(promise).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });

  it('should return cannotListHotelsError if there is no ticket', () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => createEnrollmentMock());

    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => undefined);

    const promise = hotelsService.getHotels(1);

    expect(promise).rejects.toEqual({ name: 'CannotListHotelsError', message: 'Cannot list hotels!' });
  });

  it('should return notFoundError if there is no hotel', () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => createEnrollmentMock());

    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(hotelRepository, 'findHotels').mockImplementationOnce((): any => []);

    const promise = hotelsService.getHotels(1);

    expect(promise).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });
});

describe('getHotelsWithRooms', () => {
  it('should return a hotel with rooms', async () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => createEnrollmentMock());

    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(hotelRepository, 'findRoomsByHotelId').mockImplementationOnce((): any => createHotelWithRoomMock());

    const result = await hotelsService.getHotelsWithRooms(1, 1);

    expect(result).toEqual(createHotelWithRoomMock());
    expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
    expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
    expect(hotelRepository.findRoomsByHotelId).toBeCalled();
  });

  it('should return a hotel with rooms', async () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => createEnrollmentMock());

    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(hotelRepository, 'findRoomsByHotelId').mockImplementationOnce((): any => undefined);

    const promise = hotelsService.getHotelsWithRooms(1, 1);

    expect(promise).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });
});
