import "server-only";

import axios from "axios";

export default class Zendesk {
  static domain = "godhandusa.zendesk.com";
  static email = process.env.ZENDESK_EMAIL;
  static authToken = Buffer.from(
    `${Zendesk.email}/token:${process.env.ZENDESK_API_TOKEN}`
  ).toString("base64");

  static async createTicket(
    requester: { name: string; email: string },
    issue: string,
    body: string,
    order: string,
    uploads: string[]
  ) {
    const ticket = {
      requester,
      comment: {
        body,
        uploads,
      },
      priority: "normal",
      tags: [issue],
      custom_fields: [
        { id: "4833800983839", value: requester.name },
        { id: "4833869099551", value: requester.email },
        { id: "4833861297951", value: order },
        { id: "4833808736927", value: issue },
      ],
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
  }
}
