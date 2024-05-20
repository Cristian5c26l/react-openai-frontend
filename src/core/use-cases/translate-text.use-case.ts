import { TranslateTextResponse } from "../../interfaces";



export const translateTextUseCase = async(prompt: string, lang: string, abortSignal: AbortSignal) => {
    try {

        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'// Viajará un body tipo json
            },
            body: JSON.stringify({prompt: prompt, lang: lang}),
            signal: abortSignal
        });

        if ( resp.ok === false ) throw new Error('No se pudo realizar la traducción');// Este error se "arroja" al catch

        const data = await resp.json() as TranslateTextResponse;

        return {
            ok: true,
            ...data
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo traducir'
        }
        
    }
}