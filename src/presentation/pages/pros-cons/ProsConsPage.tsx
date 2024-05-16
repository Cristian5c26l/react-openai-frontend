import React, { useState } from 'react'
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { prosConsUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}


export const ProsConsPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);// messages será un arreglo de objetos donde cada uno tendrá propiedades text y isGpt

  const handlePost = async(text: string) => {
    setIsLoading(true);
    setMessages((prevMessagesValue) => [...prevMessagesValue, {text: text, isGpt: false}]);

    const {ok, content} = await prosConsUseCase(text);// text es el estado message manejado desde el componente TextMessageBox. content es un string que tiene codigo markdown
    setIsLoading(false);
    
    if ( ok === false ) {
      setMessages((prevMessagesValue) => [...prevMessagesValue, {text: 'No se pudo hacer la comparativa', isGpt: true}]);
    } else {
      setMessages((prevMessagesValue) => [...prevMessagesValue, {
        text: content, isGpt: true,
      }]);
    }

  }

  return (
    <div className='chat-container'>{/** chat-container está dentro de archivo index.css */}
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          {/** Bienvenida */}
          <GptMessage text="Puedes escribir lo que sea que quieres que compare y te de mis puntos de vista." />

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
