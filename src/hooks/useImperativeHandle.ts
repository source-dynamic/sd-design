import { useComponent, useEffect } from '@odoo/owl';

export type CompRef = {
    current?: Record<string, any>
}

export const useCompRef = (): CompRef => {
    return {
        current: undefined
    };
};

export const useImperativeHandle = (createHandle: Record<string, any>) => {
    const comp = useComponent();

    useEffect(() => {
        const props = comp.props;
        if (props.hasOwnProperty('ref') && !!props.ref) {
            props.ref.current = createHandle;
        }

        return () => {
            if (props.hasOwnProperty('ref') && !!props.ref) {
                props.ref.current = undefined;
            }
        };
    }, () => [comp.props]);
};
