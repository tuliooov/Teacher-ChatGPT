"use client";
import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Link from "next/link";
import { useUser } from "@/contexts/userContext";
export const MainListItems = () => {
  const [selected, setSelected] = React.useState("/dashboard");
  const {user} = useUser()
  const handleListItemClick = (href: string) => {
    setSelected(href);
  };

  const options = [
    {
      allowed: user?.permissions?.dashboardPage?.view,
      href: "/dashboard/",
      icon: <DashboardIcon />,
      text: "Dashboard",
    },
  ];

  return (
    <>
      {options.filter(option => !!option.allowed).map((option) => (
        <ListItemButton
          selected={selected === option.href}
          component={Link}
          href={option.href}
          key={option.href}
          onClick={() => handleListItemClick(option.href)}
        >
          <ListItemIcon>{option.icon}</ListItemIcon>
          <ListItemText primary={option.text} />
        </ListItemButton>
      ))}
    </>
  );
};
