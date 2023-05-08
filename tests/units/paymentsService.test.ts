import { createEnrollmentMock, createPaymentMock, createTicketWithTicketType } from '../factories';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import paymentsService from '@/services/payments-service';

describe('getPaymentByTicketId', () => {
  it('should return a payment', async () => {
    jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(enrollmentRepository, 'findById').mockImplementationOnce((): any => createEnrollmentMock());

    jest.spyOn(paymentsRepository, 'findPaymentByTicketId').mockImplementationOnce((): any => createPaymentMock());

    const result = await paymentsService.getPaymentByTicketId(1, 1);

    expect(result).toEqual(createPaymentMock());
    expect(ticketsRepository.findTickeyById).toBeCalled();
    expect(enrollmentRepository.findById).toBeCalled();
    expect(paymentsRepository.findPaymentByTicketId).toBeCalled();
  });

  it('should return notFoundError if there is no ticket', () => {
    jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => undefined);

    const promise = paymentsService.getPaymentByTicketId(1, 1);

    expect(promise).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });

  it('should return notFoundError if there is no enrollment', () => {
    jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(enrollmentRepository, 'findById').mockImplementationOnce((): any => undefined);

    const promise = paymentsService.getPaymentByTicketId(1, 1);

    expect(promise).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });

  it('should return unauthorizedError if user do not own ticket', () => {
    jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(enrollmentRepository, 'findById').mockImplementationOnce((): any => createEnrollmentMock());

    const promise = paymentsService.getPaymentByTicketId(2, 1);

    expect(promise).rejects.toEqual({ name: 'UnauthorizedError', message: 'You must be signed in to continue' });
  });

  it('should return notFoundError if there is no payment', () => {
    jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(enrollmentRepository, 'findById').mockImplementationOnce((): any => createEnrollmentMock());

    jest.spyOn(paymentsRepository, 'findPaymentByTicketId').mockImplementationOnce((): any => undefined);

    const promise = paymentsService.getPaymentByTicketId(1, 1);

    expect(promise).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });
});

describe('paymentProcess', () => {
  it('should create payment', async () => {
    const cardData = { issuer: 'string', number: 1, name: 'string', expirationDate: new Date(), cvv: 1 };

    jest.spyOn(ticketsRepository, 'findTickeyById').mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(enrollmentRepository, 'findById').mockImplementationOnce((): any => createEnrollmentMock());

    jest
      .spyOn(ticketsRepository, 'findTickeWithTypeById')
      .mockImplementationOnce((): any => createTicketWithTicketType());

    jest.spyOn(paymentsRepository, 'createPayment').mockImplementationOnce((): any => createPaymentMock());
    jest.spyOn(ticketsRepository, 'ticketProcessPayment').mockImplementationOnce((): any => undefined);

    const result = await paymentsService.paymentProcess(1, 1, cardData);

    expect(result).toEqual(createPaymentMock());
    expect(ticketsRepository.findTickeyById).toBeCalled();
    expect(enrollmentRepository.findById).toBeCalled();
    expect(ticketsRepository.findTickeWithTypeById).toBeCalled();
    expect(paymentsRepository.createPayment).toBeCalled();
    expect(ticketsRepository.ticketProcessPayment).toBeCalled();
  });
});
