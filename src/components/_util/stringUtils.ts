/**
 * 将字符串中非数字字符移除转换为数字格式
 * @param value
 */
export const formatNumberCode = (value: string): string => {
    if (!value) return '';

    // 首先标记是否为负数
    const isNegative = value.startsWith('-');

    // 首先移除所有非数字字符，除了小数点
    let result = value.replace(/[^\d.]/g, '');

    // 分割字符串，保留最后一个小数点
    const parts = result.split('.');
    if (parts.length > 1) {
        // 除最后一个部分外，其他部分合并，然后添加最后一个部分
        result = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
    }

    // 如果原始字符串是负数，确保结果也是负数
    if (isNegative && result !== '') {
        result = '-' + result;
    }

    return result;
};
