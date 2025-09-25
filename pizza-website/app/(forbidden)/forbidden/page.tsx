import { Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <Lock className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">Доступ заборонено</h1>
      <p className="text-lg text-gray-600 mb-8">
        У вас недостатньо прав для перегляду цієї сторінки.
      </p>
      <Button asChild>
        <Link href="/">Повернутись на головну</Link>
      </Button>
    </div>
  );
}
