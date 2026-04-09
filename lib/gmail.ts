import { google } from "googleapis";

const GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

export function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/connect/gmail/callback`
  );
}

export function getAuthorizationUrl(state?: string) {
  const client = createOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    scope: GMAIL_SCOPES,
    prompt: "consent",
    ...(state ? { state } : {}),
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = createOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

export async function refreshAccessToken(refreshToken: string) {
  const client = createOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await client.refreshAccessToken();
  return credentials;
}

export function getGmailClient(accessToken: string) {
  const client = createOAuthClient();
  client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: "v1", auth: client });
}

export async function searchReceiptEmails(
  gmailClient: ReturnType<typeof getGmailClient>,
  afterDate?: Date
) {
  const dateFilter = afterDate
    ? ` after:${Math.floor(afterDate.getTime() / 1000)}`
    : "";

  const query =
    `from:(walmart OR target OR amazon OR costco OR "home depot" OR starbucks OR doordash OR uber OR walgreens OR cvs OR kroger OR "whole foods" OR bestbuy OR lowes OR instacart OR grubhub OR chipotle OR mcdonalds OR chick-fil-a OR dominos OR publix OR aldi OR safeway OR wegmans OR lyft OR airbnb OR netflix OR spotify OR apple OR google OR microsoft OR paypal OR venmo OR etsy OR ebay OR shopify OR "dollar general" OR "trader joes")` +
    ` subject:(receipt OR order OR confirmation OR purchase OR invoice OR "order confirmation" OR "your order" OR "you bought" OR "payment confirmation")` +
    dateFilter;

  const response = await gmailClient.users.messages.list({
    userId: "me",
    q: query,
    maxResults: 50,
  });

  return response.data.messages || [];
}

export async function getEmailContent(
  gmailClient: ReturnType<typeof getGmailClient>,
  messageId: string
) {
  const response = await gmailClient.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });

  const message = response.data;
  const payload = message.payload;

  if (!payload) return null;

  // Try to find HTML or plain text body
  let htmlBody: string | null = null;
  let textBody: string | null = null;

  type MessagePart = NonNullable<typeof payload>["parts"];
  function extractParts(parts: MessagePart) {
    if (!parts) return;
    for (const part of parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        htmlBody = Buffer.from(part.body.data, "base64url").toString("utf-8");
      } else if (part.mimeType === "text/plain" && part.body?.data) {
        textBody = Buffer.from(part.body.data, "base64url").toString("utf-8");
      } else if (part.parts) {
        extractParts(part.parts);
      }
    }
  }

  if (payload.body?.data) {
    const raw = Buffer.from(payload.body.data, "base64url").toString("utf-8");
    if (payload.mimeType === "text/html") htmlBody = raw;
    else textBody = raw;
  } else {
    extractParts(payload.parts);
  }

  return {
    messageId,
    subject:
      payload.headers?.find((h) => h.name?.toLowerCase() === "subject")
        ?.value ?? "",
    from:
      payload.headers?.find((h) => h.name?.toLowerCase() === "from")?.value ??
      "",
    date:
      payload.headers?.find((h) => h.name?.toLowerCase() === "date")?.value ??
      "",
    htmlBody,
    textBody,
  };
}

export function extractTextFromHtml(html: string): string {
  // Remove script and style blocks
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    // Replace block-level tags with newlines
    .replace(/<\/?(br|p|div|tr|li|h[1-6]|table|thead|tbody|tfoot)[^>]*>/gi, "\n")
    // Replace td/th with spaces
    .replace(/<\/?(td|th)[^>]*>/gi, " | ")
    // Strip remaining tags
    .replace(/<[^>]+>/g, " ")
    // Decode common HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, " ")
    // Collapse whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text;
}
