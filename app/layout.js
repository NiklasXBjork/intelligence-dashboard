export const metadata = {
  title: "Intelligence Dashboard",
  description: "Elite intelligence training system"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
