import { renderStoryComp } from '../../_utils/StoryComp';
import PanelComp from './Panel';
// @ts-ignore
import PanelCompRaw from '!!raw-loader!./Panel';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
    title: '高阶组件/Panel 面板',
    parameters: {
        layout: 'centered'
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Panel: Story = {
    parameters: {
        docs: {
            source: {
                code: PanelCompRaw
            }
        }
    },
    args: {
        forceRefreshWhenDataChange: false
    },
    argTypes: {
        forceRefreshWhenDataChange: {
            description: 'data变化时强制重渲染'
        },
    },
    render: renderStoryComp(PanelComp)
};
