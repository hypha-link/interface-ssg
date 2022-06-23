import { useEffect, useRef } from 'react'

/**
 * An interval timer
 * @param enabled Whether the timer should be enabled
 * @param callback The function called each round the interval fires.
 * @param ms The amount of time in ms that it takes for a round to occur.
 * @param immediate Whether the first callback is called immediate or with a delay (defaults to true)
 */
export default function useInterval(enabled: boolean, callback: () => void, ms: number, immediate = true) {
    const savedCallback = useRef(callback)

    //Save the callback so that the interval doesn't loop because of a new fn being created (dependency change)
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        //Set timer when enabled
        const timer = enabled && immediate ? setImmediateInterval(savedCallback.current, ms) : setInterval(savedCallback.current, ms);
        //Clear timer when disabled
        !enabled && clearInterval(timer);
        return () => {
            clearInterval(timer);
        }
    }, [enabled, ms]);
}

const setImmediateInterval = (callback: () => void, ms: number): NodeJS.Timeout => {
    callback();
    return setInterval(callback, ms);
};