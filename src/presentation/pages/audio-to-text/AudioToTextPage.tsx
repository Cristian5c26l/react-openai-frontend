import React, { useState } from 'react'
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxFile } from '../../components';
import { audioToTextUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}


export const AudioToTextPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);// messages será un arreglo de objetos donde cada uno tendrá propiedades text y isGpt

  const handlePost = async(text: string, audioFile: File) => {// File ya está en typescript
    setIsLoading(true);
    setMessages((prevMessagesValue) => [...prevMessagesValue, {text: text, isGpt: false}]);

    // TODO: UseCase
    // console.log({text, audioFile});
    const resp = await audioToTextUseCase(audioFile, text);
    setIsLoading(false);

    if (!resp) return; // no hay respuesta...
    console.log(resp);

    const gptMessage = `
## Transcripción:
__Duración:__ ${ Math.round(resp.duration) } segundos
## El texto es:
${ resp.text }
    `;

    // Todo: Añadir el mensaje de isGPT en true
    setMessages((prev) => [
      ...prev,
      { text: gptMessage, isGpt: true }
    ]);

    for (const segment of resp.segments) {
      const segmentMessage = `
__De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos:__
${segment.text}      
      `;

      setMessages((prev) => [
        ...prev,
        { text: segmentMessage, isGpt: true }
      ]);

    }

  }

  return (
    <div className='chat-container'>{/** chat-container está dentro de archivo index.css */}
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          {/** Bienvenida */}
          <GptMessage text="Hola, ¿qué audio quieres generar hoy?" />

          {/* <MyMessage text='Hola mundo' /> */}

          {
            messages.map((message, index) => (
              message.isGpt
                ? (<GptMessage key={index} text={message.text} />)
                : (<MyMessage key={index} text={(message.text === '') ? 'Transcribe el audio' : message.text} />)
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

      <TextMessageBoxFile
        onSendMessage={ handlePost }
        placeholder='Escribe aquí lo que deseas'
        disableCorrections
        accept='audio/*'
      />

    </div>
  )
}
