'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type LineItem = {
  id: string
  description: string
  quantity: number
  pricePerUnit: number
}

type Quote = {
  id: string
  customer_name: string
  customer_phone: string
  line_items: LineItem[]
  subtotal: number
  iva: number
  total: number
  created_at: string
}

export default function ViewQuotePage() {
  const [loading, setLoading] = useState(true)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [userName, setUserName] = useState('')
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    loadQuote()
  }, [])

  async function loadQuote() {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario')

      // Load quote
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      setQuote(data)
    } catch (error) {
      console.error('Error loading quote:', error)
      alert('Error al cargar la cotización')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  async function handleShare() {
    const text = `Cotización para ${quote?.customer_name}\n\nTotal: $${quote?.total.toFixed(2)} MXN\n\nVer detalles: ${window.location.href}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cotización - CotizaciónPro',
          text: text,
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(text)
      alert('Enlace copiado al portapapeles')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Cotización no encontrada</p>
      </div>
    )
  }

  const quoteDate = new Date(quote.created_at).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action buttons - NOT part of screenshot */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 print:hidden">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary font-bold text-lg"
          >
            ← Dashboard
          </button>
          <button
            onClick={handleShare}
            className="bg-primary text-white px-4 py-2 rounded-lg font-bold"
          >
            📤 Compartir
          </button>
        </div>
      </div>

      {/* Quote Display - Optimized for screenshots */}
      <div className="px-6 py-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" id="quote-content">

          {/* Header - Professional looking */}
          <div className="bg-primary text-white px-6 py-6">
            <h1 className="text-3xl font-bold mb-2">COTIZACIÓN</h1>
            <p className="text-lg opacity-90">CotizaciónPro</p>
          </div>

          {/* Quote details */}
          <div className="px-6 py-6">
            {/* Date */}
            <div className="mb-6">
              <p className="text-gray-600 text-lg">
                <strong>Fecha:</strong> {quoteDate}
              </p>
            </div>

            {/* Customer info */}
            <div className="mb-6 pb-6 border-b-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Para:</h2>
              <p className="text-lg font-semibold text-gray-800">{quote.customer_name}</p>
              {quote.customer_phone && (
                <p className="text-gray-600">📱 {quote.customer_phone}</p>
              )}
            </div>

            {/* Line items */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Conceptos:</h2>
              <div className="space-y-4">
                {quote.line_items.map((item, index) => (
                  <div key={item.id} className="border-b border-gray-200 pb-3">
                    <p className="font-semibold text-gray-800 mb-1">
                      {index + 1}. {item.description}
                    </p>
                    <div className="flex justify-between text-gray-600">
                      <span>
                        {item.quantity} × ${item.pricePerUnit.toFixed(2)}
                      </span>
                      <span className="font-bold">
                        ${(item.quantity * item.pricePerUnit).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals - Large and clear */}
            <div className="bg-gray-50 rounded-lg px-6 py-6">
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold">${quote.subtotal.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">IVA (16%):</span>
                  <span className="font-semibold">${quote.iva.toFixed(2)} MXN</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3 mt-3 flex justify-between">
                  <span className="text-2xl font-bold text-gray-900">TOTAL:</span>
                  <span className="text-2xl font-bold text-primary">
                    ${quote.total.toFixed(2)} MXN
                  </span>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                Gracias por su preferencia
              </p>
              <p className="text-center text-gray-400 text-xs mt-2">
                Creado con CotizaciónPro
              </p>
            </div>
          </div>
        </div>

        {/* Instructions for user */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 print:hidden">
          <p className="text-blue-800 font-semibold mb-2">
            💡 Cómo enviar esta cotización:
          </p>
          <ol className="text-blue-700 space-y-1 text-sm list-decimal list-inside">
            <li>Toma captura de pantalla (screenshot)</li>
            <li>Comparte por WhatsApp con tu cliente</li>
            <li>O usa el botón &quot;Compartir&quot; arriba</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
