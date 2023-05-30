import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { orderItemValidationSchema } from 'validationSchema/order-items';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getOrderItemById();
    case 'PUT':
      return updateOrderItemById();
    case 'DELETE':
      return deleteOrderItemById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOrderItemById() {
    const data = await prisma.order_item.findFirst(convertQueryToPrismaUtil(req.query, 'order_item'));
    return res.status(200).json(data);
  }

  async function updateOrderItemById() {
    await orderItemValidationSchema.validate(req.body);
    const data = await prisma.order_item.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteOrderItemById() {
    const data = await prisma.order_item.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
