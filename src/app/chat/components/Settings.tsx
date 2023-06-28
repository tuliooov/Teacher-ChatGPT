"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl, FormControlLabel, IconButton, InputBase, NativeSelect, styled, Switch, Tooltip } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useSettings, VoiceSelectedType } from "@/contexts/settingsContext";
import SettingsIcon from '@mui/icons-material/Settings';
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

export function Settings() {
  const {
    changeRate,
    changeVoiceSelected,
    changeVoices,
    rate,
    voiceSelected,
    voices,
    audioActived, 
    changeAudioActived,
    changeReadActived, 
    readActived,
    changeSendingAudioInEnd,
    changePlayAudioAutomatic,
    playAudioAutomatic,
    sendingAudioInEnd,
  } = useSettings();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Configurações">
        <IconButton edge="end" color="inherit" onClick={handleClickOpen}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Configurações"}</DialogTitle>
        <DialogContent>
          <div>
            <FormControl sx={{ mb: 2 }} variant="standard" fullWidth>
              Locutor em português
              <NativeSelect
                value={voiceSelected?.portuguese?.voice?.name}
                onChange={(e) => {
                  const newVoice = voices.find(
                    (v) => v.name === e.target.value
                  );
                  if (voiceSelected && newVoice) {
                    changeVoiceSelected({
                      ...voiceSelected,
                      portuguese: {
                        voice: newVoice,
                        lang: "pt-BR",
                      },
                    });
                  }
                }}
                input={<BootstrapInput />}
              >
                {voices
                  .filter((value) => value.lang === "pt-BR")
                  .map((voice) => (
                    <option value={voice.name} key={voice.name}>
                      {voice.name}
                    </option>
                  ))}
              </NativeSelect>
            </FormControl>

            <FormControl sx={{ mb: 2 }} variant="standard" fullWidth>
              Locutor em inglês
              <NativeSelect
                value={voiceSelected?.english?.voice?.name}
                onChange={(e) => {
                  const newVoice = voices.find(
                    (v) => v.name === e.target.value
                  );
                  if (voiceSelected && newVoice) {
                    changeVoiceSelected({
                      ...voiceSelected,
                      english: {
                        voice: newVoice,
                        lang: "en-US",
                      },
                    });
                  }
                }}
                input={<BootstrapInput />}
              >
                {voices
                  .filter((value) => value.lang === "en-US")
                  .map((voice) => (
                    <option value={voice.name} key={voice.name}>
                      {voice.name}
                    </option>
                  ))}
              </NativeSelect>
            </FormControl>

            <FormControlLabel control={<Switch checked={readActived} onChange={(e) => changeReadActived(e.target.checked)} />} label="Permitir ler resposta" />
            <br />
            <FormControlLabel control={<Switch checked={audioActived} onChange={(e) => changeAudioActived(e.target.checked)} />} label="Permitir ouvir resposta" />
            {/* <br /> */}
            {/* <FormControlLabel control={<Switch checked={playAudioAutomatic} onChange={(e) => changePlayAudioAutomatic(e.target.checked)} />} label="Permitir rodar audio automaticamente" /> */}
            {/* <br />
            <FormControlLabel control={<Switch checked={sendingAudioInEnd} onChange={(e) => changeSendingAudioInEnd(e.target.checked)} />} label="Permitir enviar audio no final da fala" /> */}

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
