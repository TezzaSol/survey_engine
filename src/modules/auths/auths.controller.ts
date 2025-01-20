import {
  Controller,
  Redirect,
  Get,
  Query,
  Res,
  Req,
  Request,
} from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import { GoogleService } from "src/shared/services/google.service";
import { AuthsService } from "./auths.service";
import { Response } from "express";

@Controller("auths")
export class AuthsController {
  constructor(
    private readonly authsService: AuthsService,
    private googleService: GoogleService,
  ) {}

  @Redirect()
  @Get("google")
  async googleLogin(@Request() req) {
    const userId = req?.user?.sub;
    const state = Buffer.from(JSON.stringify({ userId })).toString("base64");
    const url = this.googleService.getConsentUrl(state);
    return { url };
  }

  @Public()
  @Get("google/callback")
  async callback(
    @Query("code") code: string,
    @Res() res: Response,
    @Query("state") state: string,
  ) {
    if (!code) {
      return { message: "Authorization code not found" };
    }
    const { userId } = JSON.parse(Buffer.from(state, "base64").toString());
    const tokens = await this.googleService.getTokens(code);
    const platform = await this.authsService.googleAcc(userId, tokens);

    // const { email, accounts, tokens } =
    //   await this.googleService.verifyBusinessProfileAccount(code);
    return res.json({ message: "Authentication successful" });
  }
}
