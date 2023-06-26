"use client"
import Dashboard from "@/components/Dashboard";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { replace } = useRouter()
  
  useEffect(() => {
    if(localStorage.getItem('user') === null){
      replace('/')
    }
  }, [replace])

  return (
      <Dashboard>{children}</Dashboard>
  );
}
