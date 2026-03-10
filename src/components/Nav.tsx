'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/app/(frontend)/(app)/actions'

const links = [
  { href: '/', label: 'Vista General' },
  { href: '/stock', label: 'Gestión' },
  { href: '/historial', label: 'Historial' },
  { href: '/admin', label: 'Administración' },
]

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const close = () => setOpen(false)

  function handleLogout() {
    startTransition(async () => {
      await logoutAction()
      router.push('/login')
    })
  }

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" onClick={close} className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Radiante" width={26} height={26} priority />
          <span className="text-xs font-bold uppercase tracking-widest text-white">
            Radiante Stock
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs uppercase tracking-widest transition-colors hover:text-red-600 ${
                pathname === href ? 'font-medium text-white' : 'text-white/50'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <Button
              variant="ghost"
              className="text-xs uppercase tracking-widest text-white/50 hover:bg-transparent hover:text-red-600"
              disabled={isPending}
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Salir
            </Button>
          </div>

          <button
            className="flex flex-col justify-center gap-1 p-2 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            {open ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <>
                <span className="block h-0.5 w-5 bg-red-600" />
                <span className="block h-0.5 w-5 bg-red-600" />
                <span className="block h-0.5 w-5 bg-red-600" />
              </>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-black md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className={`border-b border-white/5 py-3 text-xs uppercase tracking-widest transition-colors hover:text-red-600 ${
                  pathname === href ? 'font-medium text-white' : 'text-white/50'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-3">
              <Button
                variant="ghost"
                className="text-xs uppercase tracking-widest text-white/50 hover:bg-transparent hover:text-red-600"
                disabled={isPending}
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Salir
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
