import { NextFunction, Request, Response } from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { handleError, throwHttpException } from "../models/error";
import {
  FetchedMessageDetails,
  Message,
  MessageDetailsResponse,
  NewMessageRequest,
} from "../models/Message";
import { MessageAction } from "../models/MessageAction";
import { User } from "../models/User";
import { userDeletedMessage } from "../utils/message.utils";

export const postMessage = async (
  req: Request<{}, {}, NewMessageRequest>,
  res: Response<string>,
  next: NextFunction
) => {
  const sender = req.user!;

  try {
    const receiver = await getRepository(User).findOne({
      where: {
        email: req.body.receiver,
      },
    });
    if (!receiver) {
      return throwHttpException(422, "Receiver email not found!");
    }

    await getRepository(Message).save({
      subject: req.body.subject,
      messageBody: req.body.messageBody,
      sender: sender.id,
      receiver: receiver.id,
      messageActions: [
        new MessageAction(sender.id),
        new MessageAction(receiver.id),
      ],
    });
    res.status(201).send("Message sent");
  } catch (error) {
    handleError(error, "Sending message failed.", next);
  }
};

export const getMessage = async (
  req: Request<{ messageId: string }>,
  res: Response<MessageDetailsResponse>,
  next: NextFunction
) => {
  const user = req.user!;
  try {
    const fetchedMessage = await createQueryBuilder<FetchedMessageDetails>(
      Message,
      "message"
    )
      .leftJoinAndSelect("message.sender", "sender")
      .leftJoinAndSelect("message.receiver", "receiver")
      .leftJoinAndSelect("message.messageActions", "messageActions")
      .where({ id: req.params.messageId })
      .select([
        "message",
        "sender.id",
        "sender.name",
        "sender.email",
        "receiver.id",
        "receiver.name",
        "receiver.email",
        "messageActions.userId",
        "messageActions.deleted",
      ])
      .getOne();
    if (!fetchedMessage) {
      return throwHttpException(404, "Message not found.");
    }

    if (
      fetchedMessage.receiver.id !== user.id &&
      fetchedMessage.sender.id !== user.id
    ) {
      return throwHttpException(403, "Not authorized to read the message.");
    }

    const messageDeleted = userDeletedMessage(
      fetchedMessage.messageActions,
      user.id
    );
    if (messageDeleted) {
      return throwHttpException(410, "Message has been deleted.");
    }

    const senderDeleted = userDeletedMessage(
      fetchedMessage.messageActions,
      fetchedMessage.sender.id
    );
    const receiverDeleted = userDeletedMessage(
      fetchedMessage.messageActions,
      fetchedMessage.receiver.id
    );

    const messageDetailsResponse: MessageDetailsResponse = {
      id: fetchedMessage.id,
      subject: fetchedMessage.subject,
      messageBody: fetchedMessage.messageBody,
      createdAt: fetchedMessage.createdAt,
      readByReceiverAt: fetchedMessage.readByReceiverAt,
      sender: {
        ...fetchedMessage.sender,
        deleted: senderDeleted,
      },
      receiver: {
        ...fetchedMessage.receiver,
        deleted: receiverDeleted,
      },
    };
    res.json(messageDetailsResponse);
  } catch (error) {
    handleError(error, "Fetching message failed.", next);
  }
};

export const readMessage = async (
  req: Request<{ messageId: string }>,
  res: Response<string>,
  next: NextFunction
) => {
  const user = req.user!;
  try {
    const message = await getRepository<Message & { receiver: User }>(
      Message
    ).findOne(req.params.messageId, {
      relations: ["receiver", "messageActions"],
      where: { receiver: { id: user.id } },
    });
    if (!message) {
      return throwHttpException(
        404,
        `Message with id ${req.params.messageId} not found in inbox.`
      );
    }

    const messageDeleted = userDeletedMessage(message.messageActions, user.id);
    if (messageDeleted) {
      return throwHttpException(410, "Message has been deleted.");
    }

    if (!message.readByReceiverAt) {
      await createQueryBuilder<Message>()
        .update(Message)
        .where({ id: req.params.messageId })
        .set({ readByReceiverAt: new Date() })
        .execute();
    }

    res.status(204).send("Message read.");
  } catch (error) {
    handleError(error, "Reading message failed.", next);
  }
};

export const deleteMessage = async (
  req: Request<{ messageId: string }>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  try {
    const message = await getRepository(MessageAction).update(
      {
        messageId: +req.params.messageId,
        userId: user.id,
      },
      {
        deleted: true,
      }
    );
    if (message.affected === 0) {
      return throwHttpException(404, "Message not found.");
    }
    res.status(204).send("Message Deleted");
  } catch (error) {
    handleError(error, "Deleting message failed.", next);
  }
};
