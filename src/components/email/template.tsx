import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Preview,
} from "@react-email/components";

type EmailTemplateProps = {
  subject: string;
  body: string;
};

export const EmailTemplate = ({ subject, body }: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoStyle}>ADMIRATE</Text>
          </Section>

          <Section style={contentStyle}>
            <Text style={headingStyle}>{subject}</Text>
            <div
              dangerouslySetInnerHTML={{ __html: body.replace(/\n/g, "<br/>") }}
              style={bodyTextStyle}
            />
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              ADMIRATE — Strategic Design & Marketing Agency
            </Text>
            <Link href="https://admirate.in" style={linkStyle}>
              admirate.in
            </Link>
            <Text style={unsubscribeStyle}>
              If you no longer wish to receive these emails, please reply with
              &quot;unsubscribe&quot;.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const bodyStyle = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden" as const,
};

const headerStyle = {
  backgroundColor: "#0a0a0a",
  padding: "24px 32px",
};

const logoStyle = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  margin: "0",
};

const contentStyle = {
  padding: "32px",
};

const headingStyle = {
  fontSize: "22px",
  fontWeight: "600" as const,
  color: "#0a0a0a",
  marginBottom: "16px",
};

const bodyTextStyle = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#374151",
};

const hrStyle = {
  borderColor: "#e5e7eb",
  margin: "0",
};

const footerStyle = {
  padding: "24px 32px",
  backgroundColor: "#fafafa",
};

const footerTextStyle = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "0 0 4px 0",
};

const linkStyle = {
  fontSize: "13px",
  color: "#dc2626",
};

const unsubscribeStyle = {
  fontSize: "11px",
  color: "#9ca3af",
  marginTop: "12px",
};

export default EmailTemplate;
