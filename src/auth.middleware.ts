import { Socket } from 'socket.io';

// export interface AuthSocket extends Socket {
//   user: Player;
// }
export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error | undefined) => void,
) => void;
export const WSAuthMiddleware = (): SocketMiddleware => {
  return async (socket: Socket, next) => {
    try {
      if (socket.handshake.auth) {
        next();
      } else {
        next({
          name: 'Unauthorized',
          message: 'Unauthorized',
        });
      }
    } catch (error) {
      next({
        name: 'Unauthorized',
        message: 'Unauthorized',
      });
    }
  };
};
