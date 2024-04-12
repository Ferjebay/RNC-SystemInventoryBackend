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

    async registerClient( client: Socket, userId: string ) {
      this.checkUserConnection( userId );

      this.connectedClients[userId] = {
        socket: client
      };
    }

    updateStateInvoice( user_id ){
      try {
        this.connectedClients[user_id].socket.emit('updateStateInvoice');
      } catch (error) {
        console.log(error);
      }
    }

    //VALIDAR ESTO XQ BORRARIA TODOS LOS USUARIOS Y NO ES ASI
    private checkUserConnection( userId: string ) {
      for (const user_connected of Object.keys(this.connectedClients)){
        if ( userId == user_connected ) {
          const connectedClient = this.connectedClients[userId];
          connectedClient.socket.disconnect();
        }
      }
    }

}
