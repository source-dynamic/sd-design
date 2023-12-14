import { Meta, StoryObj } from '@storybook/react';
import { renderStoryComp } from '../../_utils/StoryComp';
// @ts-ignore
import ListCompRaw from '!!raw-loader!./List';
import ListComp from './List';

const meta: Meta = {
    title: '布局/List 列表',
    parameters: {
        layout: 'auto'
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const List: Story = {
    parameters: {
        docs: {
            source: {
                code: ListCompRaw
            }
        }
    },
    args: {
        bordered: false,
        size: 'middle',
        virtual: false
    },
    argTypes: {
        bordered: {
            description: '无边框模式'
        },
        size: {
            description: '尺寸',
            control: 'select',
            options: ['small', 'middle', 'large']
        },
        virtual: {
            description: '开启虚拟滚动'
        }
    },
    render: renderStoryComp(ListComp)
};
