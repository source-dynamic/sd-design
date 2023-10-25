import { SizeType } from '@/components/_util/type';
import classNames from 'classnames';

export function getInputClassName(
    prefixCls: string,
    bordered: boolean,
    size?: SizeType,
    disabled?: boolean
) {
    return classNames(prefixCls, {
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-lg`]: size === 'large',
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-borderless`]: !bordered
    });
}
