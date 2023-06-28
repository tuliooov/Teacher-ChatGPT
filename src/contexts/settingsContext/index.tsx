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

export interface SettingsType {
  rate: number;
  audioActived: boolean;
  readActived: boolean;
  sendingAudioInEnd: boolean;
  playAudioAutomatic: boolean;
  nameVoiceSelectedEnglish: string
  nameVoiceSelectedPortuguese: string

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
  nameVoiceSelectedEnglish: string
  nameVoiceSelectedPortuguese: string
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
    audioActived: true,
    readActived: true,
    sendingAudioInEnd: false,
    playAudioAutomatic: false,
    nameVoiceSelectedEnglish: "",
    nameVoiceSelectedPortuguese: "",
  };
};

export const SettingsProvider = ({ children }: { children: any }) => {
  const [settings, setSettings] = useState<SettingsType>(getSettings());
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSelected, setVoiceSelected] = useState<VoiceSelectedType>();

  const changeSettings = (values: SettingsType) => {
    localStorage.setItem("settings", JSON.stringify(values));
    setSettings(values);
  };

  const {
    audioActived,
    rate,
    playAudioAutomatic,
    readActived,
    sendingAudioInEnd,
    nameVoiceSelectedEnglish,
    nameVoiceSelectedPortuguese
  } = settings;

  const changePlayAudioAutomatic = (value: boolean) => {
    changeSettings({ ...settings, playAudioAutomatic: value });
  };

  const changeSendingAudioInEnd = (value: boolean) => {
    changeSettings({ ...settings, sendingAudioInEnd: value });
  };

  const changeAudioActived = (value: boolean) => {
    changeSettings({ ...settings, audioActived: value });
  };

  const changeReadActived = (value: boolean) => {
    changeSettings({ ...settings, readActived: value });
  };

  const changeRate = (value: number) => {
    changeSettings({ ...settings, rate: value });
  };

  const changeVoiceSelected = (value: VoiceSelectedType) => {
    changeSettings({
      ...settings,
      nameVoiceSelectedPortuguese: value.portuguese.voice.name,
      nameVoiceSelectedEnglish: value.english.voice.name,
    });
    setVoiceSelected(value);
  };

  const changeVoices = (value: SpeechSynthesisVoice[]) => {
    setVoices(value);
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
        nameVoiceSelectedEnglish,
        nameVoiceSelectedPortuguese
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
