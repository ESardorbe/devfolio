import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  // --- OTP yuborish ---
  async sendOtp(email: string, otp: string, name?: string) {
    await this.transporter.sendMail({
      from: `"DevFolio" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'DevFolio — Tasdiqlash kodi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
          <h2 style="color: #1a1a2e; margin-bottom: 8px;">Salom${name ? `, ${name}` : ''}! 👋</h2>
          <p style="color: #6b7280;">DevFolio hisobingizni tasdiqlash uchun quyidagi kodni kiriting:</p>
          <div style="background: #1a1a2e; color: #fff; font-size: 36px; font-weight: bold; letter-spacing: 12px; text-align: center; padding: 24px; border-radius: 8px; margin: 24px 0;">
            ${otp}
          </div>
          <p style="color: #9ca3af; font-size: 13px;">Kod <strong>10 daqiqa</strong> ichida amal qiladi. Agar siz bu so'rovni yubormagan bo'lsangiz, e'tibor bermang.</p>
        </div>
      `,
    });
    this.logger.log(`OTP yuborildi: ${email}`);
  }

  // --- Parol tiklash ---
  async sendPasswordReset(email: string, resetUrl: string, name?: string) {
    await this.transporter.sendMail({
      from: `"DevFolio" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'DevFolio — Parolni tiklash',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9fafb; border-radius: 12px;">
          <h2 style="color: #1a1a2e;">Parolni tiklash 🔐</h2>
          <p style="color: #6b7280;">Salom${name ? ` ${name}` : ''}! Parolni tiklash uchun quyidagi tugmani bosing:</p>
          <a href="${resetUrl}" style="display: block; background: #6366f1; color: #fff; text-align: center; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 24px 0;">
            Parolni tiklash
          </a>
          <p style="color: #9ca3af; font-size: 13px;">Havola <strong>30 daqiqa</strong> amal qiladi. Agar siz bu so'rovni yubormagan bo'lsangiz, e'tibor bermang.</p>
        </div>
      `,
    });
    this.logger.log(`Reset email yuborildi: ${email}`);
  }
}