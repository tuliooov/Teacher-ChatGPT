"use client";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { ConversationType } from "../page";
// import Speech from "react-text-to-speech";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/contexts/userContext";
import { identifyLanguage } from "@/utils/languageIdentifier";
import { VoiceSelectedType } from "./ConfigLanguage";
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';

export function Answer({
  conversation,
  voiceSelected,
}: {
  conversation: ConversationType;
  voiceSelected: VoiceSelectedType | undefined;
}) {
  const { user } = useUser();
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );

  const voiceUse = identifyLanguage(conversation.text, voiceSelected);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(conversation.text);
    if (voiceUse) {
      u.voice = voiceUse.voice;
      u.rate = voiceUse.rate;
    }
    

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [conversation.text, voiceUse]);

  const handlePlay = (slow = false) => () => {
    const synth = window.speechSynthesis;

    

    synth.cancel();

    if (utterance) {
      if(slow) utterance.rate = 0.5
      else utterance.rate = 1
      synth.speak(utterance);
    } else {
      synth.speak(new SpeechSynthesisUtterance(""));
    }
  };

  return (
    <div>
      <Typography variant="body1" component={"p"} fontSize={16}>
        {conversation.author === "BOT" ? voiceUse?.voice.name || "BOT" : user.name}:{" "}
        {conversation.text}
      </Typography>
      <Tooltip title="Audio normal"><IconButton onClick={handlePlay(false)}>
        <VolumeUpIcon fontSize="inherit" />
      </IconButton>
      </Tooltip>
      <Tooltip title="Audio devagar"><IconButton onClick={handlePlay(true)}>
        <SlowMotionVideoIcon fontSize="inherit" />
      </IconButton>
      </Tooltip>
    </div>
  );
}
