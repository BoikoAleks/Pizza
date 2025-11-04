import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
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

const main: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  width: "100%",
  padding: "24px 0",
  color: "#111827",
  fontFamily:
    'Inter, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "24px",
  width: "600px",
  borderRadius: "10px",
  backgroundColor: "#ffffff",
};

const logo: React.CSSProperties = {
  display: "block",
  margin: "0 auto 20px",
};

const heading: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 700,
  textAlign: "center",
  margin: "0 0 12px",
};

const mainSection: React.CSSProperties = {
  padding: "12px 0",
  borderTop: "1px solid #e6e9ee",
};

const paragraph: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 12px",
};

const codeContainer: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "12px",
  margin: "12px 0",
  backgroundColor: "#f3f4f6",
  borderRadius: "6px",
};

const codeText: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 700,
  letterSpacing: "4px",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#6b7280",
  textAlign: "center",
  marginTop: "18px",
};

export default VerificationUserTemplate;
