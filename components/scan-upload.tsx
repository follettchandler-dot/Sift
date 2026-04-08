"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Camera, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function ScanUpload() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function processFile(file: File) {
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("receipt", file)

      const res = await fetch("/api/receipts/scan", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong processing your receipt.")
        setLoading(false)
        return
      }

      router.push(`/receipts/${data.id}`)
    } catch {
      setError("Failed to upload receipt. Please try again.")
      setLoading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !loading && fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-emerald-500 bg-emerald-500/5"
            : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50",
          loading && "pointer-events-none opacity-60"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="size-10 text-emerald-400 animate-spin" />
            <div>
              <p className="font-medium text-zinc-200">Processing receipt…</p>
              <p className="text-sm text-zinc-500 mt-1">
                Scanning, extracting items, and categorizing
              </p>
            </div>
          </>
        ) : (
          <>
            <Upload className="size-10 text-zinc-500" />
            <div>
              <p className="font-medium text-zinc-200">
                Drop a receipt image here
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                or click to browse files
              </p>
            </div>
            <p className="text-xs text-zinc-600">PNG, JPG, HEIC up to 10MB</p>
          </>
        )}
      </div>

      {/* Camera button for mobile */}
      <Button
        variant="outline"
        className="gap-2"
        disabled={loading}
        onClick={() => cameraInputRef.current?.click()}
      >
        <Camera className="size-4" />
        Take Photo
      </Button>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
