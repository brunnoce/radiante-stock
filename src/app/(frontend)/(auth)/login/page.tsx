import Image from 'next/image'
import { LoginForm } from './LoginForm'

export const metadata = {
  title: 'Iniciar sesión - Radiante Stock',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <Image
            src="/logoRadiante.png"
            alt="Radiante"
            width={148}
            height={148}
            className="mx-auto mb-2"
            priority
          />
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
            Sistema de stock
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
