import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple mobile-first landing page */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Logo/Brand - Simple text, no images */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-3">
            📋 CotizaciónPro
          </h1>
          <p className="text-xl text-gray-700">
            Cotizaciones profesionales en minutos
          </p>
        </div>

        {/* Simple benefit bullets */}
        <div className="w-full max-w-md mb-12 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-lg">✅ Crea cotizaciones desde tu celular</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-lg">✅ Luce más profesional</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-lg">✅ Comparte por WhatsApp</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-lg">✅ Cálculo automático con IVA</p>
          </div>
        </div>

        {/* Large CTA buttons */}
        <div className="w-full max-w-md space-y-4">
          <Link
            href="/registro"
            className="block w-full bg-primary hover:bg-primary-dark text-white text-center py-4 px-6 rounded-lg text-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Crear Cuenta Gratis
          </Link>

          <Link
            href="/login"
            className="block w-full bg-white hover:bg-gray-50 text-gray-800 text-center py-4 px-6 rounded-lg text-xl font-bold border-2 border-gray-300 active:scale-95 transition-transform"
          >
            Ya Tengo Cuenta
          </Link>
        </div>

        {/* Pricing hint */}
        <p className="text-gray-600 mt-8 text-center">
          Solo $20 USD al mes • Cancela cuando quieras
        </p>
      </main>
    </div>
  );
}
