'use client'

import React from 'react'
import { NavGroup } from '@payloadcms/ui'

const frontendLinks = [
  { href: '/', label: 'Vista General' },
  { href: '/stock', label: 'Gestión' },
  { href: '/historial', label: 'Historial' },
]

export function FrontendNavLinks() {
  return (
    <NavGroup label="Frontend">
      {frontendLinks.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          style={{
            display: 'block',
            padding: '4px 16px 4px 32px',
            fontSize: '13px',
            color: 'var(--theme-elevation-400)',
            textDecoration: 'none',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--theme-elevation-800)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--theme-elevation-400)')}
        >
          {label}
        </a>
      ))}
    </NavGroup>
  )
}
