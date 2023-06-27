"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ISchemaLogin, schemaLogin } from "./schema";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { useUser } from "@/contexts/userContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, createTheme, Link, ThemeProvider } from "@mui/material";

export default function SignInSide() {
  "use client";
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISchemaLogin>({
    resolver: zodResolver(schemaLogin),
  });
  const [loading, setLoading] = useState(false);
  const { changeUser, logOut } = useUser();

  const onSubmit = async (data: ISchemaLogin) => {
    console.log(data);
    try {
      setLoading(true);
      const response = await axios.post("/api/oauth/login", data);
      await changeUser(response.data.data);
      push("/chat");
    } catch (error) {
      console.warn("Post login: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    logOut();
  }, [logOut]);

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: "dark",
        },
      })}
    >
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={5}
          md={8}
          sx={{
            backgroundImage: "url(/wallpaper.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={7} md={4} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              display={"flex"}
              flexDirection={"column"}
              gap={"2rem"}
              width={"100%"}
              sx={{ mt: 2 }}
            >
              <TextField
                {...register("email")}
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoFocus
                error={!!errors.email?.message}
                helperText={errors.email?.message}
              />
              <TextField
                {...register("password")}
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                error={!!errors.password?.message}
                helperText={errors.password?.message}
              />

              <LoadingButton
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                loading={loading}
              >
                Entrar
              </LoadingButton>

              <Button variant="text" onClick={() => push("/register")}>
                Cadastrar
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
