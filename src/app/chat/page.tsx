"use client";
import { useSpeechRecognition } from "react-speech-recognition";
import {
  Container,
  Divider,
  FilledInput,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  NativeSelect,
  Paper,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Configuration, OpenAIApi } from "openai";
import { useCallback, useEffect, useState } from "react";
import { Microphone } from "./components/Microphone";
import CircularProgress from "@mui/material/CircularProgress";
import { Answer } from "./components/Answer";
import SendIcon from "@mui/icons-material/Send";
import { useSettings } from "@/contexts/settingsContext";

type AuthorType = "USER" | "BOT";

export interface ConversationType {
  text: string;
  author: AuthorType;
}

export default function Chat() {
  const {
    changeRate,
    changeVoiceSelected,
    changeVoices,
    rate,
    voiceSelected,
    voices,
    sendingAudioInEnd,
  } = useSettings();

  const [conversations, setConversations] = useState<ConversationType[]>([
    {
      author: "BOT",
      text: "Olá, eu sou o bot, como posso te ajudar?",
    },
  ]);
  const [loadingGPT, setLoadingGPT] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const { finalTranscript } = useSpeechRecognition();

  const changeSpeed = () => {
    switch (rate) {
      case 1:
        changeRate(0.75);
        break;
      case 0.75:
        changeRate(0.5);
        break;
      case 0.5:
        changeRate(1);
        break;
      default:
        break;
    }
  };

  const searchAnswerGPT = useCallback(async (ask: string) => {
    const configuration = new Configuration({
      organization: process.env.NEXT_PUBLIC_ORGANIZATION,
      apiKey: process.env.NEXT_PUBLIC_API_KEY_GPT,
    });
    const openai = new OpenAIApi(configuration);
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: ask }],
      });
      addConversation(
        completion.data.choices[0].message?.content || "sem resposta do bot",
        "BOT"
      );
    } catch (error) {
    } finally {
      setLoadingGPT(false);
    }
  }, []);

  const addConversation = (text: string, author: AuthorType) => {
    setConversations((state) => [...state, { text, author }]);
  };

  const changeInput = (value: string) => {
    setCurrentMessage(value);
  };

  const resetInput = useCallback(() => {
    changeInput("");
  }, []);

  const sendMessage = useCallback(() => {
    if (currentMessage) {
      resetInput();
      addConversation(currentMessage, "USER");
      setLoadingGPT(true);
      searchAnswerGPT(currentMessage);
    }
  }, [currentMessage, resetInput, searchAnswerGPT]);

  useEffect(() => {
    if (finalTranscript) {
      changeInput(finalTranscript);
    }
  }, [finalTranscript, sendingAudioInEnd]);

  // useEffect(() => {
  //   if (sendingAudioInEnd && currentMessage) {
  //     sendMessage();
  //   }
  // }, [currentMessage, sendMessage, sendingAudioInEnd]);

  useEffect(() => {
    const element = document.getElementById('chatConversation')
    if (element) element.scrollTo(0, element.scrollHeight)
    console.log("🚀 ~ file: page.tsx:128 ~ useEffect ~ element:", element)
  }, [conversations])

  useEffect(() => {
    if (!voices.length) {
      const time = setInterval(() => {
        const synth = window.speechSynthesis;
        const voicesGetted = synth.getVoices();
        changeVoices(voicesGetted);
        if (!voiceSelected && voicesGetted.length)
          changeVoiceSelected({
            english: {
              lang: "en-US",
              voice: voicesGetted.find((v) => v.lang === "en-US")!,
            },
            portuguese: {
              lang: "pt-BR",
              voice: voicesGetted.find((v) => v.lang === "pt-BR")!,
            },
          });
      }, 500);
      return () => clearInterval(time);
    }
    return () => {};
  }, [changeVoiceSelected, changeVoices, voiceSelected, voices.length]);

  return (
    <div >
      <Grid container>
        <Grid item xs={12} sx={{ mb: 8 }}>
          {
            <Grid item display="flex" direction="column" gap="2rem">
              {conversations.map((conversation, index) => {
                const lastMessage = index === conversations.length - 1;
                return (
                  <Answer
                    conversation={conversation}
                    key={index}
                    voiceSelected={voiceSelected}
                    rate={rate}
                    changeSpeed={changeSpeed}
                    lastMessage={lastMessage}
                  />
                );
              })}
              {loadingGPT && <CircularProgress size={16} />}
            </Grid>
          }
        </Grid>

        <Grid
          item
          xs={12}
          position="fixed"
          bottom={0}
          right={0}
          width={"100%"}
          display="flex"
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          alignContent={"center"}
          padding="0"
        >
          <Grid
            item
            xs={12}
            display="flex"
            width="100%"
            justifyContent={"center"}
            gap="1rem"
          >
            <Paper
              component="form"
              sx={{
                p: "2rem 3rem",
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Digite alguma coisa"
                inputProps={{
                  "aria-label": "digite alguma coisa para o bot responder",
                  style: { fontSize: "1.5rem", lineHeight: "2rem" },
                }}
                value={currentMessage}
                onChange={(e) => changeInput(e.target.value)}
                multiline
              />
              <Tooltip title="Enviar mensagem">
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="send message"
                  onClick={sendMessage}
                >
                  <SendIcon />
                </IconButton>
              </Tooltip>

              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <Microphone />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
