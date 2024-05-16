import React, { useRef, useState } from 'react'
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { prosConsStreamGeneratorUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}


export const ProsConsStreamPage = () => {// Basado en ChatTemplate

  const abortController = useRef( new AbortController() );
  const isRunning = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);// messages será un arreglo de objetos donde cada uno tendrá propiedades text y isGpt

  const handlePost = async(text: string) => {

    if ( isRunning.current === true ) {
      abortController.current.abort(); // Esto hace que el fetch se detenga
      abortController.current = new AbortController();// Para que no se cancele el nuevo Stream o respuesta completa de OpenAi (fetch hacia OpenAI)
    }

    setIsLoading(true);
    isRunning.current = true;
    setMessages((prevMessagesValue) => [...prevMessagesValue, {text: text, isGpt: false}]);

    // TODO: UseCase

    const stream = prosConsStreamGeneratorUseCase(text, abortController.current.signal);// solo mandamos la señal del objeto abortController
    setIsLoading(false);

    setMessages((prevMessagesValue) => [...prevMessagesValue, {text: '', isGpt: true}]);

    for await (const text of stream) {
        // Actualizar ultimo mensaje
        setMessages((prevMessagesValue) => {
          const updatedMessages = [...prevMessagesValue];// con el operador spread se rompe la referencia al array prevMessagesValue
          updatedMessages[updatedMessages.length - 1].text = text;
          return updatedMessages;
        });
      
    }

    isRunning.current = false;

  }

  return (
    <div className='chat-container'>{/** chat-container está dentro de archivo index.css */}
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          {/** Bienvenida */}
          <GptMessage text="¿Qué deseas comparar hoy?" />

          {/* <MyMessage text='Hola mundo' /> */}

          {
            messages.map((message, index) => (
              message.isGpt
                ? (<GptMessage key={index} text={message.text} />)
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

      <TextMessageBox 
        onSendMessage={ handlePost }
        placeholder='Escribe aquí lo que deseas'
        disableCorrections
      />

    </div>
  )
}
