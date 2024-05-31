import type { AudioToTextResponse } from "../../interfaces";

export const audioToTextUseCase = async(audioFile: File, prompt?: string) => {

    try {

        // console.log({audioFile, prompt});

        // Body Tipo FormData o multipart:
        const formData = new FormData();
        formData.append('file', audioFile);

        if (prompt) {
            formData.append('prompt', prompt);
        }
        
        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/audio-to-text`, {
            method: 'POST',
            body: formData
        });

        const data = await resp.json() as AudioToTextResponse;

        return data;




    } catch (error) {// error corresponde a la instancia new Error('No se pudo realizar la corrección')
        // console.log('Error', error);// error implicitamente ejecuta su metodo toString, el cual devuelve o retorna "No se pudo realizar la corrección" como en Java
        return null;
    }

}