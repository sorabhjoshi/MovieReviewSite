import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, releaseDate } = req.body
      
      if (!name || !releaseDate) {
        return res.status(400).json({ error: 'Name and release date are required' })
      }

      const movie = await prisma.movie.create({
        data: {
          name,
          releaseDate: new Date(releaseDate),
        },
      })

      res.status(201).json(movie)
    } catch (error) {
      console.error('Error creating movie:', error)
      res.status(500).json({ error: 'Error creating movie' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}