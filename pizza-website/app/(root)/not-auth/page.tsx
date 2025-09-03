import { InfoBlock } from "@/shared/components/shared";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <InfoBlock
        title="Доступ заборонений"
        text="Цю сторінку можуть переглядати лише авторизовані користувачі"
        imageUrl="/images/assets/password.png"
      />
    </div>
  );
}
