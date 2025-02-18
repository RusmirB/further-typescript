import { test, expect } from '@playwright/test';
import { createAuthor, deleteAuthor, getAuthors } from '../../utils/api.helper';
import { faker } from '@faker-js/faker';
import { Author } from '../../types/api/author';

// NOTE: Maybe I did not understand task, but the Fake REST API at 'https://fakerestapi.azurewebsites.net' is designed for simulation purposes only.
// It does not persist data between requests. Therefore, while POST, DELETE requests
// return successful responses, they do not actually modify data on the server.
// As a result, GET requests will not reflect these changes.

// Due to this limitation, I will validate requests in separate tests, and not in the same test (cannot validate full flow).
// If there was a catch I missed it :)

test.describe('API Testing - Author Management', () => {
  test('Create an author', async ({ request }) => {
    // Author payload
    const authorPayload: Author = {
      id: faker.number.int({ min: 1000, max: 99999 }),
      idBook: faker.number.int({ min: 1000, max: 99999 }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };

    const createdAuthor = await createAuthor(request, authorPayload);

    expect(createdAuthor).toMatchObject({
      id: authorPayload.id,
      idBook: authorPayload.idBook,
      firstName: authorPayload.firstName,
      lastName: authorPayload.lastName,
    });
  });

  test('Get authors', async ({ request }) => {
    const authors = await getAuthors(request);

    expect(authors.length).toBeGreaterThan(0);

    expect(authors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          idBook: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
        }),
      ])
    );
  });

  test('Delete an author', async ({ request }) => {
    const authorId = 1;

    await deleteAuthor(request, authorId);

    // Usually I would submit another GET call here to check if author was deleted
    // However, due to the limitations of the Fake REST API, I cannot validate this
  });
});
