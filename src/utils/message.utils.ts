import { MessageAction } from "../models/MessageAction";

export function userDeletedMessage(messageActions: MessageAction[], userId: number): boolean {
  const messageAction = messageActions.find(action => action.userId === userId);
  const isDeleted = messageAction?.deleted;
  return !!isDeleted;
}