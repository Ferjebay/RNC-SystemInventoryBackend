import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService
  ) {}

  async handleConnection( client: Socket ) {

    const usuario_id = client.handshake.headers.autentication as string;

    try {
      await this.messagesWsService.registerClient( client, usuario_id );
    } catch (error){
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    // console.log("desconectado");
  }

}
