import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { staffValidationSchema } from 'validationSchema/staff';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getStaff();
    case 'POST':
      return createStaff();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getStaff() {
    const data = await prisma.staff.findMany(convertQueryToPrismaUtil(req.query, 'staff'));
    return res.status(200).json(data);
  }

  async function createStaff() {
    await staffValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.staff.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
