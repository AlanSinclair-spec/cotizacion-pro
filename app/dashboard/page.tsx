'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario')
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">📋 CotizaciónPro</h1>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Hola, {userName}
          </h2>
          <p className="text-gray-600">
            ¿Listo para crear una cotización?
          </p>
        </div>

        {/* Giant Create Quote Button */}
        <Link
          href="/crear-cotizacion"
          className="block w-full bg-primary hover:bg-primary-dark text-white text-center py-8 px-6 rounded-xl text-2xl font-bold shadow-xl active:scale-95 transition-transform mb-6"
        >
          ➕ Crear Cotización
        </Link>

        {/* Quick Stats / Recent Quotes Section (placeholder for now) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Tus Cotizaciones
          </h3>
          <p className="text-gray-500 text-center py-8">
            Aún no has creado cotizaciones.
            <br />
            ¡Crea tu primera cotización arriba!
          </p>
        </div>
      </div>
    </div>
  )
}
