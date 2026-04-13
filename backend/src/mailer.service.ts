import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService implements OnModuleInit {
    private readonly transporter: nodemailer.Transporter;
    private readonly logger = new Logger(MailerService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.MAIL_PORT) || 587,
            secure: process.env.MAIL_SECURE === 'true', // false pour port 587 (STARTTLS)
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS, // ⚠️ Doit être un App Password Gmail (16 car.), PAS votre mot de passe habituel
            },
            tls: {
                rejectUnauthorized: false, // Accepte les certificats auto-signés en dev
            },
        });
    }

    // Vérifie la connexion SMTP au démarrage de l'application
    async onModuleInit() {
        try {
            await this.transporter.verify();
            this.logger.log('✅ Connexion SMTP établie avec succès !');
        } catch (error) {
            this.logger.error('❌ Échec de connexion SMTP. Vérifiez vos variables MAIL_* dans .env');
            this.logger.error(`   HOST: ${process.env.MAIL_HOST}`);
            this.logger.error(`   PORT: ${process.env.MAIL_PORT}`);
            this.logger.error(`   USER: ${process.env.MAIL_USER}`);
            this.logger.error(`   Erreur: ${(error as Error).message}`);
        }
    }

    async sendMail(recepteur: string, name: string) {
        try {
            this.logger.log(`📧 Envoi email de bienvenue à: ${recepteur}`);
            const info = await this.transporter.sendMail({
                from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
                to: recepteur,
                subject: 'Bienvenue sur la plateforme',
                html: `<p>Bonjour <strong>${name}</strong>,</p><p>Bienvenue sur notre plateforme. Nous sommes ravis de vous compter parmi nous.</p>`,
            });

            this.logger.log(`✅ Email envoyé ! ID: ${info.messageId}`);
            return info;
        } catch (error) {
            const err = error as Error;
            this.logger.error(`❌ Échec envoi email à ${recepteur}: ${err.message}`);
            throw error;
        }
    }

    async sendPasswordResetMail(recepteur: string, token: string) {
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;

        try {
            this.logger.log(`📧 Envoi email de réinitialisation à: ${recepteur}`);
            const info = await this.transporter.sendMail({
                from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
                to: recepteur,
                subject: 'Réinitialisation de votre mot de passe',
                html: `
                    <p>Bonjour,</p>
                    <p>Pour réinitialiser votre mot de passe, cliquez sur ce lien :</p>
                    <p><a href="${resetLink}" style="background:#4F46E5;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Réinitialiser mon mot de passe</a></p>
                    <p>Ce lien est valable 1 heure. Si vous n'avez pas fait cette demande, ignorez cet email.</p>
                `,
            });

            this.logger.log(`✅ Email de réinitialisation envoyé ! ID: ${info.messageId}`);
            return info;
        } catch (error) {
            const err = error as Error;
            this.logger.error(`❌ Échec envoi email réinitialisation à ${recepteur}: ${err.message}`);
            throw error;
        }
    }
}