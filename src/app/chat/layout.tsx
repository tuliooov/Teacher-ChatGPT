"use client";
import "regenerator-runtime/runtime";
import Dashboard from "@/components/Dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SnackbarProvider } from "material-ui-snackbar-provider";
import { createTheme, ThemeProvider } from "@mui/material";
import { SettingsProvider } from "@/contexts/settingsContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { replace } = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user") === null) {
      replace("/");
    }
  }, [replace]);

  return (
    <SettingsProvider>
      <SnackbarProvider SnackbarProps={{ autoHideDuration: 4000 }}>
        <ThemeProvider
          theme={createTheme({
            palette: {
              mode: "dark",
            },
          })}
        >
          <Dashboard>{children}</Dashboard>
        </ThemeProvider>
      </SnackbarProvider>
    </SettingsProvider>
  );
}
