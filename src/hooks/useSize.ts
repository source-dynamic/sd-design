import { useEffect, useRef, useState } from '@odoo/owl';

type State = {
    width: number | undefined,
    height: number | undefined,
}

/**
 * 返回指定元素实时的宽高
 * @param targetRefName
 */
export const useSize = (targetRefName: string) => {
    const targetRef = useRef(targetRefName);

    const state = useState<State>({
        width: undefined,
        height: undefined,
    })

    useEffect(() => {
        if (targetRef.el) {
            const resizeObserver = new ResizeObserver((entries) => {
                entries.forEach((entry) => {
                    const { clientWidth, clientHeight } = entry.target;
                    state.width = clientWidth;
                    state.height = clientHeight;
                });
            });
            resizeObserver.observe(targetRef.el);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, () => [targetRef.el]);

    return state;
};
