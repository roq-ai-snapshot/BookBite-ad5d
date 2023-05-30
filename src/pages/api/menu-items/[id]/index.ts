import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { menuItemValidationSchema } from 'validationSchema/menu-items';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getMenuItemById();
    case 'PUT':
      return updateMenuItemById();
    case 'DELETE':
      return deleteMenuItemById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMenuItemById() {
    const data = await prisma.menu_item.findFirst(convertQueryToPrismaUtil(req.query, 'menu_item'));
    return res.status(200).json(data);
  }

  async function updateMenuItemById() {
    await menuItemValidationSchema.validate(req.body);
    const data = await prisma.menu_item.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteMenuItemById() {
    const data = await prisma.menu_item.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
