import { useComponent, useEffect } from '@odoo/owl';

export const useEventListener = (target: any, eventName: string, handler: (event: any) => void,
    eventParams?: Record<string, any>
) => {
    const comp = useComponent();

    useEffect(() => {
        if (target.el) {
            const listener = (event: any) => handler.call(comp, event);
            target.el?.addEventListener(eventName, listener, eventParams);
            return () => target.el?.removeEventListener(eventName, listener, eventParams);
        }
    }, () => [target.el]);
};
