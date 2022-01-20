import {useEffect, DependencyList, EffectCallback} from 'react';

export const useAsyncEffect = (
    // We don't want Promise<React.EffectCallback>, since EffectCallback unions void with a
    // function-returning type. See the comment above the invocation of effectCallback for why we
    // can't do this.
    effectCallback: () => Promise<void>,
    deps?: DependencyList,
    cleanup?: () => ReturnType<EffectCallback>,
): void => {
    useEffect(() => {
        // Returning the next line will make React try to call a Promise, which clearly doesn't
        // work. So, we don't return it. If we do want a separate cleanup function, we could use
        // cleanup, which _is_ synchronous, which means it's not Promise-wrapped, so it's callable.
        effectCallback();

        return cleanup && cleanup();
        // Because deps is a dynamic set of dependencies, React will complain that it can't statically
        // determine whether it's total. Nothing we can do about this, so we'll disable the warning.
        //
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};
