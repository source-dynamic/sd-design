import { Component, useState, xml } from '@odoo/owl';
import { SizeType } from '@/components/_util/type';
import { getPrefixCls } from '@/components/_util/utils';
import classNames from 'classnames';
import { getInputClassName } from '@/components/input/utils';
import closeFillSVG from '@/assets/close_fill.svg';

/** This basic props required for input and textarea. */
type IBasicProps = {
    className?: string;
    inputType: 'text' | 'input';
    direction?: 'ltr' | 'rtl';
    value?: any;
    allowClear?: boolean;
    disabled?: boolean;
    focused?: boolean;
    readOnly?: boolean;
    bordered: boolean;
    handleReset: (event: MouseEvent) => void;
    slots?: Record<string, any>;
}

/** This props only for input. */
type IClearableWrapperProps = {
    size?: SizeType;
    suffix?: any;
    prefix?: any;
} & IBasicProps;

type State = {
}

export default class ClearableLabeledWrapper extends Component<IClearableWrapperProps> {
    /**
     * 渲染清除按钮的模版
     */
    static clearTemplate: string = `
        <t t-set="clearIconClass" t-value="renderClearIconClass()"/>
        <span
          role="button"
          aria-label="close-circle"
          tabIndex="-1"
          t-on-click.stop="props.handleReset"
          t-att-class="clearIconClass"
        >
         ${closeFillSVG}
        </span> 
    `;

    /**
     * 渲染带有前缀或者后缀的input的模版
     */
    static innerTemplate: string = `
        <t t-if="!hasPrefixSuffix()">
            <t t-slot="default"/>
        </t>
        <t t-else="">
            <t t-set="labeledIconClass" t-value="renderLabeledIconClass()"/>
                        
            <span t-att-class="labeledIconClass.affixWrapperCls">
                <!--  prefix插槽  -->
                <t t-if="props.slots.prefix">
                    <span t-att-class="labeledIconClass.prefixClass">
                        <t t-slot="prefix"/>
                    </span>
                </t>
                
                <t t-slot="default" />
                
                <!--  suffix插槽  -->
                <t t-if="props.slots.suffix || props.allowClear">
                    <span t-att-class="labeledIconClass.suffixClass">
                        <t t-if="props.allowClear">
                            ${ClearableLabeledWrapper.clearTemplate}
                        </t>
                        <t t-slot="suffix"/>
                    </span>
                </t>
            </span>
        </t>
    `;

    static template: string = xml`
        <t>
            <t t-if="props.inputType === 'input'">
                <t t-if="!hasAddon()">
                    ${ClearableLabeledWrapper.innerTemplate}
                </t>
                
                <t t-else="">
                    <t t-set="inputWithLabelClass" t-value="renderInputWithLabelClass()"/>
                
                    <span t-att-class="inputWithLabelClass.mergedGroupClassName">
                        <span t-att-class="inputWithLabelClass.mergedWrapperClassName">
                            <!--  addonBefore插槽  -->
                            <t t-if="props.slots.addonBefore">
                                <span t-att-class="inputWithLabelClass.addonClassName">
                                    <t t-slot="addonBefore"/>
                                </span>
                            </t>
                            
                            ${ClearableLabeledWrapper.innerTemplate}
                            
                            <!--  addonAfter插槽  -->
                            <t t-if="props.slots.addonAfter">
                                <span t-att-class="inputWithLabelClass.addonClassName">
                                    <t t-slot="addonAfter"/>
                                </span>
                            </t>
                        </span>
                    </span>
                </t>
            </t>
            <t t-else="">
                <t t-if="!props.allowClear">
                    <t t-slot="default"/>
                </t>
                <t t-else="">
                    <t t-set="textAreaIconClass" t-value="renderTextAreaWithClearIconClass()"/>
                    
                    <span t-att-class="textAreaIconClass.affixWrapperCls">
                        <t t-slot="default"/>
                        ${ClearableLabeledWrapper.clearTemplate}
                    </span>
                </t>
            </t>
        </t>
    `;

