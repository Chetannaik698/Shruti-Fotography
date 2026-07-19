import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSmartphone, FiCreditCard, FiCheckCircle, FiCopy, FiInfo, FiArrowRight, FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
import Reveal from '../components/Reveal'
import { useTheme } from '../context/ThemeContext'
import api from '../api/axios'

export default function Payment() {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    note: '',
  })
  const [copied, setCopied] = useState(false)
  const [phoneCopied, setPhoneCopied] = useState(false)
  
  // Confirmation form fields
  const [step, setStep] = useState(1) // 1: Info & QR, 2: Submit UTR, 3: Success
  const [confirmData, setConfirmData] = useState({
    email: '',
    phone: '',
    transactionId: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Default Payee VPA & Phone
  const rawPhoneNumber = '8105205660'
  const formattedPhoneNumber = '81052 05660'
  const upiId = 'rajgudigar1968-2@okaxis'
  const payeeName = 'Shruti Fotography'

  const handleChange = (e) => {
    const { id, value } = e.target
    // Limit amount to positive numbers
    if (id === 'amount' && value !== '' && parseFloat(value) < 0) return
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleConfirmChange = (e) => {
    const { id, value } = e.target
    setConfirmData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Generate UPI URI
  const upiLink = useMemo(() => {
    const base = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&cu=INR`
    const amt = formData.amount ? `&am=${formData.amount}` : ''
    // Combined note with name if name is provided
    const noteContent = formData.note 
      ? `${formData.note}${formData.name ? ` - by ${formData.name}` : ''}`
      : (formData.name ? `Booking payment by ${formData.name}` : 'Studio Payment')
    const tn = `&tn=${encodeURIComponent(noteContent)}`
    return `${base}${amt}${tn}`
  }, [formData, upiId, payeeName])

  // Dynamic QR Code URL using api.qrserver.com
  const qrCodeUrl = useMemo(() => {
    const colorHex = theme === 'dark' ? 'd4af37' : '0b0b0b'
    const bgColorHex = theme === 'dark' ? '151515' : 'f5f5f5'
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=20&color=${colorHex}&bgcolor=${bgColorHex}&data=${encodeURIComponent(upiLink)}`
  }, [upiLink, theme])

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyPhone = () => {
    navigator.clipboard.writeText(rawPhoneNumber)
    setPhoneCopied(true)
    setTimeout(() => setPhoneCopied(false), 2000)
  }

  const handleGoToConfirm = () => {
    if (!formData.name.trim()) {
      setSubmitError('Please enter your name first.')
      return
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setSubmitError('Please enter a valid payment amount.')
      return
    }
    setSubmitError('')
    setStep(2)
  }

  const handleSubmitConfirmation = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!confirmData.email.trim() || !confirmData.phone.trim() || !confirmData.transactionId.trim()) {
      setSubmitError('All confirmation fields (Email, Phone, and Transaction ID) are required.')
      return
    }

    if (confirmData.transactionId.trim().length < 6) {
      setSubmitError('Please enter a valid UPI transaction ID / UTR.')
      return
    }

    setSubmitting(true)
    try {
      const res = await api.post('/payments', {
        name: formData.name,
        amount: formData.amount,
        note: formData.note,
        email: confirmData.email,
        phone: confirmData.phone,
        transactionId: confirmData.transactionId,
      })

      if (res.data.success) {
        setStep(3)
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit payment verification. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', amount: '', note: '' })
    setConfirmData({ email: '', phone: '', transactionId: '' })
    setStep(1)
    setSubmitError('')
  }

  return (
    <div className="relative min-h-screen bg-bg pt-32 pb-24 md:pt-40">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Payment Center</p>
          <div className="divider-gold mx-auto my-5" />
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-ink leading-tight">
            Secure UPI Payments
          </h1>
          <p className="mt-5 text-muted max-w-lg mx-auto">
            Scan the QR code with any UPI app (GPay, PhonePe, Paytm, BHIM), transfer directly to the business mobile number, or click "Pay Now" on your mobile device to complete payment.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* Left Hand: Controls & Confirmation details */}
          <Reveal y={30} className="lg:col-span-6">
            <div className="rounded-md border border-ink/10 bg-card p-8 md:p-10 flex flex-col gap-6 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h2 className="font-display text-2xl text-ink">1. Enter Payment Info</h2>
                      <p className="text-xs text-muted mt-1">Specify how much you are paying to generate a custom QR code.</p>
                    </div>

                    {submitError && (
                      <div className="rounded-sm border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3 text-red-400 text-xs">
                        <FiAlertCircle size={16} className="shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="space-y-5">
                      <div>
                        <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-widest text-muted">
                          Your Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Pooja Kamath"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-sm border border-ink/15 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold"
                        />
                      </div>

                      <div>
                        <label htmlFor="amount" className="mb-2 block text-xs uppercase tracking-widest text-muted">
                          Amount (INR)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted font-semibold">₹</span>
                          <input
                            id="amount"
                            type="number"
                            placeholder="e.g. 1500"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full rounded-sm border border-ink/15 bg-transparent pl-8 pr-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="note" className="mb-2 block text-xs uppercase tracking-widest text-muted">
                          Payment Note / Session Details
                        </label>
                        <input
                          id="note"
                          type="text"
                          placeholder="e.g. Haldi shoot deposit / Invoice #"
                          value={formData.note}
                          onChange={handleChange}
                          className="w-full rounded-sm border border-ink/15 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleGoToConfirm}
                      className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
                    >
                      I Have Paid — Confirm Details <FiArrowRight size={14} />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.form
                    key="step-2"
                    onSubmit={handleSubmitConfirmation}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h2 className="font-display text-2xl text-ink">2. Confirm Transaction</h2>
                      <p className="text-xs text-muted mt-1">Provide your payment reference details for verification and receipt delivery.</p>
                    </div>

                    {submitError && (
                      <div className="rounded-sm border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3 text-red-400 text-xs">
                        <FiAlertCircle size={16} className="shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-muted mb-1">
                          Paying Amount
                        </label>
                        <p className="text-lg font-semibold text-gold">₹{formData.amount}</p>
                      </div>

                      <div>
                        <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-muted">
                          Your Email (for Receipt)
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          placeholder="pooja@example.com"
                          value={confirmData.email}
                          onChange={handleConfirmChange}
                          className="w-full rounded-sm border border-ink/15 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="mb-2 block text-xs uppercase tracking-widest text-muted">
                          Your Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={confirmData.phone}
                          onChange={handleConfirmChange}
                          className="w-full rounded-sm border border-ink/15 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold"
                        />
                      </div>

                      <div>
                        <label htmlFor="transactionId" className="mb-2 block text-xs uppercase tracking-widest text-muted flex items-center gap-1.5 flex-wrap">
                          UPI Transaction ID / UTR
                          <span className="text-[10px] text-gold normal-case font-normal">(12-digit number from payment app)</span>
                        </label>
                        <input
                          id="transactionId"
                          type="text"
                          required
                          placeholder="e.g. 618293749281"
                          value={confirmData.transactionId}
                          onChange={handleConfirmChange}
                          className="w-full rounded-sm border border-ink/15 bg-transparent px-4 py-3 text-sm font-mono tracking-wide text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {submitting ? 'Submitting...' : 'Submit Payment Confirmation'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSubmitError('')
                          setStep(1)
                        }}
                        className="btn-outline w-full flex items-center justify-center gap-2 py-2"
                      >
                        <FiArrowLeft size={14} /> Back to QR Code
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center text-center py-6 gap-6"
                  >
                    <div className="rounded-full bg-emerald-500/10 p-5 text-emerald-400">
                      <FiCheckCircle size={48} className="animate-pulse" />
                    </div>

                    <div>
                      <h2 className="font-display text-3xl text-ink">Payment Submitted!</h2>
                      <p className="text-xs text-muted mt-2 max-w-sm">
                        Thank you! Your payment confirmation has been recorded successfully.
                      </p>
                    </div>

                    <div className="w-full rounded-sm border border-gold/20 bg-gold/5 p-5 text-left text-xs flex flex-col gap-2.5">
                      <div className="flex justify-between border-b border-gold/10 pb-2">
                        <span className="text-muted">Name:</span>
                        <span className="font-semibold text-ink">{formData.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-gold/10 pb-2">
                        <span className="text-muted">Amount Paid:</span>
                        <span className="font-semibold text-gold text-sm">₹{formData.amount}</span>
                      </div>
                      <div className="flex justify-between border-b border-gold/10 pb-2">
                        <span className="text-muted">Transaction ID / UTR:</span>
                        <span className="font-mono text-ink">{confirmData.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Status:</span>
                        <span className="font-semibold text-yellow-500 uppercase tracking-wider text-[10px]">Pending Verification</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted max-w-sm leading-relaxed">
                      An email receipt has been sent to <span className="text-gold font-mono">{confirmData.email}</span>. Once verified against our bank logs, your booking status will be updated!
                    </p>

                    <button
                      onClick={resetForm}
                      className="btn-outline w-full mt-4"
                    >
                      Make Another Payment
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          {/* Right Hand: QR Code and Phone Details */}
          <Reveal y={30} delay={0.15} className="lg:col-span-6">
            <div className="rounded-md border border-ink/10 bg-card p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-gold h-full">
              
              {/* QR Frame Container */}
              <div className="relative group p-4 rounded-md border border-ink/10 bg-card overflow-hidden">
                <div className="absolute -inset-10 bg-gold/5 rounded-full blur-xl group-hover:bg-gold/10 transition-colors duration-500" />
                <img
                  src={qrCodeUrl}
                  alt="UPI QR Code"
                  width="250"
                  height="250"
                  className="relative z-10 mx-auto rounded-sm border border-gold/10 object-contain"
                />
              </div>

              <div className="mt-6">
                <span className="inline-flex items-center gap-1.5 text-xs text-gold uppercase tracking-widest font-semibold">
                  <FiSmartphone /> Scan QR Code
                </span>
                {formData.amount && (
                  <p className="mt-2 text-xl font-display font-medium text-ink">
                    Amount: <span className="text-gold">₹{formData.amount}</span>
                  </p>
                )}
                <p className="mt-3 text-xs text-muted max-w-[280px] mx-auto leading-relaxed">
                  Scan this dynamically generated QR code using any UPI app. It will automatically request the correct amount if entered.
                </p>
              </div>

              {/* UPI & Phone Details Info Panel */}
              <div className="mt-6 w-full rounded-sm border border-gold/20 bg-gold/5 p-4 flex flex-col gap-3 text-left">
                <div className="flex items-center justify-between text-xs border-b border-gold/10 pb-2">
                  <span className="text-muted uppercase tracking-wider">Payee:</span>
                  <span className="font-semibold text-ink">{payeeName}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs border-b border-gold/10 pb-2">
                  <span className="text-muted uppercase tracking-wider">UPI / GPay / PhonePe:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gold font-medium">{formattedPhoneNumber}</span>
                    <button
                      onClick={copyPhone}
                      className="text-ink/60 hover:text-ink transition-colors flex items-center gap-1"
                      title="Copy Phone Number"
                    >
                      {phoneCopied ? (
                        <span className="text-emerald-400 text-[10px] font-semibold">Copied!</span>
                      ) : (
                        <FiCopy size={12} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted uppercase tracking-wider">UPI ID / VPA:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gold font-medium">{upiId}</span>
                    <button
                      onClick={copyUpi}
                      className="text-ink/60 hover:text-ink transition-colors flex items-center gap-1"
                      title="Copy UPI ID"
                    >
                      {copied ? (
                        <span className="text-emerald-400 text-[10px] font-semibold">Copied!</span>
                      ) : (
                        <FiCopy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 w-full border-t border-ink/10 pt-6">
                <p className="text-xs text-muted mb-4 flex items-center justify-center gap-1">
                  <FiInfo size={12} className="text-gold" /> Clicking below will launch standard UPI applications
                </p>
                <a
                  href={upiLink}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <FiCreditCard size={16} /> Pay Now
                </a>
              </div>

            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
