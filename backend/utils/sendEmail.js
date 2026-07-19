import nodemailer from 'nodemailer'

const sendEmail = async ({ to, subject, text, html }) => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  // Fallback to console logging if credentials are missing
  if (!user || !pass) {
    console.warn('⚠️ SMTP credentials not found in env. Logging email to console:')
    console.log('==================== MOCK EMAIL START ====================')
    console.log(`TO      : ${to}`)
    console.log(`SUBJECT : ${subject}`)
    console.log(`CONTENT :`)
    console.log(text)
    console.log('====================  MOCK EMAIL END  ====================')
    return { mockSent: true, messageId: 'mock-id-' + Date.now() }
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, 
    auth: {
      user,
      pass,
    },
  })

  const mailOptions = {
    from: `"Shruti Fotography" <${user}>`,
    to,
    subject,
    text,
    html: html || text.split('\n').join('<br>'),
  }

  const info = await transporter.sendMail(mailOptions)
  return info
}

export default sendEmail
