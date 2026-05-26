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
} from "@react-email/components";
import * as React from "react";

interface NotificationEmailProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionUrl?: string;
}

export const NotificationEmail = ({
  title = "New Activity Detected",
  message = "You have received a new notification on your account. Please log in to see the details.",
  actionLabel = "View Alert",
  actionUrl = "https://your-app.com/dashboard",
}: NotificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Text style={logoStyle}>⚡ BOILERPLATE</Text>
          </Section>
          <Section style={contentStyle}>
            <Heading style={headingStyle}>{title}</Heading>
            
            <Section style={alertBoxStyle}>
              <Text style={messageStyle}>{message}</Text>
            </Section>

            {actionUrl && (
              <Section style={ctaSectionStyle}>
                <Button href={actionUrl} style={buttonStyle}>
                  {actionLabel}
                </Button>
              </Section>
            )}

            <Text style={noticeStyle}>
              If you did not expect this notification or believe this is an error, please ignore this email or contact support.
            </Text>
          </Section>
          
          <Hr style={hrStyle} />
          
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              © 2026 Boilerplate Inc. All rights reserved.
            </Text>
            <Text style={footerLinkStyle}>
              <Link href="https://your-app.com/settings" style={linkStyle}>Manage Notification Preferences</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NotificationEmail;

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
  fontSize: "22px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#111827",
  margin: "0 0 16px",
};

const alertBoxStyle = {
  backgroundColor: "#eff6ff",
  borderLeft: "4px solid #3b82f6",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "20px 0 28px",
};

const messageStyle = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#1e3a8a",
  margin: "0",
};

const ctaSectionStyle = {
  textAlign: "center" as const,
  margin: "28px 0 24px",
};

const buttonStyle = {
  backgroundColor: "#3b82f6",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "11px 22px",
  lineHeight: "100%",
};

const noticeStyle = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#6b7280",
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
  fontSize: "13px",
  color: "#9ca3af",
  margin: "0 0 8px",
};

const footerLinkStyle = {
  fontSize: "13px",
  color: "#9ca3af",
  margin: "0",
};

const linkStyle = {
  color: "#3b82f6",
  textDecoration: "underline",
};
