import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnetedClients {
  [id: string]: {
    socket: Socket
  }
}

@Injectable()
export class MessagesWsService {

    private connectedClients: ConnetedClients = {}

    async registerClient( client: Socket, userId: string ){

      this.checkUserConnection( userId );

      this.connectedClients[userId] = {
        socket: client
      };
    }

    updateStateInvoice( user_id ){
      this.connectedClients[user_id].socket.emit('updateStateInvoice');
    }

    //VALIDAR ESTO XQ BORRARIA TODOS LOS USUARIOS Y NO ES ASI
    private checkUserConnection( userId: string ){
      for (const userId of Object.keys ( this.connectedClients)){
        const connectedClient = this.connectedClients[userId];
        connectedClient.socket.disconnect();
      }
    }

}
