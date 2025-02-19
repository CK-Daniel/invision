import { Tag } from '@/types';

export function fetchTags(): Promise<Tag[]> {
  return fetch('/api/tags')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}
