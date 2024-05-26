import React, { useState } from 'react'
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, TextMessageBoxSelect, GptMessageAudio } from '../../components';
import { textToAudioUseCase } from '../../../core/use-cases';

const disclaimer = `## ¿Qué audio quieres generar hoy?
* Todo el audio generado es por AI.
`;

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
]

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text';// Una variable que sea de tipo Message, tendrá una propiedad llamada isGpt que tendrá un valor booleano. Tambien, tendrá una propiedad llamada type que forzosamente deberá almacenar la cadena "text"
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: 'audio';
}

// Creacion de nuevo tipo
type Message = TextMessage | AudioMessage;



export const TextToAudioPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);// messages será un arreglo de objetos donde cada uno tendrá propiedades text y isGpt

  const handlePost = async(text: string, selectedVoice: string) => {
    setIsLoading(true);
    setMessages((prevMessagesValue) => [...prevMessagesValue, {text: text, isGpt: false, type: 'text'}]);

    // TODO: UseCase
    const { ok, message, audioUrl } = await textToAudioUseCase(text, selectedVoice) as {ok: boolean, message: string, audioUrl?: string};
    setIsLoading(false);

    if ( !ok) {
      setMessages((prevMessagesValue) => [...prevMessagesValue, {text: 'No se pudo realizar la generación de audio', isGpt: true, type: 'text'}]);
    } else {
      setMessages((prevMessagesValue) => [...prevMessagesValue, {
        text: `${selectedVoice} - ${message}`, isGpt: true, type: 'audio',
        audio: audioUrl!
      }]);
    }

    // Todo: Añadir el mensaje de isGPT en true
  }

  return (
    <div className='chat-container'>{/** chat-container está dentro de archivo index.css */}
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          {/** Bienvenida */}
          <GptMessage text={disclaimer} />

          {/* <MyMessage text='Hola mundo' /> */}

          {
            messages.map((message, index) => (
              message.isGpt
                ? ((message.type === 'text' && <GptMessage key={index} text={message.text} />) || (message.type === 'audio' && <GptMessageAudio key={index} text={message.text} audioUrl={message.audio} />))
                : (<MyMessage key={index} text={message.text} />)
            ))
          }

          {
            isLoading &&
            (<div className='col-start-1 col-end-12 fade-in'>
              <TypingLoader/>
            </div>)
          }

        </div>
      </div>

      <TextMessageBoxSelect
        onSendMessage={ handlePost }
        placeholder='Escribe aquí lo que deseas'
        disableCorrections
        options={voices}
        openAIIsRunning={isLoading}
      />

    </div>
  )
}
