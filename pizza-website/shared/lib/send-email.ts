import { Resend } from 'resend';

const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'Republics <support@republics.app>';

export const sendEmail = async (to: string, subject: string, template: React.ReactNode) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to,
        subject,
        text: '',
        react: template,
    });

    if (error) {
        throw error;
    }

    return data;
};