import { Client } from "@stomp/stompjs";

class WebSocketService {
  constructor() {
    this.client = null;
    this.hole = null;
    this.table = null;
  }

  connect(gameId, playerId, onMessageReceived) {
    if (this.client && this.client.active) {
      console.log("WebSocket already connected!");
      return; 
    }
    this.client = new Client({
      brokerURL: "/ws",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket Connected to Game:", gameId);
        this.subscribeToGame(gameId, playerId, onMessageReceived);
      },
      onDisconnect: () => {
        console.log("WebSocket Disconnected");
      },
    });

    this.client.activate();
  }

  subscribeToGame(gameId, playerId, onMessageReceived) {
    if (!this.client || !this.client.active) {
      console.error("WebSocket is not connected yet!");
      return;
    }

    const game = `/topic/games/${gameId}`;
    const player = `/topic/players/${playerId}`;
    

    this.table = this.client.subscribe(game, (message) => {
      const data = JSON.parse(message.body);
      onMessageReceived(data);
    });

    this.hole = this.client.subscribe(player, (message) => {
        const data = JSON.parse(message.body);
        onMessageReceived(data);
      });

  }

  sendMessage(gameId, message) {
    if (!this.client) console.log("Chumak");
    if (!this.client || !this.client.active) {
      console.error("WebSocket is not connected!");
      return;
    }

    this.client.publish({
      destination: `/app/games/${gameId}`,
      body: JSON.stringify(message),
    });
  }

  disconnect() {
    if (this.client) {
      this.cleanupSubscriptions();

      this.client.deactivate();
      console.log("WebSocket Disconnected");
    }
  }

  cleanupSubscriptions() {
    if (this.table) {
      this.table.unsubscribe();
      console.log("Unsubscribed from table topic");
    }

    if (this.hole) {
      this.hole.unsubscribe();
      console.log("Unsubscribed from player topic");
    }
  }
}

//const webSocketService = new WebSocketService();
export default WebSocketService;
