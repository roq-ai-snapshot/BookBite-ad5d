import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { orderItemValidationSchema } from 'validationSchema/order-items';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getOrderItems();
    case 'POST':
      return createOrderItem();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOrderItems() {
    const data = await prisma.order_item.findMany(convertQueryToPrismaUtil(req.query, 'order_item'));
    return res.status(200).json(data);
  }

  async function createOrderItem() {
    await orderItemValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.order_item.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
