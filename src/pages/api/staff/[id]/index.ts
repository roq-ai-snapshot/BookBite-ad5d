import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { staffValidationSchema } from 'validationSchema/staff';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getStaffById();
    case 'PUT':
      return updateStaffById();
    case 'DELETE':
      return deleteStaffById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getStaffById() {
    const data = await prisma.staff.findFirst(convertQueryToPrismaUtil(req.query, 'staff'));
    return res.status(200).json(data);
  }

  async function updateStaffById() {
    await staffValidationSchema.validate(req.body);
    const data = await prisma.staff.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteStaffById() {
    const data = await prisma.staff.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
