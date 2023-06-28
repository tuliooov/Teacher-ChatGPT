"use client";

import { IUser } from "@/pages/api/oauth/login";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "material-ui-snackbar-provider";

export interface VoiceType {
  lang: "pt-BR" | "en-US";
  voice: SpeechSynthesisVoice;
}

export interface VoiceSelectedType {
  english: VoiceType;
  portuguese: VoiceType;
}

export interface SettingsContextType {
  rate: number;
  changeRate: (value: number) => void;
  voices: SpeechSynthesisVoice[];
  changeVoiceSelected: (value: VoiceSelectedType) => void;
  voiceSelected: VoiceSelectedType | undefined;
  changeVoices: (value: SpeechSynthesisVoice[]) => void;
  audioActived: boolean;
  changeAudioActived: (value: boolean) => void;
  readActived: boolean;
  changeReadActived: (value: boolean) => void;
  sendingAudioInEnd: boolean;
  changeSendingAudioInEnd: (value: boolean) => void;
  playAudioAutomatic: boolean;
  changePlayAudioAutomatic: (value: boolean) => void;
}

export const SettingsContext = createContext({});

export const getSettings = () => {
  const settings =
    typeof window !== "undefined" ? localStorage.getItem("settings") : null;
  try {
    if (settings) {
      return JSON.parse(settings);
    }
  } catch (error) {
    null;
  }
  return {
    rate: 1,
    voices: [],
    voiceSelected: undefined,
    audioActived: true,
    readActived: true,
    sendingAudioInEnd: false,
    playAudioAutomatic: false,
  };
};

export const SettingsProvider = ({ children }: { children: any }) => {

  const [settings, setSettings] = useState<SettingsContextType>(getSettings());

  const { audioActived, rate, playAudioAutomatic, readActived, voiceSelected, voices, sendingAudioInEnd} = settings
  console.log("🚀 ~ file: index.tsx:64 ~ SettingsProvider ~ settings:", settings)
  
  const changePlayAudioAutomatic = (value: boolean) => {
    setSettings((state) => ({...state, playAudioAutomatic: value}));
  };

  const changeSendingAudioInEnd = (value: boolean) => {
    setSettings((state) => ({...state, sendingAudioInEnd: value}));
  };

  const changeAudioActived = (value: boolean) => {
    setSettings((state) => ({...state, audioActived: value}));
  };

  const changeReadActived = (value: boolean) => {
    setSettings((state) => ({...state, readActived: value}));
  };

  const changeRate = (value: number) => {
    setSettings((state) => ({...state, rate: value}));
  };

  const changeVoiceSelected = (value: VoiceSelectedType) => {
    setSettings((state) => ({...state, voiceSelected: value}));
  };

  const changeVoices = (value: SpeechSynthesisVoice[]) => {
    setSettings((state) => ({...state, voices: value}));
  };

  return (
    <SettingsContext.Provider
      value={{
        rate,
        changeRate,
        voices,
        changeVoices,
        voiceSelected,
        changeVoiceSelected,
        audioActived,
        changeAudioActived,
        readActived,
        changeReadActived,
        sendingAudioInEnd,
        changeSendingAudioInEnd,
        playAudioAutomatic,
        changePlayAudioAutomatic,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = React.useContext(SettingsContext) as SettingsContextType;
  if (!context) {
    throw new Error("useUser must be used within an SettingsProvider");
  }
  return context;
};
