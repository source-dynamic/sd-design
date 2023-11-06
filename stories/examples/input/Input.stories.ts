import { Meta, StoryObj } from '@storybook/react';
import { renderStoryComp } from '../../_utils/StoryComp';
// @ts-ignore
import InputCompRaw from '!!raw-loader!./Input';
import InputComp from './Input';
// @ts-ignore
import PasswordRaw from '!!raw-loader!./Password';
import PasswordComp from './Password';
// @ts-ignore
import TextAreaRaw from '!!raw-loader!./Textarea';
import TextAreaComp from './Textarea';
import { omit } from '../../../src/components/_util/utils';

const meta: Meta = {
    title: '数据录入/Input 输入框',
    parameters: {
        layout: 'centered'
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Input: Story = {
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
    },
    parameters: {
        docs: {
            source: {
                code: InputCompRaw
            }
        }
    },
    render: renderStoryComp(InputComp)
};

const passwordOmit = ['allowClear', 'showCount', 'prefix', 'suffix', 'addonBefore', 'addonAfter'];

export const Password: Story = {
    args: {
        ...omit(Input.args as Record<string, any>, passwordOmit),
        visible: false
    },
    argTypes: {
        ...omit(Input.argTypes as Record<string, any>, passwordOmit),
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

const textareaOmit = ['prefix', 'suffix', 'addonBefore', 'addonAfter'];

export const TextArea: Story = {
    args: {
        ...omit(Input.args as Record<string, any>, textareaOmit),
        autoSize: false
    },
    argTypes: {
        ...omit(Input.argTypes as Record<string, any>, textareaOmit),
        autoSize: {
            table: {
                category: 'TextArea'
            },
            description: '自适应内容高度',
            control: 'boolean'
        }
    },
    parameters: {
        docs: {
            source: {
                code: TextAreaRaw
            }
        }
    },
    render: renderStoryComp(TextAreaComp)
};
