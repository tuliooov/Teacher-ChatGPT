"use client";
import { Typography } from "@mui/material";
import { ConversationType } from "../page";
import Speech from "react-text-to-speech";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
export function Answer({ conversation }: { conversation: ConversationType}) {
  return (
    <div>
      <Typography variant="body1" component={"p"} fontSize={16}>
        {conversation.author}: {conversation.text}
      </Typography>
      <Speech
        id="speech"
        lang="pt-BR"
        text={conversation.text}
        startBtn={<VolumeOffIcon fontSize="inherit"/>} 
        stopBtn={<VolumeUpIcon fontSize="inherit"/>} 
        pitch={5}
        rate={5}
        volume={10}
        style={{}}
      />
    </div>
  );
}
