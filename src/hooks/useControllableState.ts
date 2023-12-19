import { onMounted, onWillUpdateProps, useState } from '@odoo/owl';

/**
 * 管理受控组件的值，比如props中未传入某个值时，由组件内部管理一个state，传入了则交由外部管理
 * @param props 组件的props
 * @param defaultState 默认值，必须包含所有待监控的key，未传入的key将被忽略
 * @param format 格式化函数，用于将props中的值转换为state中的值
 */
const useControllableState = <S extends object>(
    props: Record<string, any>,
    defaultState: S,
    format?: (value: any) => any
) => {
    const state = useState<S>(defaultState);

    const updateState = (props: Record<string, any>) => {
        for (const key in props) {
            if (key in defaultState && props[key] !== undefined) {
                (state as Record<string, any>)[key] = format ? format(props[key]) : props[key];
            }
        }
    };

    onWillUpdateProps((nextProps) => {
        // props更新时，将被监控的值更新到state中
        updateState(nextProps);
    });

    const setState = (values: Partial<S>) => {
        for (const key in values) {
            // 如果props中未传入该值，说明是非受控组件，则交由组件内部管理
            if (!(key in props) && values[key] !== undefined) {
                (state as Record<string, any>)[key] = format ? format(values[key]) : values[key];
            }
        }
    };

    onMounted(() => {
        updateState(props);
    });

    return {
        state,
        setState
    };
};

export default useControllableState;
