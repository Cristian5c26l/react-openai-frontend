import React, { FormEvent, useRef, useState } from 'react'

interface Props {
    onSendMessage: (message: string, selectedOption: string) => void;
    placeholder?: string;
    disableCorrections?: boolean;
    options: Option[];
    openAIIsRunning?: boolean;
}

interface Option {
    id: string;
    text: string;
}

export const TextMessageBoxSelect = ({onSendMessage, placeholder, disableCorrections = false, options, openAIIsRunning = false}: Props) => {

    const formRef = useRef<HTMLFormElement>(null); // Crear una referencia al formulario

    const [message, setMessage] = useState('');
    const [selectedOption, setSelectedOption] = useState<string>('');

    const handleMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Evitar la propagación del formulario

        if ( openAIIsRunning ) {
            onSendMessage( message, selectedOption  );
            return;
        }

        if ( message.trim().length === 0 ) return;
        if ( selectedOption === '' ) return;

        onSendMessage( message, selectedOption  );
        setMessage('');

    }


    // w-full es para ocupar todo el ancho posible. px-4 es para dar un padding de 4 en el eje x,
  return (
    <form
        ref={formRef}
        onSubmit={ handleMessage }
        className='flex flex-row items-center h-16 rounded-xl bg-[#444] w-full px-4'
    >
        <div className='flex-grow'>
            <div className='flex'>
                {/**Con el input, cuando doy enter, se hace el submit del formulario */}
                {/* <input 
                    type="text" 
                    autoFocus
                    name='message'
                    className='w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10'
                    placeholder={placeholder}
                    autoComplete={disableCorrections ? 'on': 'off'}
                    autoCorrect={disableCorrections ? 'on': 'off'}
                    spellCheck={disableCorrections ? 'true': 'false'}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    disabled={openAIIsRunning}
                /> */}

                {/** Resize-none hace que el text area no se pueda extender o agrandar con click */}
                {/** Uso p-2 para que el texto no comience desde la parte superior izquierda sino desde la parte central izquierda */}
                <textarea 
                    autoFocus
                    name='message'
                    className='w-full rounded-xl focus:outline-none pl-4 h-10 resize-none text-area-translate-page p-2'
                    placeholder={placeholder}
                    autoComplete={disableCorrections ? 'on': 'off'}
                    autoCorrect={disableCorrections ? 'on': 'off'}
                    spellCheck={disableCorrections ? 'true': 'false'}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { // Verifica si se presionó Enter sin Shift
                            if ( formRef.current ) {
                                formRef.current.requestSubmit();
                            }
                        }
                    }}
                    disabled={openAIIsRunning}
                />

                <select 
                    name="select"
                    className='w-2/5 ml-5 border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10'
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    disabled={openAIIsRunning}
                >
                    <option value="">Seleccione</option>
                    {
                        options.map(({id, text}) => (
                            <option key={id} value={id}>{text}</option>
                        ))
                    }
                </select>

            </div>
        </div>

        <div className='ml-4'>
            <button className='btn-primary'>{/**Por defecto, cuando se da click a este boton, activa la funcion onSubmit de form, que sería handleMessage*/}
                {
                    (!openAIIsRunning)
                    ? 
                        <i className='fa-solid fa-paper-plane'></i>
                    :
                        <i className='fa-solid fa-stop'></i>
                }
                
            </button>{/**Iconos de font-awesome: https://fontawesome.com/icons/stop?f=classic&s=solid */}
        </div>

    </form>
  )
}
