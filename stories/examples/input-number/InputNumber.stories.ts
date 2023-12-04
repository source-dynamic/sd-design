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
        border: true,
        controls: true,
        decimalSeparator: '.',
        keyboard: true,
        readonly: false,
        step: 1
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
        step: {
            description: '每次改变的步数，可以为小数',
            control: { type: 'range', min: 0.1, max: 2, step: 0.1 }
        },
        border: {
            description: '无边框模式'
        },
        controls: {
            description: '是否显示控制按钮'
        },
        decimalSeparator: {
            description: '小数点'
        },
        keyboard: {
            description: '是否可以通过键盘操作'
        },
        readonly: {
            description: '只读模式'
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
