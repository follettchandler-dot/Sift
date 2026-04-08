import { ScanUpload } from "@/components/scan-upload"

export default function ScanPage() {
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-1">Scan Receipt</h1>
      <p className="text-zinc-400 text-sm mb-6">
        Upload or photograph a receipt to extract and categorize items automatically.
      </p>
      <ScanUpload />
    </div>
  )
}
