import { VerifyForm } from "@/shared/components/shared/verify-form";

export default function VerifyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Підтвердження пошти</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ми надіслали 6-значний код на вашу поштову скриньку.
          </p>
        </div>
        <VerifyForm />
      </div>
    </div>
  );
}
