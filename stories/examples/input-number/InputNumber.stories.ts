import { Meta, StoryObj } from '@storybook/react';
import { renderStoryComp } from '../../_utils/StoryComp';
// @ts-ignore
import InputNumberCompRaw from '!!raw-loader!./InputNumber';
import InputNumberComp from './InputNumber';

const meta: Meta = {
    title: '数据录入/InputNumber 数字输入框',
    parameters: {
        layout: 'centered'
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const InputNumber: Story = {
    args: {
        disabled: false,
        size: 'middle',
        border: true
    },
    argTypes: {
        disabled: {
            description: '禁用状态'
        },
        size: {
            description: '尺寸',
            control: 'select',
            options: ['small', 'middle', 'large']
        },
        border: {
            description: '无边框模式'
        }
    },
    parameters: {
        docs: {
            source: {
                code: InputNumberCompRaw
            }
        }
    },
    render: renderStoryComp(InputNumberComp)
};
