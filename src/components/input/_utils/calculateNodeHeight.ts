/**
 * @description: 计算textarea的自适应高度
 * 原理是通过挂载一个独立的textarea，并通过相同的样式渲染和value值，然后获取scrollHeight获取当前高度
 */
let hideTextareaElement: HTMLTextAreaElement | undefined = undefined;

const HIDDEN_TEXTAREA_STYLE = '\n  min-height:0 !important;\n  max-height:none !important;\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important;\n  pointer-events: none !important;\n';

const SIZING_STYLE = [
    'letter-spacing', 'line-height', 'padding-top', 'padding-bottom', 'font-family', 'font-weight', 'font-size',
    'font-variant', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-left', 'padding-right',
    'border-width', 'box-sizing', 'word-break', 'white-space'
];

export function calculateNodeStyling(node: HTMLTextAreaElement) {
    const style = getComputedStyle(node);
    const boxSizing = style.getPropertyValue('box-sizing') || style.getPropertyValue(
        '-moz-box-sizing') || style.getPropertyValue('-webkit-box-sizing');
    const paddingSize = parseFloat(style.getPropertyValue('padding-bottom')) + parseFloat(
        style.getPropertyValue('padding-top'));
    const borderSize = parseFloat(style.getPropertyValue('border-bottom-width')) + parseFloat(
        style.getPropertyValue('border-top-width'));
    const sizingStyle = SIZING_STYLE.map(function(name) {
        return ''.concat(name, ':').concat(style.getPropertyValue(name));
    }).join(';');
    return {
        sizingStyle: sizingStyle,
        paddingSize: paddingSize,
        borderSize: borderSize,
        boxSizing: boxSizing
    };
}

const createTextareaElementIfNeed = () => {
    if (!hideTextareaElement) {
        hideTextareaElement = document.createElement('textarea');
        hideTextareaElement.setAttribute('tab-index', '-1');
        hideTextareaElement.setAttribute('aria-hidden', 'true');
        document.body.appendChild(hideTextareaElement);
    }
};

export const calculateAutoSizeHeight = (uiTextElement: HTMLTextAreaElement) => {
    createTextareaElementIfNeed();
    if (uiTextElement.getAttribute('wrap')) {
        hideTextareaElement!.setAttribute('wrap', uiTextElement.getAttribute('wrap')!);
    } else {
        hideTextareaElement!.removeAttribute('wrap');
    }
    const _calculateNodeStyling = calculateNodeStyling(uiTextElement),
        paddingSize = _calculateNodeStyling.paddingSize,
        borderSize = _calculateNodeStyling.borderSize,
        boxSizing = _calculateNodeStyling.boxSizing,
        sizingStyle = _calculateNodeStyling.sizingStyle;

    hideTextareaElement!.setAttribute('style', ''.concat(sizingStyle, ';').concat(HIDDEN_TEXTAREA_STYLE));
    hideTextareaElement!.value = uiTextElement.value || uiTextElement.placeholder || '';
    const height =  hideTextareaElement!.scrollHeight
    hideTextareaElement!.value = '';
    return height;
};
