import { Server } from 'socket.io';
import http from 'http';

class Ws {
  public io: Server;
  private booted = false;

  public boot(server: http.Server) {
    
    if (this.booted) {
      return;
    }

    this.booted = true;
    this.io = new Server(server);
  }
}
export default new Ws();
