import { expect, APIRequestContext } from '@playwright/test';
import { Author } from '../types/api/author';

const BASE_URL = 'https://fakerestapi.azurewebsites.net/api/v1';

// Helper function to create an author
export async function createAuthor(request: APIRequestContext, authorPayload: Author): Promise<Author> {
  const response = await request.post(`${BASE_URL}/Authors`, {
    data: authorPayload,
  });
  expect(response.status()).toBe(200);
  return response.json();
}

// Helper function to get all authors
export async function getAuthors(request: APIRequestContext): Promise<Author[]> {
  const response = await request.get(`${BASE_URL}/Authors`);
  expect(response.status()).toBe(200);
  return response.json();
}

// Helper function to get an author by ID
export async function getAuthor(request: APIRequestContext, authorId: number): Promise<Author> {
  const response = await request.get(`${BASE_URL}/Authors/${authorId}`);
  expect(response.status()).toBe(200);
  return response.json();
}

// Helper function to delete an author
export async function deleteAuthor(request: APIRequestContext, authorId: number): Promise<void> {
  const response = await request.delete(`${BASE_URL}/Authors/${authorId}`);
  expect(response.status()).toBe(200);
}
