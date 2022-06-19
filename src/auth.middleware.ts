import { Socket } from 'socket.io';
import { AuthService } from './auth/auth.service';

// export interface AuthSocket extends Socket {
//   user: Player;
// }
export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error | undefined) => void,
) => void;
export const WSAuthMiddleware = (
  authService: AuthService,
): SocketMiddleware => {
  return async (socket: Socket, next) => {
    try {
      const result = await authService.getUserInfo(socket.handshake.auth.token);
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
