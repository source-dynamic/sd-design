import { CompRef } from '@/hooks/useImperativeHandle';

export const baseProps = {
    slots: { type: Object, optional: true },
    ref: { type: Object, optional: true }
};

export type BaseProps = {
    slots?: Record<string, any>;
    ref?: CompRef;
}
