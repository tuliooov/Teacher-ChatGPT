"use client";

import { FormControl, InputBase, NativeSelect, styled } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

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

export interface VoiceType {
  lang: "pt-BR" | "en-US";
  rate: number;
  voice: SpeechSynthesisVoice;
}

export interface VoiceSelectedType {
  english: VoiceType;
  portuguese: VoiceType;
}

interface ConfigLanguageProps {
  voiceSelected: VoiceSelectedType | undefined;
  voices: SpeechSynthesisVoice[];
  setVoiceSelected: (value: VoiceSelectedType | undefined) => void;
}

export function ConfigLanguage({
  voiceSelected,
  voices,
  setVoiceSelected,
}: ConfigLanguageProps) {
  console.log("🚀 ~ file: ConfigLanguage.tsx:61 ~ voiceSelected:", voiceSelected)
  return (
    <div>
      <FormControl sx={{ mb: 2 }} variant="standard" fullWidth>
      Locutor Portugues
      <NativeSelect
        value={voiceSelected?.portuguese?.voice?.name}
        onChange={(e) => {
          const newVoice = voices.find((v) => v.name === e.target.value);
          if (voiceSelected && newVoice) {
            setVoiceSelected({
              ...voiceSelected,
              portuguese: {
                voice: newVoice,
                lang: "pt-BR",
                rate: 2,
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
      Locutor English
      <NativeSelect
        value={voiceSelected?.english?.voice?.name}
        onChange={(e) => {
          const newVoice = voices.find((v) => v.name === e.target.value);
          if (voiceSelected && newVoice) {
            setVoiceSelected({
              ...voiceSelected,
              english: {
                voice: newVoice,
                lang: "en-US",
                rate: 2,
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
    </div>
  );
}
