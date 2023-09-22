## ChatGPT Teacher

I connected chatgpt in my project.

![image](https://github.com/tuliooov/professor-chatgpt/assets/28486303/9754a927-26e1-4f4e-a204-ff8701e7059b)


## 🛠️ In this project was used

- NextJS
- Typescript
- Vercel Host
- Styled Components
- Mongodb Atlas
- Prisma
- PWA
- SpeechRecognition

## Start project

- create file .env
- Add ENVs
  - ACCESS_TOKEN_SECRET
  - DATABASE_URL="mongodb+srv://<email>:<password>@cluster0.o0dhq6m.mongodb.net/professorChatGPT"
  - NEXT_PUBLIC_ORGANIZATION
  - NEXT_PUBLIC_API_KEY_GPT
- npx prisma generate
- npx prisma db seed
- npm run dev
- locale: http://localhost:3000

## Deployed

- https://professor-chatgpt.vercel.app/
