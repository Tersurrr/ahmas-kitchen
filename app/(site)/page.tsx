```tsx
import { Caveat, DM_Sans } from "next/font/google";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function MaintenancePage() {
  return (
    <main className={`${dmSans.className} stage`}>
      <div className="hook" />
      <div className="string" />

      <div className="signWrap">
        <div className="board">
          <div className="eyebrow">Ahmas Kitchen</div>

          <h1 className={`${caveat.className} headline`}>
            Back in a bit
          </h1>

          <p className={`${caveat.className} subhead`}>
            the kitchen is under maintenance
          </p>

          <div className="divider" />

          <p className="message">
            We&apos;re currently running maintenance on the site. Please
            contact Ahmas Kitchen directly via WhatsApp{" "}
            <a
              href="https://wa.me/18572615923"
              target="_blank"
              rel="noopener noreferrer"
            >
              +18572615923
            </a>{" "}
            for your orders.
            <br />
            Sorry for the inconvenience.
          </p>

          <div className="statusRow">
            <span className="dot" />
            <span>Currently closed for updates</span>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className={`${caveat.className} footerName`}>
          Ahmas Kitchen
        </div>

        <div className="footerSub">
          THANK YOU FOR YOUR PATIENCE
        </div>
      </div>

      <style jsx>{`
        :global(html),
        :global(body) {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background: #22201b;
        }

        :global(body) {
          overflow-x: hidden;
        }

        .stage {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8vh 20px 6vh;
          position: relative;
          background: #22201b;
          background-image:
            radial-gradient(
              ellipse at 50% -10%,
              rgba(232, 185, 63, 0.08),
              transparent 55%
            ),
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.05) 0px,
              rgba(0, 0, 0, 0.05) 1px,
              transparent 1px,
              transparent 3px
            );
          color: #f3ead6;
          overflow-x: hidden;
        }

        .hook {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 35% 30%,
            #8b8370,
            #4a4536
          );
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
          margin-bottom: -2px;
          z-index: 3;
        }

        .string {
          width: 2px;
          height: 46px;
          background: #6b6152;
          transform-origin: top center;
          z-index: 2;
        }

        .signWrap {
          transform-origin: top center;
          animation: swing 6s ease-in-out infinite;
        }

        @keyframes swing {
          0%,
          100% {
            transform: rotate(-2.3deg);
          }

          50% {
            transform: rotate(2.3deg);
          }
        }

        .board {
          width: min(420px, 86vw);
          background: #2e3229;
          border: 10px solid #3b4033;
          border-radius: 10px;
          padding: 46px 34px 38px;
          box-shadow:
            0 30px 60px -20px rgba(0, 0, 0, 0.7),
            inset 0 0 40px rgba(0, 0, 0, 0.35);
          position: relative;
          text-align: center;
        }

        .board::before {
          content: "";
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 20px;
          background: #6b6152;
        }

        .eyebrow {
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #a8452f;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .headline {
          font-size: 64px;
          line-height: 0.95;
          color: #e8b93f;
          font-weight: 700;
          margin: 0 0 6px;
          text-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
        }

        .subhead {
          font-size: 30px;
          color: #f3ead6;
          margin: 0 0 22px;
          font-weight: 600;
        }

        .divider {
          width: 60px;
          height: 2px;
          background: #b9af9a;
          opacity: 0.35;
          margin: 0 auto 22px;
        }

        .message {
          font-size: 15px;
          line-height: 1.65;
          color: #b9af9a;
          margin: 0 0 26px;
          font-weight: 400;
        }

        .message a {
          color: white;
          text-decoration: underline;
        }

        .statusRow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid rgba(243, 234, 214, 0.15);
          border-radius: 999px;
          font-size: 13px;
          color: #b9af9a;
          letter-spacing: 0.02em;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a8452f;
          box-shadow: 0 0 0 3px rgba(168, 69, 47, 0.2);
          animation: pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.45;
          }
        }

        .footer {
          margin-top: 34px;
          text-align: center;
        }

        .footerName {
          font-size: 22px;
          color: #b9af9a;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .footerSub {
          font-size: 12px;
          color: #b9af9a;
          opacity: 0.55;
          margin-top: 4px;
          letter-spacing: 0.04em;
        }

        @media (prefers-reduced-motion: reduce) {
          .signWrap,
          .dot {
            animation: none;
          }
        }

        @media (max-width: 480px) {
          .headline {
            font-size: 50px;
          }

          .subhead {
            font-size: 24px;
          }
        }
      `}</style>
    </main>
  );
}
```
