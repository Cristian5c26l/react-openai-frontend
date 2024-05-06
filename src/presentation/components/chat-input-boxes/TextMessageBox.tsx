import React, { FormEvent, useState } from 'react'

interface Props {
    onSendMessage: (message: string) => void;
    placeholder?: string;
    disableCorrections?: boolean;
}

export const TextMessageBox = ({onSendMessage, placeholder, disableCorrections = false}: Props) => {

    const [message, setMessage] = useState('');

    const handleMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Evitar la propagación del formulario

        if ( message.trim().length === 0 ) return;

        onSendMessage( message );
        setMessage('');

    }


    // w-full es para ocupar todo el ancho posible. px-4 es para dar un padding de 4 en el eje x,
  return (
    <form
        onSubmit={ handleMessage }
        className='flex flex-row items-center h-16 rounded-xl bg-white w-full px-4'
    >
        <div className='flex-grow'>
            <div className='relative w-full'>

                <input 
                    type="text" 
                    autoFocus
                    name='message'
                    className='flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10'
                    placeholder={placeholder}
                    autoComplete={disableCorrections ? 'on': 'off'}
                    autoCorrect={disableCorrections ? 'on': 'off'}
                    spellCheck={disableCorrections ? 'true': 'false'}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />

            </div>
        </div>

        <div className='ml-4'>
            <button className='btn-primary'>{/** Aun sin que el boton sea de tipo submit es capaz de que cuando es clickeado hace el submit (handleMessage) del formulario */}
                <span className='mr-2'>Enviar</span>
                <i className='fa-regular fa-paper-plane'></i>
            </button>
        </div>

    </form>
  )
}
