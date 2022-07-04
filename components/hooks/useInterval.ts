import { useEffect, useRef, useState } from 'react'

/**
 * An advanced interval timer
 * @param callback The function called each round the interval fires.
 * @param ms The amount of time in milliseconds that it takes for a round to occur.
 * @param enabled Whether the timer should be enabled (default: true)
 * @param immediate Whether the first callback is called immediately or with a delay (default: false)
 * @param loops How many rounds the interval should run for (default: -1 is infinite)
 * @returns The time remaining in milliseconds
 */
export default function useInterval(callback: () => void, ms: number, enabled = true, immediate = false, loops = -1) {
    //How often to report the time remaining in frames per second.
    const fps = 30;
    const savedCallback = useRef(callback);
    const initialDate = useRef(Date.now());
    const nextRerender = useRef(Date.now() + (1000 / fps));
    const completedLoops = useRef(0);
    const [timeRemaining, setTimeRemaining] = useState(ms);

    //Save the callback so that the interval doesn't loop because of a new fn being created (dependency change)
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback])

    useEffect(() => {
        //Set initial values
        initialDate.current = Date.now();
        nextRerender.current = Date.now() + (1000 / fps);
        completedLoops.current = 0;
        const reset = () => {
            initialDate.current = Date.now();
            nextRerender.current = Date.now() + (1000 / fps);
            completedLoops.current = 0;
            setTimeRemaining(ms);
            clearInterval(timer);
        }
        const timeLeftCallback = () => {
            //The time left until the the interval has finished
            const timeLeft = (initialDate.current + ms) - Date.now();
            //Handles each render & updates the time remaining
            if(Date.now() >= nextRerender.current){
                nextRerender.current = Date.now() + (1000 / fps);
                setTimeRemaining(timeLeft);
            }
            //Calls the provided function & resets the interval
            if(timeLeft <= 0){
                savedCallback.current();
                completedLoops.current += 1;
                setTimeRemaining(ms);
                initialDate.current = Date.now();
                nextRerender.current = Date.now() + (1000 / fps);
                //Clear after loops have finished
                if(loops !== -1 && loops <= completedLoops.current) reset();
            }
        }
        //Set timer when enabled & switch between immediate & delayed
        const timer = enabled && (immediate ? setImmediateTimedInterval(timeLeftCallback, 1) : setInterval(timeLeftCallback, 1));
        //Clear timer when disabled
        !enabled && reset();
        return () => {
            clearInterval(timer);
        }
    }, [enabled, ms, immediate, loops]);

    function setImmediateTimedInterval(callback: () => void, ms: number): NodeJS.Timeout {
        savedCallback.current();
        return setInterval(callback, ms);
    };

    return timeRemaining;
}

/**
 * An interval timer
 * @param callback The function called each round the interval fires.
 * @param ms The amount of time in ms that it takes for a round to occur.
 * @param frequency How often we report the time remaining.
 * @param enabled Whether the timer should be enabled (default: true)
 * @param immediate Whether the first callback is called immediately or with a delay (default: true)
 * @returns The time remaining in ms
 */
export function useTimedInterval(callback: () => void, ms: number, frequency = 1000, enabled = true, immediate = true) {
    const savedCallback = useRef(callback);
    const [timeRemaining, setTimeRemaining] = useState(ms);

    //Save the callback so that the interval doesn't loop because of a new fn being created (dependency change)
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        let timeLeft = ms;
        let timeleftCallback = () => {
            if(timeLeft <= frequency){
                savedCallback.current();
                setTimeRemaining(ms);
                clearInterval(timer);
            }
            else{
                timeLeft -= frequency;
                setTimeRemaining(timeLeft);
            }
        }
        //Set timer when enabled
        const timer = enabled && immediate ? setImmediateInterval(timeleftCallback, frequency) : setInterval(timeleftCallback, frequency);
        //Clear timer when disabled
        !enabled && clearInterval(timer);
        return () => {
            clearInterval(timer);
        }
    }, [enabled, ms, frequency, immediate]);

    return timeRemaining;
}

export function setImmediateInterval(callback: () => void, ms: number): NodeJS.Timeout {
    callback();
    return setInterval(callback, ms);
}