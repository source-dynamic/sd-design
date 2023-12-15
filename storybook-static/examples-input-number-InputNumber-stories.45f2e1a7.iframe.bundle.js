"use strict";(self.webpackChunksd_design=self.webpackChunksd_design||[]).push([[698],{"./stories/examples/input-number/InputNumber.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{InputNumber:()=>InputNumber_stories_InputNumber,__namedExportsOrder:()=>__namedExportsOrder,default:()=>InputNumber_stories});var StoryComp=__webpack_require__("./stories/_utils/StoryComp.tsx");var owl_es=__webpack_require__("./node_modules/@odoo/owl/dist/owl.es.js"),src=__webpack_require__("./src/index.ts");class InputRoot extends owl_es.wA{static components={InputNumber:src.Rn};state=(0,owl_es.eJ)({disabled:!1,size:"middle",step:1,bordered:!0,controls:!0,decimalSeparator:".",keyboard:!0,readonly:!1});static template=owl_es.Ls`
<div class="input-container">
    <InputNumber max="4" min="-20" placeholder="'InputNumber'" 
        disabled="state.disabled" 
        size="state.size" 
        step="state.step"
        controls="state.controls" 
        bordered="state.bordered"
        decimalSeparator="state.decimalSeparator"
        keyboard="state.keyboard"
        readonly="state.readonly"
    >
        <t t-set-slot="addonBefore">
            金额
        </t>
        <t t-set-slot="addonAfter">
            <div>整</div>
        </t>
        <t t-set-slot="prefix">
            <div>￥</div>
        </t>
        <t t-set-slot="suffix">
            <div>元</div>
        </t>
    </InputNumber>
</div>
    `}const InputNumber_stories={title:"数据录入/InputNumber 数字输入框",parameters:{layout:"centered"}},InputNumber_stories_InputNumber={args:{disabled:!1,size:"middle",bordered:!0,controls:!0,decimalSeparator:".",keyboard:!0,readonly:!1,step:1},argTypes:{disabled:{description:"禁用状态"},size:{description:"尺寸",control:"select",options:["small","middle","large"]},step:{description:"每次改变的步数，可以为小数",control:{type:"range",min:.1,max:2,step:.1}},bordered:{description:"是否有边框"},controls:{description:"是否显示控制按钮"},decimalSeparator:{description:"小数点"},keyboard:{description:"是否可以通过键盘操作"},readonly:{description:"只读模式"}},parameters:{docs:{source:{code:'import { Component, useState, xml } from \'@odoo/owl\';\nimport { InputNumber } from \'../../../src\';\n\nexport default class InputRoot extends Component {\n    static components = { InputNumber };\n\n    state = useState({\n        disabled: false,\n        size: \'middle\',\n        step: 1,\n        bordered: true,\n        controls: true,\n        decimalSeparator: \'.\',\n        keyboard: true,\n        readonly: false\n    });\n\n    static template = xml`\n<div class="input-container">\n    <InputNumber max="4" min="-20" placeholder="\'InputNumber\'" \n        disabled="state.disabled" \n        size="state.size" \n        step="state.step"\n        controls="state.controls" \n        bordered="state.bordered"\n        decimalSeparator="state.decimalSeparator"\n        keyboard="state.keyboard"\n        readonly="state.readonly"\n    >\n        <t t-set-slot="addonBefore">\n            金额\n        </t>\n        <t t-set-slot="addonAfter">\n            <div>整</div>\n        </t>\n        <t t-set-slot="prefix">\n            <div>￥</div>\n        </t>\n        <t t-set-slot="suffix">\n            <div>元</div>\n        </t>\n    </InputNumber>\n</div>\n    `\n}\n'}}},render:(0,StoryComp.p)(InputRoot)};InputNumber_stories_InputNumber.parameters={...InputNumber_stories_InputNumber.parameters,docs:{...InputNumber_stories_InputNumber.parameters?.docs,source:{originalSource:"{\n  args: {\n    disabled: false,\n    size: 'middle',\n    bordered: true,\n    controls: true,\n    decimalSeparator: '.',\n    keyboard: true,\n    readonly: false,\n    step: 1\n  },\n  argTypes: {\n    disabled: {\n      description: '禁用状态'\n    },\n    size: {\n      description: '尺寸',\n      control: 'select',\n      options: ['small', 'middle', 'large']\n    },\n    step: {\n      description: '每次改变的步数，可以为小数',\n      control: {\n        type: 'range',\n        min: 0.1,\n        max: 2,\n        step: 0.1\n      }\n    },\n    bordered: {\n      description: '是否有边框'\n    },\n    controls: {\n      description: '是否显示控制按钮'\n    },\n    decimalSeparator: {\n      description: '小数点'\n    },\n    keyboard: {\n      description: '是否可以通过键盘操作'\n    },\n    readonly: {\n      description: '只读模式'\n    }\n  },\n  parameters: {\n    docs: {\n      source: {\n        code: InputNumberCompRaw\n      }\n    }\n  },\n  render: renderStoryComp(InputNumberComp)\n}",...InputNumber_stories_InputNumber.parameters?.docs?.source}}};const __namedExportsOrder=["InputNumber"]}}]);
//# sourceMappingURL=examples-input-number-InputNumber-stories.45f2e1a7.iframe.bundle.js.map