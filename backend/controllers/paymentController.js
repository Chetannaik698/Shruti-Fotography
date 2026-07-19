import asyncHandler from 'express-async-handler'
import Payment from '../models/Payment.js'
import sendEmail from '../utils/sendEmail.js'

// @desc    Submit a payment confirmation
// @route   POST /api/payments
// @access  Public
export const createPayment = asyncHandler(async (req, res) => {
  const { name, email, phone, amount, transactionId, note } = req.body

  if (!name || !email || !phone || !amount || !transactionId) {
    res.status(400)
    throw new Error('Please fill in all required fields: name, email, phone, amount, and transactionId')
  }

  // Check unique transaction ID
  const existingPayment = await Payment.findOne({ transactionId: transactionId.trim() })
  if (existingPayment) {
    res.status(400)
    throw new Error('This Transaction ID / UTR has already been submitted.')
  }

  const payment = await Payment.create({
    name,
    email,
    phone,
    amount: Number(amount),
    transactionId: transactionId.trim(),
    note,
  })

  // Prepare emails
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)

  // 1. Email to Customer
  const customerEmailSubject = 'Payment Confirmation Submitted - Shruti Fotography'
  const customerEmailText = `Hello ${name},\n\nWe have received your payment confirmation submission for ${formattedAmount}.\n\nDetails:\n- Transaction ID/UTR: ${transactionId}\n- Note/Reference: ${note || 'N/A'}\n- Status: Pending Verification\n\nOur team is verifying this payment against our bank records. We will send you an email confirmation as soon as it is approved. Thank you!\n\nBest Regards,\nShruti Fotography`

  // 2. Email to Admin (Owner)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@lumiframestudio.com'
  const adminEmailSubject = 'NEW PAYMENT ALERT: Verification Required'
  const adminEmailText = `A new payment confirmation has been submitted and requires verification.\n\nCustomer Details:\n- Name: ${name}\n- Email: ${email}\n- Phone: ${phone}\n\nPayment Details:\n- Amount: ${formattedAmount}\n- Transaction ID/UTR: ${transactionId}\n- Note: ${note || 'N/A'}\n- Submitted At: ${payment.createdAt.toLocaleString()}\n\nPlease verify this transaction in the Admin Dashboard: ${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/payments`

  try {
    // Send customer receipt
    await sendEmail({
      to: email,
      subject: customerEmailSubject,
      text: customerEmailText,
    })

    // Send admin notification
    await sendEmail({
      to: adminEmail,
      subject: adminEmailSubject,
      text: adminEmailText,
    })
  } catch (emailError) {
    console.error('Failed to send verification email(s):', emailError.message)
    // We do not crash the request since the payment entry is successfully created in database
  }

  res.status(201).json({
    success: true,
    message: 'Payment confirmation submitted successfully. Verification email sent!',
    payment,
  })
})

// @desc    Get all payment submissions
// @route   GET /api/payments
// @access  Private/Admin
export const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 })
  res.status(200).json({
    success: true,
    count: payments.length,
    payments,
  })
})

// @desc    Update payment verification status
// @route   PUT /api/payments/:id/status
// @access  Private/Admin
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  
  if (!['verified', 'rejected'].includes(status)) {
    res.status(400)
    throw new Error('Invalid status. Must be either "verified" or "rejected"')
  }

  const payment = await Payment.findById(req.params.id)
  if (!payment) {
    res.status(404)
    throw new Error('Payment record not found')
  }

  payment.status = status
  await payment.save()

  // Send status update email to customer
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(payment.amount)

  const updateSubject = `Payment Verification Status: ${status.toUpperCase()} - Shruti Fotography`
  let updateText = `Hello ${payment.name},\n\n`

  if (status === 'verified') {
    updateText += `Great news! Your payment of ${formattedAmount} (Transaction ID: ${payment.transactionId}) has been successfully verified by our team.\n\nYour session booking is now fully confirmed. We look forward to capturing your beautiful memories!\n\nIf you have any questions, feel free to reach out to us at +91 81052 05660.`
  } else {
    updateText += `We were unable to verify your payment of ${formattedAmount} (Transaction ID: ${payment.transactionId}) against our bank statement.\n\nPlease check the Transaction ID / UTR you entered, or contact us at +91 81052 05660 to resolve this payment issue.`
  }

  updateText += `\n\nBest Regards,\nShruti Fotography`

  try {
    await sendEmail({
      to: payment.email,
      subject: updateSubject,
      text: updateText,
    })
  } catch (emailError) {
    console.error('Failed to send status update email:', emailError.message)
  }

  res.status(200).json({
    success: true,
    message: `Payment status updated to ${status} successfully.`,
    payment,
  })
})
