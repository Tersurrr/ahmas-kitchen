export function clientAddress(request: Pick<Request, "headers">) {
  const netlifyAddress = request.headers.get("x-nf-client-connection-ip")?.trim();
  if (netlifyAddress) return netlifyAddress;

  if (process.env.VERCEL !== "1") return null;
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}
