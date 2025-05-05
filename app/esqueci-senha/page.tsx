import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Shell } from "@/components/shell"

export default function ResetPasswordPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-md py-12">
        <ResetPasswordForm />
      </div>
    </Shell>
  )
} 