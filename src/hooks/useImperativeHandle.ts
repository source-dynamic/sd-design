import { useEffect } from '@odoo/owl';

type CompRef<T> = {
    current?: Record<string, any>
}

export const useCompRef = <T> (): CompRef<T> => {
    return {
        current: undefined
    };
};

export const useImperativeHandle = (props: any, createHandle: Record<string, any>) => {
    useEffect(() => {
        if (props.hasOwnProperty('ref') && !!props.ref) {
            props.ref.current = createHandle;
        }

        return () => {
            if (props.hasOwnProperty('ref') && !!props.ref) {
                props.ref.current = undefined;
            }
        };
    });
};
