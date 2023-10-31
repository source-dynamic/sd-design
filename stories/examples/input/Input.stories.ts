import { Meta, StoryObj } from '@storybook/react';
import { renderStoryComp } from '../../_utils/StoryComp';
// @ts-ignore
import InputCompRaw from '!!raw-loader!./Input';
import InputComp from './Input';

const meta: Meta = {
    title: 'Examples/Input',
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    args: {
        allowClear: true,
        prefix: '￥',
        suffix: 'RMB',
        addonBefore: 'http://',
        addonAfter: '.com',
        size: 'middle'
    },
    argTypes: {
        size: {
            control: 'select',
            options: ['small', 'middle', 'large']
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
}
