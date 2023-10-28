import { getNotesResponseSchema } from 'api-server-type';

const API_BASE_URL = 'http://localhost:3001';

export const requestGetNotes = async () => {
  const response = await fetch(`${API_BASE_URL}/notes`);
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return getNotesResponseSchema.parse(await response.json());
};
