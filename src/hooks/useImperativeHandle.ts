import { useComponent, useEffect, useState } from '@odoo/owl';

export type CompRef = {
    current?: Record<string, any>
}

export const useCompRef = (): CompRef => {
    return useState({
        current: undefined
    });
};

export const useImperativeHandle = (createHandle: () => Record<string, any>, depends?: () => any[]) => {
    const comp = useComponent();

    useEffect(() => {
        const props = comp.props;
        if (props.hasOwnProperty('ref') && !!props.ref) {
            props.ref.current = createHandle()
        }

        return () => {
            if (props.hasOwnProperty('ref') && !!props.ref) {
                props.ref.current = undefined;
            }
        };
    }, depends);
};
