import React, { FormEvent, useRef, useState } from 'react'

interface Props {
    onSendMessage: (message: string, file: File) => void;// se pone file en lugar de audioFile porque componente TextMessageBoxFile trabaja con archivos que se le indique con "accept"
    placeholder?: string;
    disableCorrections?: boolean;
    accept?: string; // image/* o pdf/* o application/*
}

export const TextMessageBoxFile = ({onSendMessage, placeholder, disableCorrections = false, accept}: Props) => {

    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>();

    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Evitar la propagación del formulario

        // if ( message.trim().length === 0 ) return; // message = text = prompt. El prompt es opcional
        if (!selectedFile) return;

        onSendMessage( message, selectedFile );
        setMessage('');
        setSelectedFile(null);

    }


    // w-full es para ocupar todo el ancho posible. px-4 es para dar un padding de 4 en el eje x,
  return (
    <form
        onSubmit={ handleMessage }
        className='flex flex-row items-center h-16 rounded-xl bg-white w-full px-4'
    >
        {/** Paper Clip o Boton con icono de Clip */}
        <div className='mr-3'>
            <button
                type="button"
                className='flex items-center justify-center text-gray-400 hover:text-gray-600'
                onClick={() => inputFileRef.current?.click()}
            >
                <i className='fa-solid fa-paperclip text-xl'></i>
            </button>

            <input 
                type="file" 
                ref={inputFileRef}
                accept={accept}
                onChange={(e) => setSelectedFile(e.target.files?.item(0))}
                hidden// Esto es lo mismo que si estuviera hidden={true}
            />

        </div>

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
            <button 
                className='btn-primary'
                disabled={ !selectedFile }
            >
                {
                    (!selectedFile)
                        ? <span className='mr-2'>Enviar</span>
                        : <span className='mr-2'>{ selectedFile.name.substring(0,10) + '...' }</span>
                }
                <i className='fa-regular fa-paper-plane'></i>
            </button>
        </div>

    </form>
  )
}
