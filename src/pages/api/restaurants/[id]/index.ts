import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { restaurantValidationSchema } from 'validationSchema/restaurants';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getRestaurantById();
    case 'PUT':
      return updateRestaurantById();
    case 'DELETE':
      return deleteRestaurantById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRestaurantById() {
    const data = await prisma.restaurant.findFirst(convertQueryToPrismaUtil(req.query, 'restaurant'));
    return res.status(200).json(data);
  }

  async function updateRestaurantById() {
    await restaurantValidationSchema.validate(req.body);
    const data = await prisma.restaurant.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteRestaurantById() {
    const data = await prisma.restaurant.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
