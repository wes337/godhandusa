import "server-only";

import axios from "axios";

export default class Zendesk {
  static domain = "godhandusa.zendesk.com";
  static email = "support@godhandusa.zendesk.com";
  static authToken = Buffer.from(
    `${Zendesk.email}/token:${process.env.ZENDESK_API_TOKEN}`
  ).toString("base64");

  static async createTicket(
    requester: { name: string; email: string },
    subject: string,
    body: string
  ) {
    try {
      const ticket = {
        requester: {
          name: requester.name,
          email: requester.email,
        },
        subject,
        comment: {
          body,
        },
        priority: "normal",
      };

      const response = await axios.post(
        `https://${Zendesk.domain}/api/v2/tickets.json`,
        { ticket },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Zendesk.authToken}`,
          },
        }
      );

      return response.data.ticket;
    } catch (error: any) {
      console.log(error.message);
      throw Error(error);
    }
  }

  static async getTicket(ticketId: string) {
    const response = await axios.get(
      `https://${Zendesk.domain}/api/v2/tickets/${ticketId}.json`,
      {
        headers: {
          Authorization: `Basic ${Zendesk.authToken}`,
        },
      }
    );

    const ticket = response.data.ticket;

    return ticket || null;
  }
}
