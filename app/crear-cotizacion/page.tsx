'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type LineItem = {
  id: string
  description: string
  quantity: number
  pricePerUnit: number
}

export default function CreateQuotePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Customer info
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, pricePerUnit: 0 }
  ])

  useEffect(() => {
    checkUser()
    // Load from localStorage if available
    loadFromLocalStorage()
  }, [])

  // Save to localStorage on every change (for slow internet)
  useEffect(() => {
    if (!loading) {
      saveToLocalStorage()
    }
  }, [customerName, customerPhone, lineItems, loading])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setLoading(false)
  }

  function saveToLocalStorage() {
    localStorage.setItem('draft_quote', JSON.stringify({
      customerName,
      customerPhone,
      lineItems
    }))
  }

  function loadFromLocalStorage() {
    const draft = localStorage.getItem('draft_quote')
    if (draft) {
      const parsed = JSON.parse(draft)
      setCustomerName(parsed.customerName || '')
      setCustomerPhone(parsed.customerPhone || '')
      setLineItems(parsed.lineItems || [{ id: '1', description: '', quantity: 1, pricePerUnit: 0 }])
    }
  }

  function addLineItem() {
    const newId = Date.now().toString()
    setLineItems([...lineItems, { id: newId, description: '', quantity: 1, pricePerUnit: 0 }])
  }

  function removeLineItem(id: string) {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id))
    }
  }

  function updateLineItem(id: string, field: keyof LineItem, value: string | number) {
    setLineItems(lineItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  // Calculations
  const subtotal = lineItems.reduce((sum, item) => {
    return sum + (item.quantity * item.pricePerUnit)
  }, 0)

  const iva = subtotal * 0.16 // 16% IVA
  const total = subtotal + iva

  async function handleSaveQuote() {
    // Basic validation
    if (!customerName.trim()) {
      alert('Por favor ingresa el nombre del cliente')
      return
    }

    if (lineItems.some(item => !item.description.trim())) {
      alert('Por favor completa todas las descripciones')
      return
    }

    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('No user found')

      // Save to database
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          user_id: user.id,
          customer_name: customerName,
          customer_phone: customerPhone,
          line_items: lineItems,
          subtotal,
          iva,
          total,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Clear localStorage
      localStorage.removeItem('draft_quote')

      // Redirect to view quote
      router.push(`/cotizacion/${data.id}`)
    } catch (error) {
      console.error('Error saving quote:', error)
      alert('Error al guardar. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="text-primary font-bold text-lg"
          >
            ← Atrás
          </button>
          <h1 className="text-xl font-bold text-gray-800">Nueva Cotización</h1>
          <div className="w-16"></div> {/* Spacer */}
        </div>
      </div>

      <div className="px-6 py-6 max-w-2xl mx-auto">
        {/* Customer Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Datos del Cliente</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Nombre del Cliente *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-lg"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2 text-gray-700">
                Teléfono / WhatsApp
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-lg"
                placeholder="Ej: 55 1234 5678"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Conceptos</h2>

          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div key={item.id} className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-700">#{index + 1}</span>
                  {lineItems.length > 1 && (
                    <button
                      onClick={() => removeLineItem(item.id)}
                      className="text-red-500 font-bold"
                    >
                      ✕ Eliminar
                    </button>
                  )}
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="block text-base font-semibold mb-1 text-gray-700">
                    Descripción *
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Ej: Instalación de tuberías"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Quantity */}
                  <div>
                    <label className="block text-base font-semibold mb-1 text-gray-700">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Price per unit */}
                  <div>
                    <label className="block text-base font-semibold mb-1 text-gray-700">
                      Precio c/u ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.pricePerUnit}
                      onChange={(e) => updateLineItem(item.id, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Subtotal for this line */}
                <div className="mt-3 text-right">
                  <span className="text-lg font-bold text-gray-700">
                    Subtotal: ${(item.quantity * item.pricePerUnit).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Line Item Button */}
          <button
            onClick={addLineItem}
            className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-bold active:scale-95 transition-transform"
          >
            + Agregar Concepto
          </button>
        </div>

        {/* Totals */}
        <div className="bg-primary-light rounded-lg shadow-sm p-6 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Subtotal:</span>
              <span className="font-bold">${subtotal.toFixed(2)} MXN</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold">IVA (16%):</span>
              <span className="font-bold">${iva.toFixed(2)} MXN</span>
            </div>
            <div className="border-t-2 border-primary pt-3 flex justify-between text-2xl">
              <span className="font-bold">TOTAL:</span>
              <span className="font-bold text-primary-dark">${total.toFixed(2)} MXN</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveQuote}
          disabled={saving}
          className="w-full bg-primary hover:bg-primary-dark text-white py-4 px-6 rounded-lg text-xl font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Guardando...' : 'Guardar Cotización'}
        </button>
      </div>
    </div>
  )
}
