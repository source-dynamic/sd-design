import { Meta, StoryObj } from '@storybook/react';
import { renderStoryComp } from '../../_utils/StoryComp';
// @ts-ignore
import InputCompRaw from '!!raw-loader!./Input';
import InputComp from './Input';
// @ts-ignore
import PasswordRaw from '!!raw-loader!./Password';
import PasswordComp from './Password';

const meta: Meta = {
    title: 'Examples/Input',
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    args: {
        allowClear: true,
        showCount: false,
        disabled: false,
        prefix: '￥',
        suffix: 'RMB',
        addonBefore: 'http://',
        addonAfter: '.com',
        size: 'middle',
        border: true
    },
    argTypes: {
        allowClear: {
            description: '是否允许清空内容'
        },
        disabled: {
            description: '禁用状态'
        },
        prefix: {
            description: '前缀'
        },
        suffix: {
            description: '后缀'
        },
        addonBefore: {
            description: '前置标签'
        },
        addonAfter: {
            description: '后置标签'
        },
        size: {
            description: '尺寸',
            control: 'select',
            options: ['small', 'middle', 'large']
        },
        border: {
            description: '无边框模式'
        }
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Input: Story = {
    parameters: {
        docs: {
            source: {
                code: InputCompRaw
            }
        }
    },
    render: renderStoryComp(InputComp)
};

export const Password: Story = {
    args: {
        ...Input.args,
        visible: false
    },
    argTypes: {
        ...Input.argTypes,
        visible: {
            table: {
                category: 'Password'
            },
            description: '显示密码',
            control: 'boolean'
        }
    },
    parameters: {
        docs: {
            source: {
                code: PasswordRaw
            }
        }
    },
    render: renderStoryComp(PasswordComp)
};
