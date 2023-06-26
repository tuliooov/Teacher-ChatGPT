"use client";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Grid, Typography } from "@mui/material";
import { Configuration, OpenAIApi } from "openai";
import { useEffect, useState } from "react";
import Speech from 'react-text-to-speech'

export default function Dashboard() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [GPTResponse, setGPTResponse] = useState("");

  const apiChatGPT = async (value: string) => {
    const configuration = new Configuration({
      organization: "org-Rlo5hkxqPzIagCnFYNF3hp5v",
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: value }],
      });
      setGPTResponse(completion.data.choices[0].message?.content || "");
    } catch (error) {}
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn`t support speech recognition.</span>;
  }

  return (
    <div>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        alignItems={"center"}
      >
        <Grid item xs={6}>
          <Typography variant="h2" gutterBottom color="text.primary">
            Dashboard
          </Typography>
          <div>
            <p>Microphone: {listening ? "on" : "off"}</p>
            <button
              onClick={() => {
                SpeechRecognition.startListening();
              }}
            >
              Start
            </button>
            <button
              onClick={() => {
                resetTranscript();
              }}
            >
              Reset
            </button>
            <button
              onClick={() => {
                SpeechRecognition.stopListening();
                apiChatGPT(transcript);
              }}
            >
              chatgpt
            </button>
            <p>Minha pergunta: {transcript}</p>
            <p>GPT Respondeu: {GPTResponse}</p>
          </div>
          <Speech
            id={"teste"}
            lang="pt-BR"
            text={GPTResponse || "sem resposta"}
            // voice="Google UK Portuguese Female" 
          />
          ,
        </Grid>
      </Grid>
    </div>
  );
}
