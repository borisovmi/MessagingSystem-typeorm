import { NextFunction, Request, Response } from "express";
import { createQueryBuilder, IsNull } from "typeorm";
import { handleError, HttpException } from "../models/error";
import { FetchedMessageDetails, Message } from "../models/Message";

enum MessagesType {
  ALL = "all",
  INBOX = "inbox",
  UNREAD = "unread",
}

const messageWhereClause = (messagesType: MessagesType, userId: number) => {
  const whereClauses = {
    [MessagesType.ALL]: [{ receiver: userId }, { sender: userId }],
    [MessagesType.INBOX]: {
      receiver: userId,
    },
    [MessagesType.UNREAD]: { receiver: userId, readByReceiverAt: IsNull() },
  };
  return whereClauses[messagesType];
};

export const getMessages = async (
  req: Request<
    {},
    {},
    {},
    { limit: string; offset: string; messagesType: MessagesType }
  >,
  res: Response<any>,
  next: NextFunction
) => {
  const user = req.user!;
  const limit = parseInt(req.query.limit + "", 10) || 10;
  const offset = parseInt(req.query.offset + "", 10) * limit || 0;

  try {
    const messagesQueryResult = await createQueryBuilder<FetchedMessageDetails>(
      Message,
      "message"
    )
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("message.receiver", "receiver")
      .leftJoinAndMapOne(
        "message.messageActions",
        "message.messageActions",
        "messageActions",
        "messageActions.userId = :userId",
        { userId: user.id }
      )
      .where(messageWhereClause(req.query.messagesType, user.id))
      .andWhere("messageActions.deleted = :isDeleted", { isDeleted: false })
      .select([
        "message",
        "sender.id",
        "sender.name",
        "sender.email",
        "receiver.id",
        "receiver.name",
        "receiver.email",
      ])
      .orderBy("message.createdAt", "DESC")
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const messagesPagination: any = {
      messages: messagesQueryResult[0],
      pagination: {
        currentPage: offset + 1,
        totalItems: messagesQueryResult[1],
        totalPages: Math.ceil(messagesQueryResult[1] / limit),
      },
    };
    res.json(messagesPagination);
  } catch (error) {
    handleError(error, "Fetching messages failed.", next);
  }
};
