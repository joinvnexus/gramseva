export default function Loader() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <div className="animate-pulse absolute inset-0 flex items-center justify-center">
          <span className="text-primary text-xs">🌾</span>
        </div>
      </div>
    </div>
  );
}