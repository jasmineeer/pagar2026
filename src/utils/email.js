const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendNewRegistrationEmail = async (adminEmails, newUser) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmails,
        subject: "Pemberitahuan: Registrasi Akun Baru Perlu Persetujuan",
        html: `
            <h3>Registrasi Baru</h3>
            <p>Ada akun baru dengan detail sebagai berikut yang menunggu persetujuan:</p>
            <ul>
                <li>Nama: ${newUser.name}</li>
                <li>Role: ${newUser.role}</li>
                <li>Email: ${newUser.email}</li>
            </ul>
            <p>Mohon segera login ke dashboard Admin untuk melakukan verifikasi.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification email sent to Admins`);
    } catch (err) {
        throw new Error(`Failed to send email: ${err.message}`);
    }
};

const sendApprovalEmail = async (userEmail, userName, adminEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Selamat! Akun Anda Telah Disetujui",
        html: `
            <h2>Halo, ${userName}!</h2>
            <p>Akun Anda telah <b>disetujui</b>.</p>
            <p>Sekarang Anda sudah bisa login dan menggunakan layanan kami sepenuhnya.</p>
            <br>
            <p><small>Disetujui oleh Admin: ${adminEmail}</small></p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent to ${userEmail}`);
    } catch (err) {
        throw new Error(`Failed to send email: ${err.message}`);
    }
};

const sendResetLink = async (email, resetToken) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Link",
        html: `
            <p>Anda meminta untuk mereset password.</p>
            <p>Berikut adalah link untuk mereset password Anda:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>Link ini valid selama 1 jam.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reset link has been sent to ${email}`);
    } catch (err) {
        throw new Error(`Failed to send email: ${err.message}`);
    }
};

module.exports = {
    sendNewRegistrationEmail,
    sendApprovalEmail,
    sendResetLink
};
