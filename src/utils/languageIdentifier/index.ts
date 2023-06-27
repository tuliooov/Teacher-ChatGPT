import { VoiceSelectedType } from '@/app/chat/components/ConfigLanguage';
import Languagedetect from 'languagedetect'

export const identifyLanguage = (text: string, voiceSelected: VoiceSelectedType | undefined) => {
  const lngDetector = new Languagedetect();

  try {
    if(lngDetector.detect(text)[0][0] === 'english'){
      return voiceSelected?.english
    }
  } catch (error) {
    
  }

  return voiceSelected?.portuguese
}