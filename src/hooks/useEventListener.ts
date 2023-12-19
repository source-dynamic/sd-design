import { useComponent, useEffect } from '@odoo/owl';

export const useEventListener = (targetRef: any, eventName: string, handler: (event: any) => void,
    eventParams?: Record<string, any>
) => {
    const comp = useComponent();

    useEffect(() => {
        if (targetRef.el) {
            const listener = (event: any) => handler.call(comp, event);
            targetRef.el?.addEventListener(eventName, listener, eventParams);
            return () => targetRef.el?.removeEventListener(eventName, listener, eventParams);
        }
    }, () => [targetRef.el]);
};
