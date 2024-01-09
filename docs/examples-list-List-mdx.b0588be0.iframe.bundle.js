(self.webpackChunksd_design=self.webpackChunksd_design||[]).push([[248,638,341],{"./node_modules/@mdx-js/react/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{MDXContext:()=>MDXContext,MDXProvider:()=>MDXProvider,useMDXComponents:()=>useMDXComponents,withMDXComponents:()=>withMDXComponents});var react=__webpack_require__("./node_modules/react/index.js");const MDXContext=react.createContext({});function withMDXComponents(Component){return function boundMDXComponent(props){const allComponents=useMDXComponents(props.components);return react.createElement(Component,{...props,allComponents})}}function useMDXComponents(components){const contextComponents=react.useContext(MDXContext);return react.useMemo((()=>"function"==typeof components?components(contextComponents):{...contextComponents,...components}),[contextComponents,components])}const emptyObject={};function MDXProvider({components,children,disableParentContext}){let allComponents;return allComponents=disableParentContext?"function"==typeof components?components({}):components||emptyObject:useMDXComponents(components),react.createElement(MDXContext.Provider,{value:allComponents},children)}},"./node_modules/@storybook/addon-docs/dist/shims/mdx-react-shim.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var mod,__defProp=Object.defineProperty,__getOwnPropDesc=Object.getOwnPropertyDescriptor,__getOwnPropNames=Object.getOwnPropertyNames,__hasOwnProp=Object.prototype.hasOwnProperty,__copyProps=(to,from,except,desc)=>{if(from&&"object"==typeof from||"function"==typeof from)for(let key of __getOwnPropNames(from))!__hasOwnProp.call(to,key)&&key!==except&&__defProp(to,key,{get:()=>from[key],enumerable:!(desc=__getOwnPropDesc(from,key))||desc.enumerable});return to},mdx_react_shim_exports={};module.exports=(mod=mdx_react_shim_exports,__copyProps(__defProp({},"__esModule",{value:!0}),mod)),((target,mod,secondTarget)=>{__copyProps(target,mod,"default"),secondTarget&&__copyProps(secondTarget,mod,"default")})(mdx_react_shim_exports,__webpack_require__("./node_modules/@mdx-js/react/index.js"),module.exports)},"./stories/examples/list/List.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{List:()=>List_stories_List,__namedExportsOrder:()=>__namedExportsOrder,default:()=>List_stories});var StoryComp=__webpack_require__("./stories/_utils/StoryComp.tsx");var owl_es=__webpack_require__("./node_modules/@odoo/owl/dist/owl.es.js"),src=__webpack_require__("./src/index.ts"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),list=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./stories/examples/list/list.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(list.Z,options);list.Z&&list.Z.locals&&list.Z.locals;class ListRoot extends owl_es.wA{static components={List:src.aV,InputNumber:src.Rn};state=(0,owl_es.eJ)({bordered:!0,size:"middle",virtual:!1});compState=(0,owl_es.eJ)({list:Array.from({length:50},((_,i)=>({title:`title${i}`,content:`content${i}`}))),largeList:Array.from({length:50},((_,i)=>({title:`title${i}`,content:`content${i}`}))),turnLine:50});listRef={current:null};handleTurn(){this.listRef.current?.scrollTo(this.compState.turnLine)}onChangeTurnLine(value){this.compState.turnLine=value}onScroll(e,position){if("end"===position){const preIndex=this.compState.largeList.length;this.compState.largeList=this.compState.largeList.concat(Array.from({length:100},((_,i)=>({title:`title${preIndex+i}`,content:`content${preIndex+i}`}))))}}onRendered(){console.log(this.compState.largeList.length)}static template=owl_es.Ls`
<div class="list-container">
    <!-- 普通列表  -->
    <t t-if="!state.virtual">
        <List className="'list'" dataSource="compState.list" bordered="state.bordered" size="state.size">
            <t t-set-slot="header">
                header
            </t>
            <t t-set-slot="footer">
                footer
            </t>
            <t t-set-slot="item" t-slot-scope="scope">
                item-<t t-esc="scope.data.title"/>
            </t>
        </List>
    </t>
    <t t-else="">
        <!-- 虚拟滚动列表  -->
        <List ref="listRef" className="'list'" dataSource="compState.largeList" bordered="state.bordered" size="state.size" virtual="true" itemHeight="30" 
            onScroll.bind="onScroll" onRendered.bind="onRendered">
            <t t-set-slot="item" t-slot-scope="scope">
                <div>item-<t t-esc="scope.data.title"/></div>
            </t>
        </List>
        <div class="input-container">
            <button t-on-click="handleTurn">跳转到</button>
            <InputNumber value="compState.turnLine" onChange.bind="onChangeTurnLine">
                <t t-set-slot="addonAfter">行</t>
            </InputNumber>
        </div>
    </t>
</div>   
    `}const List_stories={title:"布局/List 列表",parameters:{layout:"centered"}},List_stories_List={parameters:{docs:{source:{code:'import { Component, useState, xml } from \'@odoo/owl\';\nimport { InputNumber, List } from \'../../../src\';\nimport \'./list.scss\';\nimport { Position } from \'../../../src/components/list/VirtualList\';\n\nexport default class ListRoot extends Component {\n    static components = { List, InputNumber };\n\n    state = useState<any>({\n        bordered: true,\n        size: \'middle\',\n        virtual: false\n    });\n\n    compState = useState({\n        list: Array.from({ length: 50 }, (_, i) => ({\n            title: `title${i}`,\n            content: `content${i}`\n        })),\n        largeList: Array.from({ length: 50 }, (_, i) => ({\n            title: `title${i}`,\n            content: `content${i}`\n        })),\n        turnLine: 50\n    });\n\n    listRef: any = { current: null };\n\n    /**\n     * 跳转到指定行\n     */\n    handleTurn() {\n        this.listRef.current?.scrollTo(this.compState.turnLine)\n    }\n\n    /**\n     * 修改跳转行回调\n     * @param value\n     */\n    onChangeTurnLine(value) {\n        this.compState.turnLine = value;\n    }\n\n    /**\n     * 虚拟滚动列表滚动回调\n     * @param e 事件Event\n     * @param position 滚动位置, start | end | mid\n     */\n    onScroll(e: MouseEvent, position: Position) {\n        if (position === \'end\') {\n            const preIndex = this.compState.largeList.length;\n            this.compState.largeList = this.compState.largeList.concat(\n                Array.from({ length: 100 }, (_, i) => ({\n                    title: `title${preIndex + i}`,\n                    content: `content${preIndex + i}`\n                }))\n            );\n        }\n    }\n\n    /**\n     * 虚拟滚动列表渲染完成回调\n     */\n    onRendered() {\n        console.log(this.compState.largeList.length);\n    }\n\n    static template = xml`\n<div class="list-container">\n    \x3c!-- 普通列表  --\x3e\n    <t t-if="!state.virtual">\n        <List className="\'list\'" dataSource="compState.list" bordered="state.bordered" size="state.size">\n            <t t-set-slot="header">\n                header\n            </t>\n            <t t-set-slot="footer">\n                footer\n            </t>\n            <t t-set-slot="item" t-slot-scope="scope">\n                item-<t t-esc="scope.data.title"/>\n            </t>\n        </List>\n    </t>\n    <t t-else="">\n        \x3c!-- 虚拟滚动列表  --\x3e\n        <List ref="listRef" className="\'list\'" dataSource="compState.largeList" bordered="state.bordered" size="state.size" virtual="true" itemHeight="30" \n            onScroll.bind="onScroll" onRendered.bind="onRendered">\n            <t t-set-slot="item" t-slot-scope="scope">\n                <div>item-<t t-esc="scope.data.title"/></div>\n            </t>\n        </List>\n        <div class="input-container">\n            <button t-on-click="handleTurn">跳转到</button>\n            <InputNumber value="compState.turnLine" onChange.bind="onChangeTurnLine">\n                <t t-set-slot="addonAfter">行</t>\n            </InputNumber>\n        </div>\n    </t>\n</div>   \n    `;\n}\n'}}},args:{bordered:!1,size:"middle",virtual:!1},argTypes:{bordered:{description:"边框模式"},size:{description:"尺寸",control:"select",options:["small","middle","large"]},virtual:{description:"开启虚拟滚动"}},render:(0,StoryComp.p)(ListRoot)};List_stories_List.parameters={...List_stories_List.parameters,docs:{...List_stories_List.parameters?.docs,source:{originalSource:"{\n  parameters: {\n    docs: {\n      source: {\n        code: ListCompRaw\n      }\n    }\n  },\n  args: {\n    bordered: false,\n    size: 'middle',\n    virtual: false\n  },\n  argTypes: {\n    bordered: {\n      description: '边框模式'\n    },\n    size: {\n      description: '尺寸',\n      control: 'select',\n      options: ['small', 'middle', 'large']\n    },\n    virtual: {\n      description: '开启虚拟滚动'\n    }\n  },\n  render: renderStoryComp(ListComp)\n}",...List_stories_List.parameters?.docs?.source}}};const __namedExportsOrder=["List"]},"./stories/examples/list/List.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_Users_admin_workspace_h5_sdDesign_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@storybook/addon-docs/dist/shims/mdx-react-shim.js"),_storybook_blocks__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs"),_List_stories__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./stories/examples/list/List.stories.ts");function _createMdxContent(props){const _components=Object.assign({h1:"h1",p:"p",h2:"h2",code:"code",h3:"h3"},(0,_Users_admin_workspace_h5_sdDesign_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_2__.useMDXComponents)(),props.components);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_blocks__WEBPACK_IMPORTED_MODULE_4__.h_,{of:_List_stories__WEBPACK_IMPORTED_MODULE_3__}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h1,{id:"list列表",children:"List列表"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"通用列表"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"概述",children:"概述"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"最基础的列表展示，可承载文字、列表、图片、段落，常用于后台数据展示页面。"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"滚动加载无限长列表",children:"滚动加载无限长列表"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"组件提供了虚拟列表功能，可实现滚动加载无限长列表，能够提高数据量大时候长列表的性能"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"基本使用",children:"基本使用"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_blocks__WEBPACK_IMPORTED_MODULE_4__.Xz,{of:_List_stories__WEBPACK_IMPORTED_MODULE_3__.List}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_blocks__WEBPACK_IMPORTED_MODULE_4__.ZX,{of:_List_stories__WEBPACK_IMPORTED_MODULE_3__.List}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"api",children:"API"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("table",{className:"api-table",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("thead",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th",{children:"参数"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th",{children:"说明"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th",{children:"类型"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th",{children:"默认值"})]})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tbody",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"className"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"类名class"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"string"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"-"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"itemClassName"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"渲染项的类名class"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"(item, index) => string"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"-"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"header"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"列表头部（开启虚拟滚动时会固定在首行，中间滑动）"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"slot"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"-"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"footer"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"列表底部（开启虚拟滚动时会固定在底部，中间滑动）"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"slot"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"-"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"item"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"自定义渲染列表项"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"slot"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"-"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"suffix"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"带有后缀图标的 inputNumber"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"slot"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"-"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"dataSource"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"数据源"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"any[]"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"[]"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"bordered"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"是否展示边框"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"boolean"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"-"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"size"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"控件大小"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("td",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"large"})," | ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"middle"})," | ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"small"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"middle"})})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"virtual"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"是否开启虚拟滚动"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"boolean"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"false"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"height"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"virtual为true时设置，列表的总高度，如果不设置则为组件容器去除header和footer高度的100%"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"number"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"-"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"itemHeight"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"virtual为true时必需设置，每一项的高度"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"number | (index: number, data: any) => number"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"-"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"onScroll"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"virtual为true时设置，滚动时触发"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"(event: MouseEvent, position: 'start' | 'end' | 'mid') => void"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"-"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"onRendered"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"virtual为true时设置，渲染完成时触发，滚动造成的渲染不会触发此函数"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"() => void"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"-"})]})]})]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"methods",children:"Methods"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("table",{className:"api-table",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("thead",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th",{children:"名称"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th",{children:"说明"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th",{children:"类型"})]})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("tbody",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"scrollTo"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:"滚动到指定行（仅限开启虚拟滚动时有用）"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"(index: number) => void"})})]})})]})]})}const __WEBPACK_DEFAULT_EXPORT__=function MDXContent(props={}){const{wrapper:MDXLayout}=Object.assign({},(0,_Users_admin_workspace_h5_sdDesign_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim__WEBPACK_IMPORTED_MODULE_2__.useMDXComponents)(),props.components);return MDXLayout?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(MDXLayout,Object.assign({},props,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_createMdxContent,props)})):_createMdxContent(props)}},"./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./stories/examples/list/list.scss":(module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".list-container{box-sizing:border-box;padding:20px 0;height:500px;overflow:hidden;width:700px;display:flex;flex-direction:column;gap:15px}.list-container .input-container{width:300px}.list-container .input-container button{border:1px solid #ccc;padding:4px 8px;border-radius:5px;margin-right:10px;color:white;background-color:rgba(var(--primary-color-base), 0.7)}.list-container .input-container button:hover{background-color:rgba(var(--primary-color-base), 1)}\n","",{version:3,sources:["webpack://./stories/examples/list/list.scss"],names:[],mappings:"AAAA,gBACE,qBAAsB,CACtB,cAAe,CACf,YAAa,CACb,eAAgB,CAChB,WAAY,CACZ,YAAa,CACb,qBAAsB,CACtB,QAAS,CARX,iCAWI,WAAY,CAXhB,wCAcM,qBAAsB,CACtB,eAAgB,CAChB,iBAAkB,CAClB,iBAAkB,CAClB,WAAY,CACZ,qDAAsD,CAnB5D,8CAsBQ,mDAAoD",sourcesContent:[".list-container {\n  box-sizing: border-box;\n  padding: 20px 0;\n  height: 500px;\n  overflow: hidden;\n  width: 700px;\n  display: flex;\n  flex-direction: column;\n  gap: 15px;\n\n  .input-container {\n    width: 300px;\n\n    button {\n      border: 1px solid #ccc;\n      padding: 4px 8px;\n      border-radius: 5px;\n      margin-right: 10px;\n      color: white;\n      background-color: rgba(var(--primary-color-base), 0.7);\n\n      &:hover {\n        background-color: rgba(var(--primary-color-base), 1);\n      }\n    }\n  }\n}\n"],sourceRoot:""}]);const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___},"./node_modules/memoizerific sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/memoizerific sync recursive",module.exports=webpackEmptyContext}}]);
//# sourceMappingURL=examples-list-List-mdx.b0588be0.iframe.bundle.js.map