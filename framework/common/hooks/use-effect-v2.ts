import { useEffect, useRef } from 'react';

const useEffectV2 = (func: any, deps: any) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
}

export default useEffectV2;