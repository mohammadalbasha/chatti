import { NextFunction } from "express";
import { Namespace, Server, Socket } from "socket.io";
import { JWT } from "../modules/auth/utils/jwt";
import { error } from "console";
import { IOEvents, PrivateMessage } from "./types";
import { Message } from "../modules/messages/models/message.model";
import { da } from "@faker-js/faker";

declare global {
  namespace SocketIO {
    interface Socket {
      userPayload: any;
    }
  }
}

declare module "socket.io/dist/socket" {
  interface Socket {
    userPayload: any;
  }
}

class SocketIOController {
  private ioServer: Server;
  static _instance: SocketIOController;
  private counter: number = 0;

  private map: Map<string, Socket>;

  // private constructor to ensure Singleton
  private constructor() {
    this.map = new Map();
  }

  static instance() {
    if (SocketIOController._instance) return SocketIOController._instance;

    SocketIOController._instance = new SocketIOController();
    return SocketIOController._instance;
  }

  public initialize(httpServer: any) {
    this.ioServer = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
  }

  public ready() {
    return this.ioServer !== null;
  }

  public getIOServer() {
    return this.ioServer;
  }

  public closeServer() {
    this.ioServer?.close();
  }

  public start(): void {
    this.ioServer
      .use(this.authenticateSocket)
      .on("connection", (socket: Socket) => {
        if (this.map.has(socket.userPayload?.id)) {
          //console.log(this.map.get(socket.userPayload?.id)!.id);
          //return;
        } else {
          //console.log("noooooooooo");
        }

        this.map.set(socket.userPayload?.id, socket);

        //socket.emit("connected");

        const clients = this.ioServer.sockets.adapter.rooms.get(
          socket.userPayload?.id
        )!;

        if (!clients) {
          // for (const clientId of clients) {
          //   //this is the socket of each client in the room.
          //   const clientSocket =
          //     SocketIOController.ioServer.sockets.sockets.get(clientId);
          //   console.log(clientSocket?.id);
          // }
        }
        // // JOIN OWN ROOM
        // socket.join(socket.userPayload?.id);

        this.ioServer.emit("newUser", { message: "new user" });

        // make user online
        //        if (socket.listeners(IOEvents.PRIVATE_MESSAGE).length < 2)

        socket.on(IOEvents.PRIVATE_MESSAGE, (data: PrivateMessage) => {
          try {
            this.handlePrivateMessage(socket, data);
          } catch (err) {
            this.handleError(socket, err);
          }
        });

        // socket.on("joinRoom", (roomId: string) => {
        //   try {
        //     this.handleJoinRoom(socket, roomId);
        //   } catch (error) {
        //     console.log(error);
        //     this.handleError(socket, error);
        //   }
        // });

        socket.on("disconnect", () => {
          try {
            this.handleDisconnect(socket);
          } catch (error) {
            this.handleError(socket, error);
          }
        });
      });
  }

  private authenticateSocket(socket: Socket, next: any) {
    if (
      socket.handshake?.query?.token ||
      socket.handshake?.headers?.access_token
    ) {
      try {
        const payload = JWT.verify(
          (socket.handshake.query.token ||
            socket.handshake?.headers?.access_token) as string
        );
        socket.userPayload = payload;
        next();
      } catch {
        next(new Error("Authentication error"));
      }
      next();
    } else {
      next(new Error("Authentication error"));
    }
  }

  private async handlePrivateMessage(socket: Socket, data: PrivateMessage) {
    console.log("recieved ...", data);
    //socket.emit("message", { message: "server message" });
    try {
      // Save the message to the database
      const message = new Message({
        message: data.message,
        sender: data.from,
        createdAt: new Date(),
        conversation: data.conversation,
      });

      socket
        .to(this.map.get(data.to)?.id!)
        .emit(IOEvents.PRIVATE_MESSAGE, message);
      await message.save();

      // Broadcast the message to other connected clients
      // socket.broadcast.emit('message', message);
    } catch (error) {
      this.handleError(socket, error);
    }

    // Emit the message directly to the recipient
    // SocketIOController.instance()
    //   .getIOServer()
    //   .to(data.to)
    //   .emit(IOEvents.PRIVATE_MESSAGE, data);

    //this.map.get(data.to)?.emit(IOEvents.PRIVATE_MESSAGE, data);
  }

  private handleJoinRoom(socket: Socket, roomId: string) {
    socket.join(roomId);
  }

  private handleError(socket: Socket, err: any) {
    socket.emit("error", { message: err.message });
  }

  private handleDisconnect(socket: Socket): void {
    // remove user form online users
    console.log("disconnect");
  }
}

export default SocketIOController;
