"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../css/Auth.css"
import { useAuth } from "../contexts/AuthContext"

const VerifyOTP = () => {
  const navigate = useNavigate()
  const { user, verifyOTP, resendOTP } = useAuth()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (user && user.isVerified) {
      navigate("/")
    }
    if (!user) {
      navigate("/signin")
    }
  }, [user, navigate])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false)
    }
  }, [countdown, resendDisabled])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!otp.trim()) {
      setError("Please enter the OTP")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const result = await verifyOTP(otp)

      if (result.success) {
        navigate("/")
      } else {
        setError(result.error || "Invalid OTP. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOTP = async () => {
    setResendDisabled(true)
    setCountdown(60)

    try {
      const result = await resendOTP()

      if (!result.success) {
        setError(result.error || "Failed to resend OTP")
      } else {
        setError("OTP resent successfully")
        setCountdown(60)
        setResendDisabled(true)
      }
    } catch (err) {
      setError("An error occurred while resending OTP")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Verify Your Account</h2>
          <p>Enter the OTP sent to your email</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="otp">
              One-Time Password (OTP)
              <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="otp-input"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
            </div>
          </div>

          <button type="submit" className={`auth-button ${isSubmitting ? "loading" : ""}`} disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Didn't receive the OTP?{" "}
            <button onClick={handleResendOTP} disabled={resendDisabled} className="resend-button">
              {resendDisabled ? `Resend in ${countdown}s` : "Resend OTP"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP
