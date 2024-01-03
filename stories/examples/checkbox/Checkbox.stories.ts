import { Meta, StoryObj } from '@storybook/react';
import { renderStoryComp } from '../../_utils/StoryComp';
// @ts-ignore
import CheckboxCompRaw from '!!raw-loader!./Checkbox';
import CheckboxComp from './Checkbox';

const meta: Meta = {
    title: '数据录入/Checkbox 多选框',
    parameters: {
        layout: 'auto'
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Checkbox: Story = {
    args: {
        disabled: false,
        indeterminate: false
    },
    argTypes: {
        disabled: {
            description: '禁用状态'
        },
        indeterminate: {
            description: '半选状态'
        }
    },
    parameters: {
        docs: {
            source: {
                code: CheckboxCompRaw
            }
        }
    },
    render: renderStoryComp(CheckboxComp)
};
