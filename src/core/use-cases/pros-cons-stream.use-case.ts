



export const prosConsStreamUseCase = async(prompt: string) => {

    try {
        
        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/pros-cons-discusser-stream`, {// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompt: prompt}),
            // Todo: abortSignal (para cancelar peticion creo)
        });

        if ( resp.ok === false ) throw new Error('No se pudo hacer la comparativa');// Este error se "arroja" al catch

        const reader = resp.body?.getReader();

        if (!reader) {// En caso de que reader sea null (no se haya podido construir)
            console.log('No se pudo generar el reader');
            return null;
        }

        return reader;// reader es de tipo ReadableStreamDefaultReader<Uint8Array>

        // Para imprimir mensajes en consola se necesita un decodificador pues la informacion se va a ir construyendo poco a poco
        // Esto se va a ocupar o puede ocuparse en otro lugar!!!!!!
        // const decoder = new TextDecoder();

        // let text: string = '';// Variable donde se irá concatenando todas las emisiones brindadas por el stream de información. text se irá actualizando poco a poco

        // while(true) {
        //     const {value, done} = await reader.read();

        //     if ( done ) {// Cuando ya no hay mas informacion por emitir, salir del bucle con break
        //         break;
        //     }

        //     const decodedChunk = decoder.decode(value, {stream: true});

        //     text += decodedChunk;
        //     console.log(text);
        // }
        


    } catch (error) {// error corresponde a la instancia new Error('No se pudo realizar la corrección')
        console.log('Error', error);// error implicitamente ejecuta su metodo toString, el cual devuelve o retorna "No se pudo realizar la corrección" como en Java
        return null
    }

}