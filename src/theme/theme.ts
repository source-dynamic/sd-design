import { generate, presetPalettes } from '@ant-design/colors';

let styleElement: HTMLStyleElement | undefined = undefined;

const createStyleElement = () => {
    if (!styleElement) {
        styleElement = document.createElement('style');
        // 添加到head中
        document.head.appendChild(styleElement);
    }
}

/**
 * 将十六进制颜色值转换为 RGB 颜色值
 * @param hex
 */
const hexToRgb = (hex: string) => {
    // 移除十六进制颜色值的 '#' 符号（如果存在）
    hex = hex.replace("#", "");

    // 如果是三位数的十六进制数，则转换为六位数
    if (hex.length === 3) {
        hex = hex.split("").map(function (hexPart) {
            return hexPart + hexPart;
        }).join("");
    }

    // 将十六进制数转换为 RGB 值

    return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16)
    ];
}

export const setThemes = (primaryColor: string) => {
    createStyleElement();
    const colors = generate(primaryColor);
    console.log(primaryColor);
    console.log(colors);
    console.log(presetPalettes);
    // 向style中写入css3变量
    let cssVariables = ':root {';
    cssVariables += `\n--primary-color-base: ${hexToRgb(primaryColor)};`;

    for (let i = 1; i <= colors.length; i++) {
        cssVariables += `\n--primary-color-${i}: ${colors[i - 1]};`;
    }

    cssVariables += '}';

    styleElement!.innerHTML = cssVariables;
}