    static defaultProps = {
        inputType: 'input'
    }

    state  = useState<State>({})

    /**
     * 判断是否有前置、后置部分
     */
    protected hasAddon(): boolean {
        const {slots} = this.props;
        return !!(slots?.addonBefore || slots?.addonAfter);
    }

    /**
     * 判断是否有前缀、后缀
     */
    protected hasPrefixSuffix(): boolean {
        const {slots} = this.props;
        return !!(slots?.prefix || slots?.suffix || this.props.allowClear);
    }

    /**
     * 清除图标的class
     */
    protected renderClearIconClass(): string | undefined {
        const {value, allowClear, disabled, readOnly, suffix} = this.props;
        if (!allowClear) {
            return;
        }
        const needClear = !disabled && !readOnly && value;
        const prefixCls = getPrefixCls('input');
        const className = `${prefixCls}-clear-icon`;
        return classNames(
            {
                [`${className}-hidden`]: !needClear,
                [`${className}-has-suffix`]: !!suffix,
            },
            className,
            getPrefixCls('icon')
        )
    }

    /**
     * innerTemplate主区域部分的class
     */
    protected renderLabeledIconClass(): {} {
        const {
            focused,
            value,
            size,
            suffix,
            disabled,
            allowClear,
            direction,
            readOnly,
            bordered,
        } = this.props;

        const prefixCls = getPrefixCls('input');

        const suffixClass = `${prefixCls}-suffix`;

        const prefixClass = `${prefixCls}-prefix`;

        const affixWrapperCls = classNames(`${prefixCls}-affix-wrapper`, {
            [`${prefixCls}-affix-wrapper-focused`]: focused,
            [`${prefixCls}-affix-wrapper-disabled`]: disabled,
            [`${prefixCls}-affix-wrapper-sm`]: size === 'small',
            [`${prefixCls}-affix-wrapper-lg`]: size === 'large',
            [`${prefixCls}-affix-wrapper-input-with-clear-btn`]: suffix && allowClear && value,
            [`${prefixCls}-affix-wrapper-rtl`]: direction === 'rtl',
            [`${prefixCls}-affix-wrapper-readonly`]: readOnly,
            [`${prefixCls}-affix-wrapper-borderless`]: !bordered,
        });

        const classes = getInputClassName(prefixCls, bordered, size, disabled);

        return {affixWrapperCls, prefixClass, suffixClass, classes}
    }

    /**
     * 外部区域的class
     */
    protected renderInputWithLabelClass(): {} {
        const {size, className, direction} = this.props;
        const prefixCls = getPrefixCls('input');
        const wrapperClassName = `${prefixCls}-group`;
        const addonClassName = `${wrapperClassName}-addon`;

        const mergedWrapperClassName = classNames(`${prefixCls}-wrapper`, wrapperClassName, {
            [`${wrapperClassName}-rtl`]: direction === 'rtl',
        });

        const mergedGroupClassName = classNames(
            `${prefixCls}-group-wrapper`,
            {
                [`${prefixCls}-group-wrapper-sm`]: size === 'small',
                [`${prefixCls}-group-wrapper-lg`]: size === 'large',
                [`${prefixCls}-group-wrapper-rtl`]: direction === 'rtl',
            },
            className,
        );

        return {addonClassName, mergedWrapperClassName, mergedGroupClassName};
    }

    /**
     * 文本域带有清除按钮的class
     */
    protected renderTextAreaWithClearIconClass(): {} {
        const {bordered, direction} = this.props;
        const prefixCls = getPrefixCls('input');

        const affixWrapperCls = classNames(
            `${prefixCls}-affix-wrapper`,
            `${prefixCls}-affix-wrapper-textarea-with-clear-btn`,
            {
                [`${prefixCls}-affix-wrapper-rtl`]: direction === 'rtl',
                [`${prefixCls}-affix-wrapper-borderless`]: !bordered,
            },
        );

        return {affixWrapperCls}
    }
}
