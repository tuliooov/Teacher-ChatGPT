"use client";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import IconButton from "@mui/material/IconButton";
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import { useEffect } from "react";
export function Microphone() {

  const {
    listening,
  } = useSpeechRecognition();

  useEffect(() => {
    SpeechRecognition.stopListening()
  }, [])

  return (
    <IconButton
      aria-label="delete"
      color="primary"
      size="large"
      sx={{ p: "10px" }}
      onClick={() => {
        !listening && SpeechRecognition.startListening({ language: "pt-BR" });
        listening && SpeechRecognition.stopListening();
      }}
    >
      {listening ? <MicIcon fontSize="inherit" /> : <MicOffIcon fontSize="inherit" />}
    </IconButton>
  );
}
