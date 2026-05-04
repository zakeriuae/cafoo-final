import { Spinner } from "@/components/ui/spinner"

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] h-[70vh] w-full animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="h-12 w-12 text-primary" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          Loading Data...
        </p>
      </div>
    </div>
  )
}
