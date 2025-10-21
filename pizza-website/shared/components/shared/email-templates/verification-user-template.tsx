import { Body, Container, Head, Heading, Html, Img, Preview, Section, Text } from "@react-email/components";
import * as React from "react";

interface Props {
  fullName: string;
  code: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

export const VerificationUserTemplate = ({ fullName, code }: Props) => (
  <Html>
    <Head />
    <Preview>Republic Pizza - Підтвердження реєстрації</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="120"
          height="30"
          alt="Republic Pizza"
          style={logo}
        />
        <Heading style={heading}>Ласкаво просимо, {fullName}!</Heading>
        <Section style={mainSection}>
          <Text style={paragraph}>
            Дякуємо за реєстрацію в Republic Pizza! Щоб завершити створення
            вашого акаунту, будь ласка, використайте цей код підтвердження:
          </Text>
          <div style={codeContainer}>
            <Text style={codeText}>{code}</Text>
          </div>
          <Text style={paragraph}>
            Якщо ви не реєструвалися на нашому сайті, просто проігноруйте цей
            лист.
          </Text>
        </Section>
        <Text style={footerText}>
          З найкращими побажаннями,
          <br />
          Команда Republic Pizza
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationUserTemplate;