import { createEnrollmentMock, createRoomMock, createTicketWithTicketType } from '../factories';
import { createBookingWithoutDate, getBookingReturn } from '../factories/booking-factory';
import bookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import bookingService from '@/services/booking-service';
import ticketsRepository from '@/repositories/tickets-repository';
import roomRepository from '@/repositories/room-repository';

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('getBooking', () => {
  it('should return booking', async () => {
    jest.spyOn(bookingRepository, 'findByUserId').mockImplementationOnce((): any => createBookingWithoutDate());

    const result = await bookingService.getBooking(1);
    expect(result).toEqual(createBookingWithoutDate());
  });

  it('should throw notFoundError', async () => {
    jest.spyOn(bookingRepository, 'findByUserId').mockImplementationOnce((): any => undefined);

    const promise = bookingService.getBooking(1);

    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});

describe('bookingRoomById', () => {
  it('should create booking', async () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => createEnrollmentMock());

    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => createRoomMock());

    jest.spyOn(bookingRepository, 'findByRoomId').mockImplementationOnce((): any => []);

    jest.spyOn(bookingRepository, 'create').mockImplementationOnce((): any => createBookingWithoutDate());

    const result = await bookingService.bookingRoomById(1, 1);

    expect(result).toEqual(createBookingWithoutDate());
    expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
    expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
    expect(roomRepository.findById).toBeCalled();
    expect(bookingRepository.findByRoomId).toBeCalled();
    expect(bookingRepository.create).toBeCalled();
  });

  it('should responde badRequestError if there is no roomId', () => {
    const promise = bookingService.bookingRoomById(1, 0);

    expect(promise).rejects.toEqual({
      name: 'BadRequestError',
      message: 'Bad Request Error!',
    });
  });

  it('should responde cannotBookingError if there is no enrollment', () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => undefined);

    const promise = bookingService.bookingRoomById(1, 1);

    expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
    expect(promise).rejects.toEqual({
      name: 'CannotBookingError',
      message: 'Cannot booking this room! Overcapacity!',
    });
  });

  it('should responde cannotBookingError if there is no ticket', () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => createEnrollmentMock());

    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => undefined);

    const promise = bookingService.bookingRoomById(1, 1);

    expect(promise).rejects.toEqual({
      name: 'CannotBookingError',
      message: 'Cannot booking this room! Overcapacity!',
    });
  });

  it('should responde notFoundError if there is no room', () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => createEnrollmentMock());

    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => undefined);

    jest.spyOn(bookingRepository, 'findByRoomId').mockImplementationOnce((): any => []);

    const promise = bookingService.bookingRoomById(1, 1);

    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should responde cannotBookingError if there is no capacity', () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => createEnrollmentMock());

    jest
      .spyOn(ticketsRepository, 'findTicketByEnrollmentId')
      .mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => createRoomMock());

    jest.spyOn(bookingRepository, 'findByRoomId').mockImplementationOnce((): any => [1, 2, 3]);

    const promise = bookingService.bookingRoomById(1, 1);

    expect(promise).rejects.toEqual({
      name: 'CannotBookingError',
      message: 'Cannot booking this room! Overcapacity!',
    });
  });
});

describe('changeBookingRoomById', () => {
  it('should update booking', async () => {
    jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => createRoomMock());

    jest.spyOn(bookingRepository, 'findByRoomId').mockImplementationOnce((): any => []);

    jest.spyOn(bookingRepository, 'findByUserId').mockImplementationOnce((): any => createBookingWithoutDate());

    jest.spyOn(bookingRepository, 'upsertBooking').mockImplementationOnce((): any => createBookingWithoutDate());

    const result = await bookingService.changeBookingRoomById(1, 1);

    expect(result).toEqual(createBookingWithoutDate());
  });

  it('should responde badRequestError if userId != booking.userId', async () => {
    const promise = bookingService.changeBookingRoomById(2, 0);

    expect(promise).rejects.toEqual({
      name: 'BadRequestError',
      message: 'Bad Request Error!',
    });
  });

  it('should responde cannotBookingError if userId != booking.userId', async () => {
    jest.spyOn(roomRepository, 'findById').mockImplementationOnce((): any => createRoomMock());

    jest.spyOn(bookingRepository, 'findByRoomId').mockImplementationOnce((): any => []);

    jest.spyOn(bookingRepository, 'findByUserId').mockImplementationOnce((): any => createBookingWithoutDate());

    jest.spyOn(bookingRepository, 'upsertBooking').mockImplementationOnce((): any => createBookingWithoutDate());

    const promise = bookingService.changeBookingRoomById(2, 1);

    expect(promise).rejects.toEqual({
      name: 'CannotBookingError',
      message: 'Cannot booking this room! Overcapacity!',
    });
  });
});
