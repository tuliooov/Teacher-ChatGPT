"use client";
import { Avatar, Card, IconButton, Tooltip, Typography } from "@mui/material";
import { ConversationType } from "../page";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/contexts/userContext";
import { identifyLanguage } from "@/utils/languageIdentifier";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useSettings, VoiceSelectedType } from "@/contexts/settingsContext";

export function Answer({
  conversation,
  voiceSelected,
  rate,
  changeSpeed,
  lastMessage
}: {
  conversation: ConversationType;
  voiceSelected: VoiceSelectedType | undefined;
  rate: number;
  changeSpeed: () => void;
  lastMessage: boolean
}) {
  const { readActived, audioActived, playAudioAutomatic } = useSettings();
  const { user } = useUser();
  const [play, setPlay] = useState<boolean>(false);

  const refUtterance = useRef<SpeechSynthesisUtterance>();
  const refSynth = useRef<SpeechSynthesis>();
  const voiceUse = identifyLanguage(conversation.text, voiceSelected);

  const handlePlay = useCallback(() => {
    if (refUtterance.current && refSynth.current) {
      refSynth.current.cancel();
      if (!play) {
        refSynth.current?.speak(refUtterance.current);
      }
    }
  }, [play]);

  useEffect(() => {
    if (refUtterance.current) {
      refUtterance.current.rate = rate;
    }
  }, [rate]);

  useEffect(() => {
    refSynth.current = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(conversation.text);
    if (voiceUse) {
      u.voice = voiceUse.voice;
      u.rate = 1;
    }
    refUtterance.current = u;
    u.onend = () => {
      setPlay(false);
    };
    u.onpause = () => {
      setPlay(false);
    };
    u.onerror = () => {
      setPlay(false);
    };
    u.onstart = () => {
      setPlay(true);
    };

    return () => {
      refSynth.current?.cancel();
    };
  }, [conversation.text, voiceUse]);

  return (
    <div style={{ width: "100%" }}>
      <Card
        sx={{
          padding: "1rem 1rem",
          borderRadius: "1rem",
          background: conversation.author === "USER" ? "#005017" : "inherit",
          float: conversation.author === "USER" ? "right" : "left",
        }}
      >
        <Typography variant="body1" component={"p"} fontSize={16}>
          <Tooltip title="Velocidade">
            <IconButton onClick={play ? changeSpeed : () => null}>
              <Avatar style={{ color: "white" }}>
                {play
                  ? `${rate}x`
                  : conversation.author === "BOT"
                  ? (voiceUse?.voice.name || "BOT")[0]
                  : user.name[0]}
              </Avatar>
            </IconButton>
          </Tooltip>
          {audioActived && (
            <Tooltip title="Play no audio">
              <IconButton onClick={handlePlay}>
                {play ? (
                  <PauseIcon fontSize="inherit" />
                ) : (
                  <PlayArrowIcon fontSize="inherit" />
                )}
              </IconButton>
            </Tooltip>
          )}
          <span style={{
            filter: readActived ? 'inherit' : 'blur(5px)'
          }}>
          {conversation.text}
          </span>
        </Typography>
      </Card>
    </div>
  );
}
