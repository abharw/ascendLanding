"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { List, X } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Programs", href: "/programs" },
  { label: "Impact", href: "/impact" },
  { label: "Sponsor", href: "/sponsor" },
  { label: "The Team", href: "/team" },
  { label: "Contact", href: "/contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <Image src="/ascendiq-logo.png" alt="AscendIQ" width={48} height={48} className="h-12 w-auto" />
            <span className="font-bold text-xl tracking-tight text-foreground">AscendIQ</span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <List className="size-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-10">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/enroll">Enroll Now</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu - z-[60] ensures it sits above hero and header */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background px-6 py-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Image src="/ascendiq-logo.png" alt="AscendIQ" width={48} height={48} className="h-12 w-auto" />
                <span className="font-bold text-xl tracking-tight text-foreground">AscendIQ</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  {navLinks.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-secondary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/enroll" onClick={() => setMobileMenuOpen(false)}>
                      Enroll Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
