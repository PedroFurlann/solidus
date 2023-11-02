
export function Loading() {
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-full flex flex-col items-center justify-center bg-opacity-50 bg-black">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-400 border-solid"></div>
      <p className="mt-4 text-white font-extrabold">Carregando...</p>
    </div>
  );
}
