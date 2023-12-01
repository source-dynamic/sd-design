import type { Preview } from '@storybook/react';
import './styles/index.scss';
// @ts-ignore
import odooCssContent from '!!raw-loader!./styles/web.assets_web.min.css';

const styleEl = document.createElement('style');
styleEl.textContent = odooCssContent;
document.head.appendChild(styleEl);

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    }
};

export default preview;
