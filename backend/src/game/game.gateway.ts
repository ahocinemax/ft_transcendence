import { SubscribeMessage, WebSocketGateway, OnGatewayDisconnect } from '@nestjs/websockets';
import { WebsocketService } from 'src/websocket/websocket.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayDisconnect {
  constructor(private websocketService: WebsocketService) {}
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!'; 
  }

  handleDisconnect(client: any) {
    // console.log("Client disconnected: ", client);
    this.websocketService.updateStatus(client, 'online');

    // this.gameService.setGameFinished(client.data.id); // 
  }

  // @SubscribeMessage('set mode one')
  // @SubscribeMessage('set mode two')
  // @SubscribeMessage('set mode three')
}
