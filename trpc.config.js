import { createTRPC } from '@trpc/server';
import { createMovie } from './api/createMovie';

export const trpc = createTRPC({
  // ... other config options ...
  routes: [
    {
      path: '/api/trpc/createMovie',
      handler: createMovie,
    },
  ],
});