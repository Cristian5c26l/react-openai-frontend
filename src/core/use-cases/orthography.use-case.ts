import type { OrthographyResponse } from "../../interfaces";// Las interfaces cuando se importan van con type para que no se importe nada cuando estamos haciendo el build de produccion




export const orthographyUseCase = async(prompt: string) => {

    try {
        
        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/orthography-check`, {// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompt: prompt})
        });

        if ( resp.ok === false ) throw new Error('No se pudo realizar la corrección');// Este error se "arroja" al catch

        const data = await resp.json() as OrthographyResponse;


        return {
            ok: true,
            ...data,
        }


    } catch (error) {// error corresponde a la instancia new Error('No se pudo realizar la corrección')
        // console.log('Error', error);// error implicitamente ejecuta su metodo toString, el cual devuelve o retorna "No se pudo realizar la corrección" como en Java
        return {
            ok: false,
            userScore: 0,
            errors: [],
            message: 'No se pudo realizar la corrección',
        }
    }

}