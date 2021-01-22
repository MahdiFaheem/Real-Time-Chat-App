export class ChatModel {
    id: number;
    senderId: number;
    receiverId: number;
    message: string;
    deletedFrom?: number;
    sentOn: string;
}