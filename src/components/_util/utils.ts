import classNames from 'classnames';

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
        return `${customizePrefixCls}-${suffixCls}`;
    }
    return `sd-${suffixCls}`;
};

/**
 * 给svg字符串添加属性
 * @param svgString svg字符串
 * @param attributes 属性键值对
 */
export const addSvgAttributes = (svgString: string, attributes: Record<string, any> = {}) => {
    if (!attributes.fill) {
        attributes['fill'] = 'currentcolor';
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.documentElement as HTMLElement;
    Object.entries(attributes).forEach(([name, value]) => {
        svgElement.setAttribute(name, value);
    });
    return new XMLSerializer().serializeToString(doc);
};

/**
 * 获取svg渲染到节点的字符串
 * @param svgString
 * @param attributes
 * @param className
 */
export const getSDSVG = (svgString: string, attributes: Record<string, any> = {}, className?: string) => {
    return `<span class="${classNames(getPrefixCls('icon'), className)}">${addSvgAttributes(svgString, attributes)}</span>`;
};

/**
 * 从指定对象中删除指定键，并返回结果
 * @param obj 指定的对象
 * @param keysToOmit 要删除的键
 */
export const omit = (obj: Record<string, any>, keysToOmit: string[]) => {
    const result = { ...obj };
    for (const key of keysToOmit) {
        if (key in result) {
            delete result[key];
        }
    }
    return result;
};
