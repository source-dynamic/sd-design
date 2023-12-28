import { useEffect } from '@odoo/owl';

type TargetRef = {
    el: any;
}

/**
 * 使用ResizeObserver对元素尺寸进行观察，当元素尺寸发生变化时，执行回调函数，性能开销较小
 * @param targetRef
 * @param handle
 */
export const useResizeObserver = (targetRef: TargetRef, handle: (entry: ResizeObserverEntry) => void) => {
    useEffect(() => {
        if (targetRef.el) {
            const resizeObserver = new ResizeObserver((entries) => {
                entries.forEach((entry) => {
                    handle(entry);
                });
            });
            // 开始观察目标元素
            resizeObserver.observe(targetRef.el);
            return () => {
                resizeObserver.disconnect();
            }
        }
    }, () => [targetRef.el]);
}

/**
 * 使用MutationObserver对元素变化进行观察，当元素发生变化时，执行回调函数，性能开销较大
 * @param targetRef
 * @param handle
 */
export const useMutationObserver = (targetRef: TargetRef, handle: (entry: MutationRecord) => void) => {
    useEffect(() => {
        if (targetRef.el) {
            const mutationObserver = new MutationObserver((entries) => {
                entries.forEach((entry) => {
                    handle(entry);
                });
            });
            // 开始观察目标元素
            mutationObserver.observe(targetRef.el);
            return () => {
                mutationObserver.disconnect();
            }
        }
    }, () => [targetRef.el]);
}
