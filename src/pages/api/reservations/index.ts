import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { reservationValidationSchema } from 'validationSchema/reservations';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getReservations();
    case 'POST':
      return createReservation();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getReservations() {
    const data = await prisma.reservation.findMany(convertQueryToPrismaUtil(req.query, 'reservation'));
    return res.status(200).json(data);
  }

  async function createReservation() {
    await reservationValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.reservation.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
