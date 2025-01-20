import { Injectable, UnauthorizedException } from "@nestjs/common";
import { google } from "googleapis";
import { PrismaService } from "./prisma.service";

@Injectable()
export class GoogleService {
  private oauth2Client;
  private callbackPath = process.env.GOOGLE_REDIRECT_PATH;
  private googleRedirectUrl =
    process.env.NODE_ENV == "production"
      ? `${process.env.BACKEND_URI}/${this.callbackPath}`
      : `http://localhost:3000/${this.callbackPath}`;

  constructor(private prisma: PrismaService) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      this.googleRedirectUrl,
    );
  }

  getConsentUrl(state: string): string {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/business.manage",
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      state: state,
    });
  }

  async getTokens(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  async verifyBusinessProfileAccount(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    // Retrieve user profile
    const oauth2 = google.oauth2({
      auth: this.oauth2Client,
      version: "v2",
    });

    const userInfo = await oauth2.userinfo.get();
    const { email } = userInfo.data;

    // Check if the account has access to Google Business Profiles
    const myBusiness = google.mybusinessaccountmanagement({
      auth: this.oauth2Client,
      version: "v1",
    });

    try {
      const accounts = await myBusiness.accounts.list();

      if (!accounts.data.accounts || accounts.data.accounts.length === 0) {
        throw new UnauthorizedException(
          "This Google account is not associated with a Google Business Profile.",
        );
      }

      // save token to DB;
      return {
        email,
        accounts: accounts.data.accounts,
        tokens,
      };
    } catch (error) {
      throw new UnauthorizedException(
        "Error verifying Google Business Profile association: " + error.message,
      );
    }
  }

  // async getReviews(
  //   accessToken: string,
  //   locationName: string,
  //   startDate: string,
  //   endDate: string,
  // ) {
  //   try {
  //     // Fetch reviews from the Google Business Profile API
  //     const response = await fetch(
  //       `https://mybusiness.googleapis.com/v4/${locationName}/reviews`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     );

  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch reviews: ${response.statusText}`);
  //     }

  //     const data = await response.json();

  //     // Filter reviews by date
  //     const reviews = data.reviews || [];
  //     const filteredReviews = reviews.filter((review) => {
  //       const reviewDate = new Date(review.createTime);
  //       return (
  //         reviewDate >= new Date(startDate) && reviewDate <= new Date(endDate)
  //       );
  //     });

  //     return filteredReviews;
  //   } catch (error) {
  //     console.error("Error fetching reviews:", error.message);
  //     throw error;
  //   }
  // }

  // list accounts

  // list locations of account
}
