import { useState } from '@odoo/owl';

type State = {
    timer?: any
}

/**
 * 提供可取消的timer
 */
export const useCancellableTimer = () => {
    const timerState = useState<State>({
        timer: undefined
    });

    const cancel = () => {
        const { timer } = timerState;
        if (timer) {
            clearTimeout(timer);
        }
    };

    const run = (handle: () => void, timeout: number) => {
        cancel();
        timerState.timer = setTimeout(() => {
            handle();
            timerState.timer = undefined;
        }, timeout);
    };

    return {
        run,
        cancel
    };
};
