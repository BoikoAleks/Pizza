// ФАЙЛ: app/(manager)/manager/chat/layout.tsx
export default function ChatsLayout({
  children, // Це буде `page.tsx` (список чатів)
  chat,     // Це буде `@chat` (інтерфейс чату)
}: {
  children: React.ReactNode;
  chat: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[var(--primary)]">Чати з клієнтами</h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-[75vh]">
        
        {/* Ліва колонка завжди показує список чатів */}
        <div className="md:col-span-4 lg:col-span-3 border rounded-lg bg-white overflow-y-auto">
          {children}
        </div>
        
        {/* Права колонка показує або заглушку, або сам чат */}
        <div className="md:col-span-8 lg:col-span-9 border rounded-lg bg-white flex flex-col">
          {chat}
        </div>

      </div>
    </div>
  );
}