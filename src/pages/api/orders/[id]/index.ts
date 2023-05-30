import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { orderValidationSchema } from 'validationSchema/orders';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getOrderById();
    case 'PUT':
      return updateOrderById();
    case 'DELETE':
      return deleteOrderById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOrderById() {
    const data = await prisma.order.findFirst(convertQueryToPrismaUtil(req.query, 'order'));
    return res.status(200).json(data);
  }

  async function updateOrderById() {
    await orderValidationSchema.validate(req.body);
    const data = await prisma.order.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteOrderById() {
    const data = await prisma.order.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
