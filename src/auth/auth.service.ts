import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  OK_HTTP_STATUS = 200;
  authorizationUrl = 'https://account-dev.tpos.dev/api/identity/my-profile';

  async getUserInfo(token: string) {
    try {
      if (this.authorizationUrl) {
        const response = await axios.get(this.authorizationUrl, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        if (response) {
          return response;
        }
      }
    } catch (err: any) {
      this.logger.error('Get user info', err);
    }
  }
}
