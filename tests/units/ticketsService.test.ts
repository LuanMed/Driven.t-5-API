import { createEnrollmentMock, createTicketMock, createTicketWithTicketType } from '../factories';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import ticketService from '@/services/tickets-service';

describe('getTicketType', () => {
  it('should return a ticket type', async () => {
    jest.spyOn(ticketsRepository, 'findTicketTypes').mockImplementationOnce((): any => ['ticketType']);

    const result = await ticketService.getTicketType();

    expect(result).toEqual(['ticketType']);
    expect(ticketsRepository.findTicketTypes).toBeCalled();
  });

  it('should return notFoundError if there is no ticket type', () => {
    jest.spyOn(ticketsRepository, 'findTicketTypes').mockImplementationOnce((): any => undefined);

    const promise = ticketService.getTicketType();

    expect(promise).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });
});

describe('getTicketByUserId', () => {
  it('should return a ticket', async () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => createEnrollmentMock());

    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => createTicketMock());

    const result = await ticketService.getTicketByUserId(1);

    expect(result).toEqual(createTicketMock());
    expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
    expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
  });

  it('should return notFoundError if there is no enrollment', () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => undefined);

    const promise = ticketService.getTicketByUserId(1);

    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return notFoundError if there is no ticket', () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => createEnrollmentMock());

    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => undefined);

    const promise = ticketService.getTicketByUserId(1);

    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});

describe('createTicket', () => {
  it('should create a ticket', async () => {
    jest
      .spyOn(enrollmentRepository, 'findWithAddressByUserId')
      .mockImplementationOnce((): any => createEnrollmentMock());

    jest.spyOn(ticketsRepository, 'createTicket').mockImplementationOnce((): any => createTicketMock());

    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => createTicketMock());

    const result = await ticketService.createTicket(1, 1);

    expect(result).toEqual(createTicketMock());
    expect(enrollmentRepository.findWithAddressByUserId).toBeCalled();
    expect(ticketsRepository.createTicket).toBeCalled();
    expect(ticketsRepository.findTicketByEnrollmentId).toBeCalled();
  });

  it('should return notFoundError if there is no enrollment', () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => undefined);

    const promise = ticketService.createTicket(1, 1);

    expect(promise).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});
