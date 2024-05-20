import { useEffect, useState } from '@odoo/owl';

export const useUpdateEffect = (effect: () => void, deps?: () => any[]) => {
    const ref = useState({ value: false });

    useEffect(() => {
        if (ref.value) {
            effect();
        }
        ref.value = true;
    }, deps);
}
