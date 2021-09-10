import type { NextApiRequest, NextApiResponse } from "next";
import { Employee } from "../../models/Employee";
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
    from: process.env.SENDGRID_EMAIL_FROM,
    subject: process.env.SENDGRID_EMAIL_SUBJECT,
    text: message,
    html: message.replace(/\r\n/g, "<br />"),
  };

  try {
    await mail.send(data);
    res.status(200).json({ status: "OK", message: "Email has been sent!" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "ERROR", message: "Error sending email", error });
  }
};
