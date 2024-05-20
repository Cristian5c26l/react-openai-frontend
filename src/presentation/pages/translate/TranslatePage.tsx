import React, { useEffect, useRef, useState } from 'react'
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxSelect } from '../../components';
import { translateTextUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {

  const abortController = useRef( new AbortController() );

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);// messages será un arreglo de objetos donde cada uno tendrá propiedades text y isGpt

  const handlePost = async(text: string, selectedOption: string) => {

    // console.log('HANDLE POST!');

    if (isLoading) {
      console.log('Abort!');
      abortController.current.abort(); // Esto hace que el fetch se detenga
      abortController.current = new AbortController();// Para que no se cancele el nuevo Stream o respuesta completa de OpenAi (fetch hacia OpenAI)
      return;
    }
    
    setIsLoading(true);
    const newMessage = `Traduce: "${text}" al idioma ${selectedOption}`;
    
    setMessages((prevMessagesValue) => [...prevMessagesValue, {text: newMessage, isGpt: false}]);// esto se muestra en la pantalla

    const {ok, message} = await translateTextUseCase(text, selectedOption, abortController.current.signal);
    setIsLoading(false);

    if ( ok === false ) {
      setMessages((prevMessagesValue) => [...prevMessagesValue, {text: 'No se pudo realizar la traducción', isGpt: true}]);
    } else {
      setMessages((prevMessagesValue) => [...prevMessagesValue, {
        text: message, isGpt: true,
      }]);
    }

  }

  useEffect(() => {// Este efecto se ejecuta despues del primer renderizado del componente y después de que se actualice "messages"
    // Después de agregar el nuevo mensaje, desplaza automáticamente hacia abajo
    // del contenedor de mensajes
    if (messagesContainerRef.current) {// Fuente https://stackoverflow.com/questions/18614301/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }// Con esta implementación, cada vez que se envíe un nuevo mensaje, el contenedor de mensajes se desplazará automáticamente hacia abajo para mostrar el último mensaje añadido.

  }, [messages]);
  

  return (
    <div className='chat-container'>{/** chat-container está dentro de archivo index.css */}
      <div className='chat-messages' ref={messagesContainerRef}>{/** chat-messages tiene overflow-scroll el cual es el que permite realizar scroll. Como chat-messages tiene overflow-scroll, se usa scroll-behavior: smooth; para que cuando haya un desplazamiento hacia abajo de manera automatica, haga este desplazamiento de manera suave */}
        <div className='grid grid-cols-12 gap-y-2'>
          {/** Bienvenida */}
          <GptMessage text="¿Qué quieres que traduzca hoy?" />

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

      <TextMessageBoxSelect
        onSendMessage={ handlePost }
        placeholder='Escribe aquí lo que deseas'
        options={languages}
        openAIIsRunning={isLoading}
      />

    </div>
  )
}
