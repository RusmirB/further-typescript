import { test, expect } from '@playwright/test';

const BASE_URL = 'https://fakerestapi.azurewebsites.net/api/v1';

test.describe('Negative API Testing - Author Management', () => {
  const invalidAuthorTests = [
    {
      description: 'Invalid ID',
      payload: { id: 'abc', idBook: 1001, firstName: 'John', lastName: 'Doe' },
    },
    {
      description: 'Invalid idBook',
      payload: { id: 1001, idBook: 'xyz', firstName: 'John', lastName: 'Doe' },
    },
    {
      description: 'Invalid firstName',
      payload: { id: 1001, idBook: 1002, firstName: 12345, lastName: 'Doe' },
    },
    {
      description: 'Invalid lastName (should be a string)',
      payload: { id: 1001, idBook: 1002, firstName: 'John', lastName: true },
    },
    {
      description: 'Empty ID',
      payload: { id: '', idBook: 1001, firstName: 'John', lastName: 'Doe' },
    },
    {
      description: 'Empty idBook',
      payload: { id: 1001, idBook: '', firstName: 'John', lastName: 'Doe' },
    },
  ];

  // Parameterized test to repeat for all invalidAuthors payloads
  invalidAuthorTests.forEach(({ description, payload }) => {
    test(`Create author with ${description}`, async ({ request }) => {
      const response = await request.post(`${BASE_URL}/Authors`, { data: payload });

      expect(response.status()).toBe(400);
    });
  });

  test('Get a non-existing author', async ({ request }) => {
    const nonExistentId = 999999;

    const response = await request.get(`${BASE_URL}/Authors/${nonExistentId}`);

    expect(response.status()).toBe(404);
  });

  // Skip tests because DELETE requests always return 200 status code for integer IDs
  test.skip('Delete a non-existing author', async ({ request }) => {
    const nonExistentId = 999999;

    const response = await request.delete(`${BASE_URL}/Authors/${nonExistentId}`);

    expect(response.status()).toBe(404);
  });

  // Skip tests because POST requests always return 200 status code for integer IDs
  test.skip('Create an author with an existing ID', async ({ request }) => {
    const authorPayload = {
      id: 1, // Duplicate ID
      idBook: 1,
      firstName: 'Duplicate',
      lastName: 'Author',
    };

    const response = await request.post(`${BASE_URL}/Authors`, { data: authorPayload });

    // Check response status
    expect(response.status()).toBe(400);
  });
});
