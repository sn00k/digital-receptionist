import type { NextApiRequest, NextApiResponse } from "next";
import { Employee } from "../../entities/Employee";
import { Visitor } from "../../entities/Visitor";
import { getOrCreateConnection } from "../../utils/db";
const mail = require("@sendgrid/mail");

mail.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { visitor, notifyEmployees } = req.body;
  const to = notifyEmployees.map((e: Employee) => e.email);

  const message = `
    Hello,\r\n\r\n

    ${visitor.firstName} ${visitor.lastName} ${
    visitor.company && "from " + visitor.company
  } is waiting for you in the reception.\r\n\r\n

    This email has been sent to:\r\n
    ${to.join(", ")}
  `;

  const data = {
    to,
    from: {
      name: process.env.SENDGRID_EMAIL_SENDER_NAME,
      email: process.env.SENDGRID_EMAIL_SENDER_EMAIL,
    },
    subject: process.env.SENDGRID_EMAIL_SUBJECT,
    text: message,
    html: message.replace(/\r\n/g, "<br />"),
  };

  try {
    await mail.send(data);

    // OK
    const conn = await getOrCreateConnection();
    const dbRes = await conn
      .createQueryBuilder()
      .insert()
      .into<Visitor>("visitor")
      .values([
        {
          name: `${visitor.firstName} ${visitor.lastName}`,
          email: visitor.email,
          company: visitor.company,
        },
      ])
      .execute();

    res.status(200).json({ status: "OK", message: "Email has been sent!" });
  } catch (error) {
    console.log("error: ", error);
    if (error.response) {
      console.error(error.response.body);
    }

    res.status(500).json({ status: "ERROR", message: "Error sending email" });
  }
};
