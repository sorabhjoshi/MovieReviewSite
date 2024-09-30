import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const t = initTRPC.create();

export const appRouter = t.router({
 
  getMovies: t.procedure.query(async () => {
    return await prisma.movie.findMany();
  }),
  
 
  createMovie: t.procedure
    .input(
      z.object({
        name: z.string(),
        releaseDate: z.string().transform((str) => new Date(str)), // Convert string to Date
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.movie.create({ data: input });
    }),


  createReview: t.procedure
    .input(z.object({
      movieId: z.number(),
      reviewerName: z.string().optional(),
      rating: z.number().min(0).max(10),
      comments: z.string(),
    }))
    .mutation(async ({ input }) => {
      const review = await prisma.review.create({ data: input });
      await updateAverageRating(input.movieId);
      return review;
    }),

  
  searchReviews: t.procedure.input(z.string()).query(async ({ input }) => {
    return await prisma.review.findMany({
      where: {
        OR: [
          { reviewerName: { contains: input } },
          { comments: { contains: input } },
        ],
      },
      include: { movie: true },
    });
  }),
  getMovieReviews: t.procedure
    .input(z.number())
    .query(async ({ input: movieId }) => {
      return await prisma.review.findMany({
        where: { movieId },
        include: { movie: true },
      });
    }),

 
  updateReview: t.procedure
    .input(z.object({
      id: z.number(),
      reviewerName: z.string().optional(),
      rating: z.number().min(0).max(10),
      comments: z.string(),
    }))
    .mutation(async ({ input }) => {
      const updatedReview = await prisma.review.update({
        where: { id: input.id },
        data: input,
      });
      await updateAverageRating(updatedReview.movieId);
      return updatedReview;
    }),

    deleteMovie: t.procedure
    .input(z.number())
    .mutation(async ({ input: movieId }) => {
      
      await prisma.review.deleteMany({
        where: { movieId },
      });

    
      const deletedMovie = await prisma.movie.delete({
        where: { id: movieId },
      });

      return deletedMovie;
    }),

  deleteReview: t.procedure
    .input(z.number())
    .mutation(async ({ input: reviewId }) => {
      const deletedReview = await prisma.review.delete({
        where: { id: reviewId },
      });
      await updateAverageRating(deletedReview.movieId);
      return deletedReview;
    }),

});


async function updateAverageRating(movieId: number) {
  const reviews = await prisma.review.findMany({ where: { movieId } });
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  await prisma.movie.update({
    where: { id: movieId },
    data: { averageRating },
  });
}

export type AppRouter = typeof appRouter;
