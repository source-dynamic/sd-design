import type { Preview } from '@storybook/react';
import './styles/index.scss';
// @ts-ignore
import odooCssContent from '!!raw-loader!./styles/web.assets_web.min.css';
// @ts-ignore
import packageJson from '../package.json';

// @ts-ignore
window.__OWL_VERSION__ = packageJson.version;
// @ts-ignore
window.__BUILD_DATE__ = undefined;

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
