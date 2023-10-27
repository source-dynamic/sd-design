import { Meta, StoryObj } from '@storybook/react';
import { renderStoryComp } from '../../_utils/StoryComp';
// @ts-ignore
import GridCompRaw from '!!raw-loader!./Grid';
import GridComp from './Grid';
import './grid.scss';

const meta: Meta = {
    title: 'Examples/Grid',
    parameters: {
        layout: 'centered'
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Grid: Story = {
    parameters: {
        docs: {
            source: {
                code: GridCompRaw
            }
        }
    },
    args: {
        span1: 4,
        span2: 4,
        span3: 4,
        gutter: 0,
        offset: 0,
        justify: 'start',
        align: 'top',
        order: 0,
        flex: 2,
        wrap: true
    },
    argTypes: {
        span1: {
            description: '第一个col的span值',
            control: { type: 'range', min: 1, max: 24, step: 1 }
        },
        span2: {
            description: '第二个col的span值',
            control: { type: 'range', min: 1, max: 24, step: 1 }
        },
        span3: {
            description: '第三个col的span值',
            control: { type: 'range', min: 1, max: 24, step: 1 }
        },
        wrap: {
            description: '超出是否换行',
            control: 'boolean'
        },
        gutter: {
            description: 'col之间的间距',
            control: { type: 'range', min: 0, max: 20, step: 1 }
        },
        offset: {
            description: '列偏移量',
            control: { type: 'range', min: 0, max: 24, step: 1 }
        },
        justify: {
            description: '水平排列方式',
            control: 'select',
            options: ['start', 'end', 'center', 'space-around', 'space-between']
        },
        align: {
            description: '垂直排列方式',
            control: 'select',
            options: ['top', 'middle', 'bottom']
        },
        order: {
            description: '列顺序',
            control: { type: 'range', min: 0, max: 24, step: 1 }
        },
        flex: {
            table: {
                category: 'Flex'
            },
            description: 'Flex填充的其余列占比',
            control: { type: 'range', min: 0, max: 24, step: 1 }
        }
    },
    render: renderStoryComp(GridComp)
};
