import { Component, useChildSubEnv, useEffect, useState, xml } from '@odoo/owl';
import { Breakpoint, responsiveArray, responsiveObserve, ScreenMap } from '@/components/_util/responsiveObserve';
import classNames from 'classnames';
import { getPrefixCls, stylesToString } from '@/components/_util/utils';

type State = {
    className?: string;
    style?: string;
    screens: ScreenMap;
};

type Gutter = number | Partial<Record<Breakpoint, number>>;

type Props = {
    className?: string;
    gutter?: Gutter | [Gutter, Gutter];
    align?: 'top' | 'middle' | 'bottom';
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
}

export default class Row extends Component<Props> {
    static template: string = xml`
        <div t-att-class="state.className" t-att-style="state.style">
            <t t-slot="default"/>
        </div>
    `;

    state = useState<State>({
        className: undefined,
        style: undefined,
        screens: {
            xs: true,
            sm: true,
            md: true,
            lg: true,
            xl: true,
            xxl: true
        }
    });

    protected getGutter(screens: ScreenMap): [number, number] {
        const results: [number, number] = [0, 0];
        const { gutter = 0 } = this.props;
        const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, 0];
        normalizedGutter.forEach((g, index) => {
            if (typeof g === 'object') {
                for (let breakpoint of responsiveArray) {
                    if (screens[breakpoint] && g[breakpoint] !== undefined) {
                        results[index] = g[breakpoint] as number;
                        break;
                    }
                }
            } else {
                results[index] = g || 0;
            }
        });
        return results;
    }

    protected getStyle(screens: ScreenMap): Record<string, string> {
        const gutter = this.getGutter(screens);

        return {
            ...(gutter[0] > 0
                ? {
                    'margin-left': `${gutter[0] / -2}px`,
                    'margin-right': `${gutter[0] / -2}px`
                }
                : {}),
            ...(gutter[1] > 0
                ? {
                    'row-gap': `${gutter[1]}px`
                }
                : {})
        };
    }

    protected getClasses(): string {
        const { justify, align } = this.props;
        const prefixCls = getPrefixCls('row');
        return classNames(this.props.className, prefixCls, {
            [`${prefixCls}-${justify}`]: justify,
            [`${prefixCls}-${align}`]: align
        });
    }

    setup(): void {
        useChildSubEnv({ row: this });
        useEffect(() => {
            const token = responsiveObserve.subscribe((screens: ScreenMap) => {
                const currentGutter = this.props.gutter || 0;
                if (
                    (!Array.isArray(currentGutter) && typeof currentGutter === 'object') ||
                    (Array.isArray(currentGutter) &&
                        (typeof currentGutter[0] === 'object' || typeof currentGutter[1] === 'object'))
                ) {
                    this.state.screens = screens;
                }
                this.state.style = stylesToString(this.getStyle(screens)) || undefined;
                this.state.className = this.getClasses() || undefined;
            });

            return () => {
                responsiveObserve.unsubscribe(token);
            };
        }, () => []);
    }
}
