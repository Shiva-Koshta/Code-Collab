const request = require('supertest');
const router = require('../endpoints');
const  mock  = require('nodemailer');

// Mock Nodemailer
jest.mock('nodemailer');

test('POST /help should send an email and return status 200', async () => {
  const payload = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    message: 'Test message'
  };

  // Mock Nodemailer's createTransport function
  mock.createTransport.mockReturnValue({
    sendMail: jest.fn()
  });

  const res = await request(router)
    .post('/help')
    .send(payload);

  // Check if the response status is 200
  expect(res.status).toBe(200);
  // Check if the response body contains the message "Form submitted"
  expect(res.body).toHaveProperty('message', 'Form submitted');
  // Check if Nodemailer's sendMail function is called with the correct arguments
  expect(mock.createTransport().sendMail).toHaveBeenCalledWith(expect.objectContaining({
    from: 'codecollabhelp@gmail.com',
    to: 'codecollabhelp@gmail.com',
    subject: 'Help for Code Collab',
    text: `Name: ${payload.name}\nEmail: ${payload.email}\nMessage: ${payload.message}`
  }));
});

test('POST /help should return status 500 if an error occurs while sending email', async () => {
  // Mock Nodemailer's createTransport function
  mock.createTransport.mockReturnValue({
    sendMail: jest.fn().mockImplementationOnce(() => {
      throw new Error('Failed to send email');
    })
  });

  const res = await request(router)
    .post('/help')
    .send({});

  // Check if the response status is 500
  expect(res.status).toBe(500);
  // Check if the response body contains the error message
  expect(res.body).toHaveProperty('error', 'An error occurred while sending the email');
});
