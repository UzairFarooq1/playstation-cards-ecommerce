import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center opacity-100">
      <Loader2 className="h-8 w-8 animate-spin text-gray-800" />
    </div>
  );
}
