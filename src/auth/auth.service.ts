import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  OK_HTTP_STATUS = 200;
  authorizationUrl = 'https://tmt.account.tmtco.dev/api/identity/my-profile';

  async getUserInfo(token: string) {
    try {
      const response = await axios.get(this.authorizationUrl, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      return response ? response : null;
    } catch (err: any) {
      this.logger.error('Get user info', err);
      return null;
    }
  }
}
