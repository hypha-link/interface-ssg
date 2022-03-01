import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

export default function useMountEffect(effect: EffectCallback, deps: DependencyList): void {
    const didMount = useRef(false);

    useEffect(() => {
        if(didMount.current) effect();
        else didMount.current = true;
    }, deps)
}
