import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Eye, EyeOff, Loader, Lock, Mail, User } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// ============================================================================
// AUTH VARIANT 1: Login Form
// ============================================================================
export interface LoginFormProps {
  logo?: React.ReactNode
  title?: string
  description?: string
  onSubmit?: (data: { username: string; password: string }) => Promise<void>
  onForgotPassword?: () => void
  onSignUp?: () => void
  socialProviders?: Array<'google' | 'github'>
  className?: string
}

export function LoginForm({
  logo,
  title = 'Welcome back',
  description = 'Enter your credentials to access your account',
  onSubmit,
  onForgotPassword,
  onSignUp,
  socialProviders,
  className,
}: LoginFormProps) {
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
  })
  const [showPassword, setShowPassword] = React.useState(false)

  const { isPending, mutate: handleSubmit } = useMutation({
    mutationFn: async (e: React.SubmitEvent) => {
      e.preventDefault()
      onSubmit?.(formData)
    },
  })

  return (
    <div className={cn('mx-auto w-full max-w-md', className)}>
      <Card>
        <CardHeader className="space-y-4 text-center">
          {logo && <div className="mx-auto">{logo}</div>}
          <div>
            <CardTitle className="font-black text-2xl uppercase">
              {title}
            </CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-bold text-xs uppercase">
                Username
              </Label>
              <div className="relative">
                <Mail className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="username"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold text-xs uppercase">
                Password
              </Label>
              <div className="relative">
                <Lock className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pr-10 pl-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="top-1/2 right-3 absolute text-muted-foreground hover:text-foreground -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="font-bold text-primary text-sm hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>

            <Button
              disabled={isPending}
              type="submit"
              className="w-full"
              size="lg"
            >
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  <span> Sign In</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>

            {socialProviders && socialProviders.length > 0 && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="border-foreground border-t-2 w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 font-bold text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="gap-3 grid grid-cols-2">
                  {socialProviders.includes('google') && (
                    <Button variant="outline" type="button">
                      {/* <Chrome className="mr-2 w-4 h-4" /> */}
                      Google
                    </Button>
                  )}
                  {socialProviders.includes('github') && (
                    <Button variant="outline" type="button">
                      {/* <Github className="mr-2 w-4 h-4" /> */}
                      GitHub
                    </Button>
                  )}
                </div>
              </>
            )}

            {onSignUp && (
              <p className="mt-4 text-muted-foreground text-sm text-center">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSignUp}
                  className="font-bold text-primary hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// AUTH VARIANT 2: Sign Up Form
// ============================================================================
export interface SignUpFormProps {
  logo?: React.ReactNode
  title?: string
  description?: string
  onSubmit?: (data: { name: string; password: string; terms: boolean }) => void
  onSignIn?: () => void
  socialProviders?: Array<'google' | 'github'>
  termsUrl?: string
  privacyUrl?: string
  className?: string
}

export function SignUpForm({
  logo,
  title = 'Create an account',
  description = 'Enter your details to get started',
  onSubmit,
  onSignIn,
  socialProviders,
  className,
}: SignUpFormProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    password: '',
    terms: false,
  })
  const [showPassword, setShowPassword] = React.useState(false)

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <div className={cn('mx-auto w-full max-w-md', className)}>
      <Card>
        <CardHeader className="space-y-4 text-center">
          {logo && <div className="mx-auto">{logo}</div>}
          <div>
            <CardTitle className="font-black text-2xl uppercase">
              {title}
            </CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-bold text-xs uppercase">
                Username
              </Label>
              <div className="relative">
                <User className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="signup-password"
                className="font-bold text-xs uppercase"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className="pr-10 pl-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="top-1/2 right-3 absolute text-muted-foreground hover:text-foreground -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Account
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            {socialProviders && socialProviders.length > 0 && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="border-foreground border-t-2 w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 font-bold text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="gap-3 grid grid-cols-2">
                  {socialProviders.includes('google') && (
                    <Button variant="outline" type="button">
                      {/* <Chrome className="mr-2 w-4 h-4" /> */}
                      Google
                    </Button>
                  )}
                  {socialProviders.includes('github') && (
                    <Button variant="outline" type="button">
                      {/* <Github className="mr-2 w-4 h-4" /> */}
                      GitHub
                    </Button>
                  )}
                </div>
              </>
            )}

            {onSignIn && (
              <p className="mt-4 text-muted-foreground text-sm text-center">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSignIn}
                  className="font-bold text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// AUTH VARIANT 3: Forgot Password Form
// ============================================================================
export interface ForgotPasswordFormProps {
  logo?: React.ReactNode
  title?: string
  description?: string
  onSubmit?: (email: string) => void
  onBackToLogin?: () => void
  className?: string
}

export function ForgotPasswordForm({
  logo,
  title = 'Forgot password?',
  description = "No worries, we'll send you reset instructions.",
  onSubmit,
  onBackToLogin,
  className,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    onSubmit?.(email)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={cn('mx-auto w-full max-w-md', className)}>
        <Card>
          <CardContent className="space-y-4 pt-6 text-center">
            <div className="flex justify-center items-center bg-success/20 shadow-[4px_4px_0px_hsl(var(--shadow-color))] mx-auto border-3 border-foreground w-16 h-16">
              <Mail className="w-8 h-8 text-success" />
            </div>
            <div>
              <h3 className="font-black text-xl uppercase">Check your email</h3>
              <p className="mt-2 text-muted-foreground text-sm">
                We sent a password reset link to{' '}
                <span className="font-bold text-foreground">{email}</span>
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={onBackToLogin}
            >
              Back to login
            </Button>
            <p className="text-muted-foreground text-xs">
              Didn't receive the email?{' '}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="font-bold text-primary hover:underline"
              >
                Click to resend
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn('mx-auto w-full max-w-md', className)}>
      <Card>
        <CardHeader className="space-y-4 text-center">
          {logo && <div className="mx-auto">{logo}</div>}
          <div>
            <CardTitle className="font-black text-2xl uppercase">
              {title}
            </CardTitle>
            <CardDescription className="mt-2">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="reset-email"
                className="font-bold text-xs uppercase"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Send Reset Link
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            {onBackToLogin && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={onBackToLogin}
              >
                Back to login
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// AUTH VARIANT 4: OTP Verification Form
// ============================================================================
export interface OTPVerificationFormProps {
  logo?: React.ReactNode
  title?: string
  description?: string
  email?: string
  length?: number
  onSubmit?: (otp: string) => void
  onResend?: () => void
  onBackToLogin?: () => void
  className?: string
}

export function OTPVerificationForm({
  logo,
  title = 'Verify your email',
  description,
  email,
  length = 6,
  onSubmit,
  onResend,
  onBackToLogin,
  className,
}: OTPVerificationFormProps) {
  const [otp, setOtp] = React.useState<string[]>(new Array(length).fill(''))
  const inputRefs = React.useRef<HTMLInputElement[]>([])
  const hasSubmitted = React.useRef(false)

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    hasSubmitted.current = false

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (
      newOtp.every((digit) => digit !== '') &&
      newOtp.join('').length === length
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!hasSubmitted.current) {
        hasSubmitted.current = true
        onSubmit?.(newOtp.join(''))
      }
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, length)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < length) newOtp[index] = char
    })
    setOtp(newOtp)

    if (newOtp.every((digit) => digit !== '') && !hasSubmitted.current) {
      hasSubmitted.current = true
      onSubmit?.(newOtp.join(''))
    }
  }

  return (
    <div className={cn('mx-auto w-full max-w-md', className)}>
      <Card>
        <CardHeader className="space-y-4 text-center">
          {logo && <div className="mx-auto">{logo}</div>}
          <div>
            <CardTitle className="font-black text-2xl uppercase">
              {title}
            </CardTitle>
            <CardDescription className="mt-2">
              {description ||
                `We sent a ${length}-digit code to ${email || 'your email'}. Enter it below.`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={`otp-digit-${index}`}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 font-black text-2xl text-center"
              />
            ))}
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              if (!hasSubmitted.current) {
                hasSubmitted.current = true
                onSubmit?.(otp.join(''))
              }
            }}
            disabled={otp.some((digit) => digit === '')}
          >
            Verify
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <div className="space-y-2 text-center">
            {onResend && (
              <p className="text-muted-foreground text-sm">
                Didn't receive a code?{' '}
                <button
                  type="button"
                  onClick={onResend}
                  className="font-bold text-primary hover:underline"
                >
                  Resend
                </button>
              </p>
            )}
            {onBackToLogin && (
              <Button variant="ghost" size="sm" onClick={onBackToLogin}>
                Back to login
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// AUTH VARIANT 5: Split Auth Layout
// ============================================================================
export interface AuthSplitLayoutProps {
  children: React.ReactNode
  brandContent?: React.ReactNode
  brandBackground?: string
  position?: 'left' | 'right'
  className?: string
}

export function AuthSplitLayout({
  children,
  brandContent,
  brandBackground = 'bg-primary',
  position = 'left',
  className,
}: AuthSplitLayoutProps) {
  return (
    <div className={cn('flex min-h-screen', className)}>
      {position === 'left' && brandContent && (
        <div
          className={cn(
            'hidden lg:flex flex-col justify-center p-12 lg:w-1/2',
            brandBackground,
          )}
        >
          {brandContent}
        </div>
      )}

      <div className="flex flex-1 justify-center items-center p-4 md:p-8">
        {children}
      </div>

      {position === 'right' && brandContent && (
        <div
          className={cn(
            'hidden lg:flex flex-col justify-center p-12 lg:w-1/2',
            brandBackground,
          )}
        >
          {brandContent}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Export all variants
// ============================================================================
export const AuthForms = {
  Login: LoginForm,
  SignUp: SignUpForm,
  ForgotPassword: ForgotPasswordForm,
  OTPVerification: OTPVerificationForm,
  SplitLayout: AuthSplitLayout,
}
