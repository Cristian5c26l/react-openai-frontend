import React, { useState } from 'react'
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from '../../components'
import { orthographyUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  }
}


export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);// messages será un arreglo de objetos donde cada uno tendrá propiedades text y isGpt

  const handlePost = async(text: string) => {
    setIsLoading(true);
    setMessages((prevMessagesValue) => [...prevMessagesValue, {text: text, isGpt: false}]);

    const { ok, errors, message, userScore } = await orthographyUseCase(text);

    // console.log(data);
    if ( ok === false ) {
      setMessages((prevMessagesValue) => [...prevMessagesValue, {text: 'No se pudo realizar la corrección', isGpt: true}]);
    } else {
      setMessages((prevMessagesValue) => [...prevMessagesValue, {
        text: message, isGpt: true,
        info: { userScore, errors, message }
      }]);
    }

    
    // Todo: Añadir el mensaje de isGPT en true
    setIsLoading(false);
  }

  return (
    <div className='chat-container'>{/** chat-container está dentro de archivo index.css */}
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          {/** Bienvenida */}
          <GptMessage text="Hola, puedes escribir tu texto en español, y te ayudo con las correcciones" />

          {/* <MyMessage text='Hola mundo' /> */}

          {/* {
            messages.map((message, index) => (
              message.isGpt
                ? (<GptMessage key={index} text="Esto es de OpenAI" />)
                : (<MyMessage key={index} text={message.text} />)
            ))
          } */}

          {
            messages.map((message, index) => (
              message.isGpt
                ? (<GptOrthographyMessage key={index} {...message.info!} />)
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
