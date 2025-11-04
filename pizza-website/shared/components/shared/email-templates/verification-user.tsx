import React from "react";

interface Props {
  code: string;
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const VerificationUserTemplate: React.FC<Props> = ({ code }) => (
  <div>
    <p>
      Код підтвердження: <h2>{code}</h2>
    </p>

    <p>
      <a href={`${appUrl}/api/auth/verify?code=${code}`}>
        Підтвердити реєстрацію
      </a>
    </p>
  </div>
);
