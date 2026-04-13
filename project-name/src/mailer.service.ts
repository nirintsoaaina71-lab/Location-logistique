import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
    private readonly resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendMail(recepteur: string, name: string) {
        const { data, error } = await this.resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [recepteur],
            subject: 'Bienvenue sur la plateforme',
            html: `Bonjour ${name}, bienvenue sur notre plateforme. Nous sommes ravis de vous compter parmi nous.`,
        });

        if (error) {
            console.error({ error });
            return;
        }

        console.log({ data });
        return data;
    }

    async sendPasswordResetMail(recepteur: string, token: string) {
        // En mode développement, on pointe vers localhost:5173 (votre frontend)
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        
        const { data, error } = await this.resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [recepteur],
            subject: 'Réinitialisation de votre mot de passe',
            html: `<p>Bonjour,</p><p>Pour réinitialiser votre mot de passe, veuillez cliquer sur ce lien : <br/> <a href="${resetLink}">Réinitialiser mon mot de passe</a></p>`,
        });

        if (error) {
            console.error({ error });
            return;
        }

        console.log({ data });
        return data;
    }
}