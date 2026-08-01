function SpinLoader({ message = "Loading..." }) {
  return (
    <div className="absolute inset-0 z-40 flex h-full w-full items-center justify-center bg-black/65 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/80 px-6 py-5 shadow-2xl shadow-black/30">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-600/40 border-t-primary-color" />
        <p className="text-sm font-medium tracking-wide text-primary-color/90">{message}</p>
      </div>
    </div>
  );
}

export default SpinLoader;
