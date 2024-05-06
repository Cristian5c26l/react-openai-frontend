import React, { useState } from 'react'
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from '../../components'

interface Message {
  text: string;
  isGpt: boolean;
}


export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);// messages será un arreglo de objetos donde cada uno tendrá propiedades text y isGpt

  const handlePost = async(text: string) => {
    setIsLoading(true);
    setMessages((prevMessagesValue) => [...prevMessagesValue, {text: text, isGpt: false}]);

    // TODO: UseCase

    setIsLoading(false);

    // Todo: Añadir el mensaje de isGPT en true
  }

  return (
    <div className='chat-container'>{/** chat-container está dentro de archivo index.css */}
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          {/** Bienvenida */}
          <GptMessage text="Hola, puedes escribir tu texto en español, y te ayudo con las correcciones" />

          {/* <MyMessage text='Hola mundo' /> */}

          {
            messages.map((message, index) => (
              message.isGpt
                ? (<GptMessage key={index} text="Esto es de OpenAI" />)
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

      {/* <TextMessageBoxFile 
        onSendMessage={ handlePost }
        placeholder='Escribe aquí lo que deseas'
      /> */}
      {/* {
        <TextMessageBoxSelect
          onSendMessage={console.log}
          options={[{id: "1", text: "Hola"}, {id: "2", text: "Mundo"}]}
        />
      } */}

    </div>
  )
}
