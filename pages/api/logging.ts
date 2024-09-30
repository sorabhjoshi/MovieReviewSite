import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request body:', req.body)
  console.log('Request method:', req.method)
  console.log('Request headers:', req.headers)
  res.status(200).json({ message: 'Logging completed' })
}