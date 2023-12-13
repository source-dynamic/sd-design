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
    },
    argTypes: {
    },
    render: renderStoryComp(ListComp)
};
