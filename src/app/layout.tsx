import type { Metadata } from "next";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/800.css";
import "./globals.css";
import Providers from "./providers";
import Box from "@mui/material/Box";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
    title: "Door 2 Door",
    description:
        "DOOR 2 DOOR helps you keep track of donations you receive while doing fundraising. Made by Record Robotics.",
    icons: {
        icon: [
            {
                url: "/favicon-96x96.png",
                type: "image/png",
                sizes: "96x96",
            },
            {
                url: "/favicon.svg",
                type: "image/svg+xml",
            },
        ],
        shortcut: "/favicon.ico",
        apple: {
            url: "/apple-touch-icon.png",
            sizes: "180x180",
        },
    },
    appleWebApp: {
        title: "Door 2 Door",
        capable: true,
        statusBarStyle: "default",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <NextIntlClientProvider>
                    <Providers>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                        >
                            {children}
                        </Box>
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
