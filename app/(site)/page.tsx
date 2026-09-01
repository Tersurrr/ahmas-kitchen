export default function MaintenancePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#22201b",
        color: "#f3ead6",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "500px" }}>
        <p
          style={{
            color: "#a8452f",
            fontSize: "14px",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          Ahmas Kitchen
        </p>

        <h1
          style={{
            color: "#e8b93f",
            fontSize: "48px",
            marginBottom: "16px",
          }}
        >
          We&apos;ll Be Back Soon
        </h1>

        <p
          style={{
            color: "#b9af9a",
            fontSize: "18px",
            lineHeight: "1.6",
          }}
        >
          Our website is currently undergoing maintenance
          <br />
          We&apos;re working to make things better for you
        </p>

        <p style={{ marginTop: "30px" }}>
          Need to place an order?
        </p>

        <a
          href="https://wa.me/18572615923"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "10px",
            padding: "14px 24px",
            background: "#25D366",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Order on WhatsApp
        </a>

        <p
          style={{
            marginTop: "30px",
            color: "#8f8879",
            fontSize: "13px",
          }}
        >
          Thank you for your patience.
        </p>
      </div>
    </main>
  );
}