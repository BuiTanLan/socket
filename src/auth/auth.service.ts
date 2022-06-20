import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { HttpService } from "@nestjs/axios";

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  OK_HTTP_STATUS = 200;
  authorizationUrl = 'https://tmt.account.tmtco.dev/api/identity/my-profile';
  constructor(private readonly httpService: HttpService) {}

  getUserInfo(token: string) {
    return this.httpService.get(this.authorizationUrl, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

  }
}
