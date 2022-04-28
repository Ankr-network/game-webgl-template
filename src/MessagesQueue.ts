import {Status} from "./Statuses";

export interface IMessagesQueue {
  messages: string;
  addMessage: (id: string, status: Status, message: any) => void;
}

export interface IMessage {
  id: string;
  status: Status;
  payload: any;
}

export class MessagesQueue implements IMessagesQueue {
  private queue: IMessage[] = [];

  public get messages() {
    const temp = [...this.queue];
    this.queue = [];
    return JSON.stringify(temp);
  }

  public addMessage(id: string, status: Status, message: any) {
    this.queue.push({id, status, payload: typeof message === 'string' ? message : JSON.stringify(message)});
  }
}
