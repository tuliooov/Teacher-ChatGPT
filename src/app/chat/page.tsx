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
  Typography,
} from "@mui/material";
import { Configuration, OpenAIApi } from "openai";
import { useCallback, useEffect, useState } from "react";
import { Microphone } from "./components/Microphone";
import CircularProgress from "@mui/material/CircularProgress";
import { Answer } from "./components/Answer";
import SendIcon from "@mui/icons-material/Send";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));


type AuthorType = "USER" | "BOT";

export interface ConversationType {
  text: string;
  author: AuthorType;
}

export default function Chat() {
  const [conversations, setConversations] = useState<ConversationType[]>([
    {
      author: "BOT",
      text: "Olá, eu sou o bot, como posso te ajudar?",
    },
  ]);
  const [loadingGPT, setLoadingGPT] = useState<boolean>(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState<SpeechSynthesisVoice>();

  const { finalTranscript } = useSpeechRecognition();

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

  const resetInput = () => {
    changeInput("");
  };

  const sendMessage = () => {
    if (currentMessage) {
      resetInput();
      addConversation(currentMessage, "USER");
      setLoadingGPT(true);
      searchAnswerGPT(currentMessage);
    }
  };

  useEffect(() => {
    if (finalTranscript) {
      changeInput(finalTranscript);
    }
  }, [finalTranscript, searchAnswerGPT]);

  useEffect(() => {
    if (!voices.length) {
      const time = setInterval(() => {
        const synth = window.speechSynthesis;
        const voicesGetted = synth.getVoices();
        const voicesFiltered = (voicesGetted || []).filter(
          (voice) => voice.lang === "pt-BR"
        );
        setVoices(voicesFiltered);
      }, 500);
      return () => clearInterval(time);
    }
    return () => {};
  }, [voices.length]);

  return (
    <div>
      <FormControl sx={{ mb: 2 }} variant="standard" fullWidth>
        <NativeSelect
          value={voice?.name}
          onChange={(e) => {
            const newVoice = voices.find((v) => v.name === e.target.value)
            setVoice(newVoice)
          }}
          input={<BootstrapInput />}
        >
          {voices.map((voice) => (
            <option value={voice.name} key={voice.name}>
              {voice.name}
            </option>
          ))}
        </NativeSelect>
      </FormControl>

      <Grid container>
        <Grid item xs={12}>
          {
            <Grid item display="flex" direction="column" gap="2rem">
              {conversations.map((conversation, index) => (
                <Answer conversation={conversation} key={index} voice={voice}/>
              ))}
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
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Digite alguma coisa para o bot responder"
                inputProps={{
                  "aria-label": "digite alguma coisa para o bot responder",
                }}
                value={currentMessage}
                onChange={(e) => changeInput(e.target.value)}
              />
              <IconButton
                type="button"
                sx={{ p: "10px" }}
                aria-label="send message"
                onClick={sendMessage}
              >
                <SendIcon />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <Microphone />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
