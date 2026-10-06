import Image from "next/image"
import Link from "next/link"

const products = [
  ["VQ ERP", "Bring core operations into one controlled system.", "Connect sales, purchasing, inventory, administration and reporting through role-based workflows.", "/products/erp", "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80"],
  ["VQ Inventory", "Know what you have, where it is and how it moved.", "Manage stock across locations with clearer receiving, transfers, adjustments, counts and reorder decisions.", "/products/inventory-management", "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"],
  ["VQ POS", "Keep every sale connected to stock and branch reporting.", "Give staff a focused checkout while management retains visibility across products, customers and locations.", "/products/pos", "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80"],
  ["VQ WhatsApp CRM", "Give every conversation an owner and a next step.", "Organize customer chats, assignments, statuses, templates, follow-ups and team performance from one workspace.", "/products/whatsapp-crm", "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80"]
]

export function ProductsBentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((p, i) => (
        <div key={p[0]} className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col group hover:shadow-md hover:border-[#06a8e6]/40 transition-all duration-300 p-6 md:p-8">
          <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-xl bg-slate-100 shadow-sm border border-slate-200 mb-8">
            <Image 
              src={p[4]} 
              alt={p[0]} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
              loading="lazy" 
            />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0078a8] mb-6 font-manrope font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">0{i+1}</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{p[0]}</h3>
            <p className="text-slate-600 mb-6 text-base leading-relaxed flex-1"><strong>{p[1]}</strong> {p[2]}</p>
            <Link className="inline-flex items-center text-[#0078a8] font-bold hover:text-[#005e86] transition-colors mt-auto" href={p[3] as string}>
              Explore {p[0].replace("VQ ", "")} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
