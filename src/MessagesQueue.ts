import {Status} from "./Statuses";

export interface IMessagesQueue {
  addMessage: (id: string, status: Status, message: any) => void;
  getMessages: () => string;
}

export interface IMessage {
  id: string;
  status: Status;
  payload: any;
}

export class MessagesQueue implements IMessagesQueue {
  private queue: IMessage[] = [];

  public addMessage(id: string, status: Status, message: any) {
    this.queue.push({id, status, payload: message});
  }

  public getMessages() {
    const temp = [...this.queue];
    this.queue = [];
    return JSON.stringify(temp);
  }
}
