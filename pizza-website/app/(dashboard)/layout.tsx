export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children} : { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-[#F9FAFB]">
                {children}
            </body>
        </html>
    )
}