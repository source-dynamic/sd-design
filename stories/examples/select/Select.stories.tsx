import { Meta, StoryObj } from '@storybook/react';
import { renderStoryComp } from '../../_utils/StoryComp';
// @ts-ignore
import SelectCompRaw from '!!raw-loader!./Select';
import SelectComp from './Select';

const meta: Meta = {
    title: '数据录入/Select 选择器',
    parameters: {
        layout: 'auto'
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Select: Story = {
    parameters: {
        docs: {
            source: {
                code: SelectCompRaw
            }
        }
    },
    render: renderStoryComp(SelectComp)
};
