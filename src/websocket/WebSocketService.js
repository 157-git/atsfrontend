// // src/services/WebSocketService.js
// import { Client } from "./@stomp/stompjs";

// class WebSocketService {
//   constructor() {
//     this.client = new Client({
//       brokerURL: 'ws://93.127.199.85:8891/ws',
//       connectHeaders: {},
//       debug: function (str) {
//         console.log(str);
//       },
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//     });

//     this.client.onConnect = () => {
//       console.log('Connected to WebSocket');
//       this.connected = true;
//       this.connectionPromise = Promise.resolve();
//     };

//     this.connected = false;
//     this.connectionPromise = new Promise((resolve) => {
//       this.resolveConnection = resolve;
//     });

//     this.client.activate();
//   }

//   async waitForConnection() {
//     if (!this.connected) {
//       await this.connectionPromise;
//     }
//   }

//   async subscribeToNotifications(callback) {
//     await this.waitForConnection();
//     return this.client.subscribe('/topic/notifications', (message) => {
//       const notification = JSON.parse(message.body);
//       callback(notification);
//     });
//   }
// }

// export default new WebSocketService();