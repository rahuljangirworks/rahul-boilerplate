import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name?: string;
  loginUrl?: string;
}

export const WelcomeEmail = ({
  name = "there",
  loginUrl = "https://your-app.com/auth/sign-in",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Boilerplate - Let's get you started!</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoStyle}>⚡ BOILERPLATE</Text>
          </Section>
          <Section style={contentStyle}>
            <Heading style={headingStyle}>Welcome, {name}!</Heading>
            <Text style={paragraphStyle}>
              We are absolutely thrilled to have you here. Boilerplate is designed to help you build, scale, and launch your ideas in record time.
            </Text>
            <Text style={paragraphStyle}>
              To get started, let's jump right into your dashboard and check out what we've set up for you:
            </Text>
            
            <Section style={stepsSectionStyle}>
              <Row style={{ marginBottom: "16px" }}>
                <Column style={stepNumberContainerStyle}>
                  <span style={stepNumberStyle}>1</span>
                </Column>
                <Column style={stepContentStyle}>
                  <Text style={stepTitleStyle}>Explore your dashboard</Text>
                  <Text style={stepDescriptionStyle}>View your usage statistics, settings, and integrated services.</Text>
                </Column>
              </Row>

              <Row style={{ marginBottom: "16px" }}>
                <Column style={stepNumberContainerStyle}>
                  <span style={stepNumberStyle}>2</span>
                </Column>
                <Column style={stepContentStyle}>
                  <Text style={stepTitleStyle}>Create your first project</Text>
                  <Text style={stepDescriptionStyle}>Set up your workspaces and start organizing your tasks efficiently.</Text>
                </Column>
              </Row>

              <Row style={{ marginBottom: "0px" }}>
                <Column style={stepNumberContainerStyle}>
                  <span style={stepNumberStyle}>3</span>
                </Column>
                <Column style={stepContentStyle}>
                  <Text style={stepTitleStyle}>Connect your integrations</Text>
                  <Text style={stepDescriptionStyle}>Hook up R2 storage, Database connections, and Billing in minutes.</Text>
                </Column>
              </Row>
            </Section>

            <Section style={ctaSectionStyle}>
              <Button href={loginUrl} style={buttonStyle}>
                Go to Dashboard
              </Button>
            </Section>

            <Text style={paragraphStyle}>
              If you have any questions, simply reply to this email. Our support team is always here to help.
            </Text>
            
            <Text style={signatureStyle}>
              Best regards,<br />
              The Boilerplate Team
            </Text>
          </Section>
          
          <Hr style={hrStyle} />
          
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              © 2026 Boilerplate Inc. All rights reserved.
            </Text>
            <Text style={footerLinkStyle}>
              <Link href="https://your-app.com/privacy" style={linkStyle}>Privacy Policy</Link> •{" "}
              <Link href="https://your-app.com/terms" style={linkStyle}>Terms of Service</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const mainStyle = {
  backgroundColor: "#f9fafb",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const containerStyle = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const headerStyle = {
  padding: "32px 0 24px",
  textAlign: "center" as const,
};

const logoStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#6366f1",
  letterSpacing: "1.5px",
  margin: "0",
};

const contentStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "40px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
};

const headingStyle = {
  fontSize: "26px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#111827",
  margin: "0 0 20px",
};

const paragraphStyle = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#4b5563",
  margin: "0 0 20px",
};

const stepsSectionStyle = {
  backgroundColor: "#f3f4f6",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "24px 0",
};

const stepNumberContainerStyle = {
  width: "36px",
  verticalAlign: "top",
};

const stepNumberStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  backgroundColor: "#6366f1",
  color: "#ffffff",
  fontWeight: "bold",
  fontSize: "14px",
  textAlign: "center" as const,
  lineHeight: "28px",
};

const stepContentStyle = {
  paddingLeft: "12px",
};

const stepTitleStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#191f2b",
  margin: "0 0 4px",
};

const stepDescriptionStyle = {
  fontSize: "14px",
  color: "#4b5563",
  margin: "0",
};

const ctaSectionStyle = {
  textAlign: "center" as const,
  margin: "32px 0 24px",
};

const buttonStyle = {
  backgroundColor: "#6366f1",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  lineHeight: "100%",
};

const signatureStyle = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#4b5563",
  margin: "24px 0 0",
};

const hrStyle = {
  borderColor: "#e5e7eb",
  margin: "32px 0 24px",
};

const footerStyle = {
  textAlign: "center" as const,
};

const footerTextStyle = {
  fontSize: "14px",
  color: "#9ca3af",
  margin: "0 0 8px",
};

const footerLinkStyle = {
  fontSize: "14px",
  color: "#9ca3af",
  margin: "0",
};

const linkStyle = {
  color: "#6366f1",
  textDecoration: "underline",
};
