import { onWillUpdateProps, useState } from '@odoo/owl';

/**
 * 管理受控组件的值，比如props中未传入某个值时，由组件内部管理一个state，传入了则交由外部管理
 * @param props 组件的props
 * @param defaultState 默认值，必须包含所有待监控的key，未传入的key将被忽略
 */
const useControllableState = <S extends object> (
    props: Record<string, any>,
    defaultState: S
) => {

    const state = useState<S>(defaultState);

    onWillUpdateProps((nextProps) => {
        // props更新时，将被监控的值更新到state中
        for (const key in nextProps) {
            if (key in defaultState) {
                (state as Record<string, any>)[key] = nextProps[key];
            }
        }
    });

    const setState = (values: Partial<S>) => {
        for (const key in values) {
            // 如果props中未传入该值，说明是非受控组件，则交由组件内部管理
            if (!(key in props)) {
                (state as Record<string, any>)[key] = values[key];
            }
        }
    };

    return {
        state,
        setState
    };
};

export default useControllableState;
