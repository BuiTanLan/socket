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
    authService.getUserInfo(socket.handshake.auth['token']).subscribe({
      next: result => {
        if (result?.status === authService.OK_HTTP_STATUS) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          socket["userId"] = 6;
          next();
        } else {
          next({
            name: "Unauthorized",
            message: "Unauthorized"
          });
        }
      },
      error: err => {
        next({
          name: "Unauthorized",
          message: "Unauthorized"
        });
        console.log(err.message);
      }
    });


  };
};
