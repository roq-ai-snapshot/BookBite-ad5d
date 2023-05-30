import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { feedbackValidationSchema } from 'validationSchema/feedbacks';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getFeedbackById();
    case 'PUT':
      return updateFeedbackById();
    case 'DELETE':
      return deleteFeedbackById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFeedbackById() {
    const data = await prisma.feedback.findFirst(convertQueryToPrismaUtil(req.query, 'feedback'));
    return res.status(200).json(data);
  }

  async function updateFeedbackById() {
    await feedbackValidationSchema.validate(req.body);
    const data = await prisma.feedback.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteFeedbackById() {
    const data = await prisma.feedback.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
