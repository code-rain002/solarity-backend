import nodemailer from "nodemailer";
import { fetchOptionGroup } from "../helpers";

class Mailer {
  async init() {
    try {
      const {
        smtp_security,
        smtp_password,
        smtp_username,
        smtp_port,
        smtp_address,
        smtp_from,
      } = await fetchOptionGroup("smtp");
      this.from = smtp_from || smtp_username;
      this.transporter = nodemailer.createTransport({
        host: smtp_address,
        port: parseInt(smtp_port),
        secure: smtp_security == "true",
        auth: {
          user: smtp_username,
          pass: smtp_password,
        },
      });
    } catch (err) {
      this.error = true;
    }
  }

  templateResolver = (template) => {
    return require(`./templates/${template}.email.js`).default;
  };

  async send({ from = null, subject, text, body, to }) {
    if (this.error) return false;
    await this.transporter.sendMail({
      from: from || this.from,
      to,
      subject,
      text,
      html: body,
    });
  }

  async sendTemplate({ from = null, template, values = {}, to }) {
    if (this.error) return false;
    try {
      const { subject, text, body } = this.templateResolver(template)(values);
      await this.send({ from, subject, text, body, to });
    } catch (err) {
      return false;
    }
  }
}

export default Mailer;
