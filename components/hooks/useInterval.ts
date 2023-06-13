import { useCallback, useEffect, useRef, useState } from 'react'

interface optionsProps {
    immediate?: boolean
    loops?: number
    fps?: number
    pulse?: boolean
}

/**
 * Create an interval
 * @param callback The function called each round the interval fires.
 * @param ms The amount of time in milliseconds that it takes for a round to occur.
 * @param enable Whether the timer should be enabled
 * @param options.immediate Whether the first callback is called immediately or with a delay (default: false)
 * @param options.loops How many rounds the interval should run for (default: -1 is infinite)
 * @param options.fps How often to report the time remaining in frames per second. (default: 30)
 * @param options.pulse Whether to pulse when looping or toggle
 * @returns The time remaining in milliseconds
 */
 export default function useInterval(callback: () => void, ms: number, enable: boolean, options?: optionsProps) {
    //Set default options
    options.immediate = options.immediate || false;
    options.loops = options.loops || -1;
    options.fps = options.fps || 30;
    options.pulse = options.pulse || false;

    const savedCallback = useRef(callback);
    const initialDate = useRef(Date.now());
    const nextRerender = useRef(Date.now() + (1000 / options.fps));
    const completedLoops = useRef(0);
    const [timeRemaining, setTimeRemaining] = useState(ms);
    const [enabled, setEnabled] = useState<boolean>(false);

    useEffect(() => {
        //Pulse if enabled & loops set
        if(options.loops !== -1 && options.pulse){
            setEnabled(enabled => !enabled);
        }
        //Toggle otherwise
        else{
            setEnabled(enable);
        }
    }, [enable, options.loops, options.pulse])

    //Save the callback so that the interval doesn't loop because of a new fn being created (dependency change)
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback])

    useEffect(() => {
        const reset = () => {
            initialDate.current = Date.now();
            nextRerender.current = Date.now() + (1000 / options.fps);
            completedLoops.current = 0;
            setTimeRemaining(ms);
            clearInterval(timer);
        }
        const timeLeftCallback = () => {
            //The time left until the the interval has finished
            const timeLeft = (initialDate.current + ms) - Date.now();
            //Handles each render & updates the time remaining
            if(Date.now() >= nextRerender.current){
                nextRerender.current = Date.now() + (1000 / options.fps);
                setTimeRemaining(timeLeft);
            }
            //Calls the provided function & resets the interval
            if(timeLeft <= 0){
                savedCallback.current();
                completedLoops.current += 1;
                setTimeRemaining(ms);
                initialDate.current = Date.now();
                nextRerender.current = Date.now() + (1000 / options.fps);
                //Clear after loops have finished
                if(options.loops !== -1 && options.loops <= completedLoops.current){
                    setEnabled(false);
                    reset();
                }
            }
        }
        //Set initial values
        reset();
        //Set timer when enabled & switch between immediate & delayed
        const timer = enabled && (options.immediate ? setImmediateInterval(timeLeftCallback, 1) : setInterval(timeLeftCallback, 1));
        return () => {
            clearInterval(timer);
        }
    }, [enabled, ms, options.immediate, options.loops, options.fps]);

    function setImmediateInterval(callback: () => void, ms: number): NodeJS.Timeout {
        savedCallback.current();
        return setInterval(callback, ms);
    };

    return timeRemaining;
}

/**
 * Create an interval by calling a function
 * Can be used similarly to useInterval if using useEffect to toggle rather than pulse
 * @param ms The amount of time in milliseconds that it takes for a round to occur.
 * @param fps How often to report the time remaining in frames per second. (Default: 30)
 * @returns Returns a timer function & the time remaining in milliseconds
 */
 export function useSetInterval(ms: number, fps = 30) {
    const savedCallback = useRef(() => {});
    const initialDate = useRef(Date.now());
    const nextRerender = useRef(Date.now() + (1000 / fps));
    const completedLoops = useRef(0);
    const _loops = useRef<number>(-1);
    const _immediate = useRef<boolean>(false);
    const [enabled, setEnabled] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number>();

    useEffect(() => {
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
            //Calls the provided function, increments completed loops, & resets the interval
            if(timeLeft <= 0){
                savedCallback.current();
                completedLoops.current += 1;
                setTimeRemaining(ms);
                initialDate.current = Date.now();
                nextRerender.current = Date.now() + (1000 / fps);
                //Clear after loops have finished
                if(_loops.current !== -1 && _loops.current <= completedLoops.current){
                    setEnabled(false);
                    reset();
                }
            }
        }
        //Set initial values
        reset();
        //Set timer when enabled & switch between immediate & delayed
        const timer = enabled && (_immediate ? setImmediateInterval(timeLeftCallback, 1) : setInterval(timeLeftCallback, 1));
        //Clear timer when disabled
        !enabled && reset();
        return () => {
            clearInterval(timer);
        }
    }, [enabled, ms, fps, _immediate, _loops]);

    /**
     * Call directly to set an interval.
     * Alternatively call inside useEffect with a toggle dependency.
     * @param callback The function called each round the interval fires.
     * @param immediate Whether the first callback is called immediately or with a delay (default: false)
     * @param loops How many rounds the interval should run for (default: -1 is infinite)
     * @returns The time remaining in milliseconds
     */
    const setTimer = useCallback((callback: () => void, immediate = false, loops = -1) => {
        setEnabled(enabled => !enabled);
        //Save the callback so that the interval doesn't loop because of a new fn being created (dependency change)
        savedCallback.current = callback;
        _loops.current = loops;
        _immediate.current = immediate;
    }, []);

    function setImmediateInterval(callback: () => void, ms: number): NodeJS.Timeout {
        savedCallback.current();
        return setInterval(callback, ms);
    };

    return {setTimer: setTimer, timeRemaining: timeRemaining};
}