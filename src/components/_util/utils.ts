/**
 * 将style键值对转换为style字符串
 * @param styleObj
 */
export function stylesToString(styleObj: { [key: string]: string | number }): string {
    let styleStr = '';
    for (const style in styleObj) {
        if (styleObj[style] == undefined || styleObj[style] === '') continue;
        styleStr += `${style}: ${styleObj[style]};`;
    }
    return styleStr;
}

/**
* 根据类名返回带前缀的类名
* @param suffixCls 类名
* @param customizePrefixCls  自定义类前缀名，此值会覆盖默认前缀
*/
export const getPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) {
        return `${customizePrefixCls}-${suffixCls}`
    }
    return `sd-${suffixCls}`;
};
