
export const textToAudioUseCase = async(prompt: string, voice: string) => {

    try {
        
        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/text-to-audio`, {// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompt: prompt, voice})
        });

        if ( resp.ok === false ) throw new Error('No se pudo realizar la generación del audio');// Este error se "arroja" al catch

        const audioFile = await resp.blob();// Almacenar en audioFile el archivo .mp3 que esta contenido en la respuesta a la peticion 
        const audioUrl = URL.createObjectURL( audioFile );// url para colocarse en un audio tag de html

        // audioUrl = 'blob: http://localhost/5173/bvq0434n'

        return {
            ok: true,
            message: prompt,
            audioUrl: audioUrl
        }


    } catch (error) {// error corresponde a la instancia new Error('No se pudo realizar la corrección')
        // console.log('Error', error);// error implicitamente ejecuta su metodo toString, el cual devuelve o retorna "No se pudo realizar la corrección" como en Java
        return {
            ok: false,
            message: 'No se pudo realizar la generación del audio',
        }
    }

}