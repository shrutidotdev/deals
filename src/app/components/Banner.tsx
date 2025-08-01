import { env } from "@/lib/env/client";

export function Banner({
  message,
  mappings,
  customization,
  canRemoveBranding,
}: {
  canRemoveBranding: boolean;
  message: string;
  mappings: {
    coupon: string;
    discount: string;
    country: string;
  };
  customization: {
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    isSticky: boolean;
    classPrefix?: string | null;
  };
}) {
  const prefix = customization.classPrefix ?? "";
  const mappedMessage = Object.entries(mappings).reduce(
    (mappedMessage, [key, value]) => {
      return mappedMessage.replace(new RegExp(`{${key}}`, "g"), value);
    },
    message.replace(/'/g, "&#39;")
  );

  return (
    <>
      <style type="text/css">
        {`
          .${prefix}easy-ppp-container {
            all: revert;
            display: flex;
            flex-direction: column;
            gap: .5em;
            background-color: ${customization.backgroundColor};
            color: ${customization.textColor};
            font-size: ${customization.fontSize};
            font-family: inherit;
            padding: 1rem;
            ${customization.isSticky ? "position: sticky;" : ""}
            left: 0;
            right: 0;
            top: 0;
            text-wrap: balance;
            text-align: center;
          }

          .${prefix}easy-ppp-branding {
            color: inherit;
            font-size: inherit;
            display: inline-block;
            text-decoration: underline;
            background-color: #fbeee0;
            border: 2px solid #422800;
            border-radius: 10px;
            margin-top: 1.5rem;
            box-shadow: #422800 4px 4px 0 0;
            color: #422800;
            cursor: pointer;
            display: inline-block;
            font-weight: 600;
            font-size: 18px;
            padding: 0 18px;
            line-height: 40px;
            text-align: center;
            text-decoration: none;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
          }
        `}
      </style>

      <div className={`${prefix}easy-ppp-container ${prefix}easy-ppp-override`}>
        <span
          className={`${prefix}easy-ppp-message ${prefix}easy-ppp-override`}
          dangerouslySetInnerHTML={{
            __html: mappedMessage,
          }}
        />
        {!canRemoveBranding && (
          <a
            className={`${prefix}easy-ppp-branding`}
            href={`${env.NEXT_PUBLIC_SERVER_URL}`}
          >
            Powered by Easy PPP
          </a>
        )}
      </div>
    </>
  );
}
