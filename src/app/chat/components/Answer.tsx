"use client";
import { IconButton, Typography } from "@mui/material";
import { ConversationType } from "../page";
// import Speech from "react-text-to-speech";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useEffect, useState } from "react";
export function Answer({ conversation, voice }: { conversation: ConversationType; voice: SpeechSynthesisVoice | undefined}) {

  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(conversation.text);
    if(voice) u.voice = voice;

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [conversation.text, voice]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;
    synth.cancel();

    if(utterance){
      synth.speak(utterance);      
    }else {
      synth.speak(new SpeechSynthesisUtterance(''));      
    }

  };


  return (
    <div>
      <Typography variant="body1" component={"p"} fontSize={16}>
        {conversation.author}: {conversation.text}
      </Typography>
      <IconButton onClick={handlePlay}>
        <VolumeUpIcon fontSize="inherit"/>
      </IconButton>
    </div>
  );
}
