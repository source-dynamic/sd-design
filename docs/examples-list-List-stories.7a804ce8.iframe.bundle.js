"use strict";(self.webpackChunksd_design=self.webpackChunksd_design||[]).push([[638],{"./stories/examples/list/List.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{List:()=>List_stories_List,__namedExportsOrder:()=>__namedExportsOrder,default:()=>List_stories});var StoryComp=__webpack_require__("./stories/_utils/StoryComp.tsx");var owl_es=__webpack_require__("./node_modules/@odoo/owl/dist/owl.es.js"),src=__webpack_require__("./src/index.ts"),injectStylesIntoStyleTag=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),injectStylesIntoStyleTag_default=__webpack_require__.n(injectStylesIntoStyleTag),styleDomAPI=__webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js"),styleDomAPI_default=__webpack_require__.n(styleDomAPI),insertBySelector=__webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js"),insertBySelector_default=__webpack_require__.n(insertBySelector),setAttributesWithoutAttributes=__webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"),setAttributesWithoutAttributes_default=__webpack_require__.n(setAttributesWithoutAttributes),insertStyleElement=__webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js"),insertStyleElement_default=__webpack_require__.n(insertStyleElement),styleTagTransform=__webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js"),styleTagTransform_default=__webpack_require__.n(styleTagTransform),list=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./stories/examples/list/list.scss"),options={};options.styleTagTransform=styleTagTransform_default(),options.setAttributes=setAttributesWithoutAttributes_default(),options.insert=insertBySelector_default().bind(null,"head"),options.domAPI=styleDomAPI_default(),options.insertStyleElement=insertStyleElement_default();injectStylesIntoStyleTag_default()(list.Z,options);list.Z&&list.Z.locals&&list.Z.locals;class ListRoot extends owl_es.wA{static components={List:src.aV,InputNumber:src.Rn};state=(0,owl_es.eJ)({bordered:!0,size:"middle",virtual:!1});compState=(0,owl_es.eJ)({list:Array.from({length:50},((_,i)=>({title:`title${i}`,content:`content${i}`}))),largeList:Array.from({length:100},((_,i)=>({title:`title${i}`,content:`content${i}`}))),turnLine:50});listRef={current:null};handleTurn(){this.listRef.current?.scrollTo(this.compState.turnLine)}onChangeTurnLine(value){this.compState.turnLine=value}onScroll(e,position){if("end"===position){const preIndex=this.compState.largeList.length;this.compState.largeList=this.compState.largeList.concat(Array.from({length:100},((_,i)=>({title:`title${preIndex+i}`,content:`content${preIndex+i}`}))))}}static template=owl_es.Ls`
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
        <List ref="listRef" className="'list'" dataSource="compState.largeList" bordered="state.bordered" size="state.size" virtual="true" itemHeight="30" onScroll.bind="onScroll">
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
    `}const List_stories={title:"布局/List 列表",parameters:{layout:"centered"}},List_stories_List={parameters:{docs:{source:{code:'import { Component, useState, xml } from \'@odoo/owl\';\nimport { InputNumber, List } from \'../../../src\';\nimport \'./list.scss\';\nimport { Position } from \'../../../src/components/list/VirtualList\';\n\nexport default class ListRoot extends Component {\n    static components = { List, InputNumber };\n\n    state = useState<any>({\n        bordered: true,\n        size: \'middle\',\n        virtual: false\n    });\n\n    compState = useState({\n        list: Array.from({ length: 50 }, (_, i) => ({\n            title: `title${i}`,\n            content: `content${i}`\n        })),\n        largeList: Array.from({ length: 100 }, (_, i) => ({\n            title: `title${i}`,\n            content: `content${i}`\n        })),\n        turnLine: 50\n    });\n\n    listRef: any = { current: null };\n\n    /**\n     * 跳转到指定行\n     */\n    handleTurn() {\n        this.listRef.current?.scrollTo(this.compState.turnLine)\n    }\n\n    /**\n     * 修改跳转行回调\n     * @param value\n     */\n    onChangeTurnLine(value) {\n        this.compState.turnLine = value;\n    }\n\n    /**\n     * 虚拟滚动列表滚动回调\n     * @param e 事件Event\n     * @param position 滚动位置, start | end | mid\n     */\n    onScroll(e: MouseEvent, position: Position) {\n        if (position === \'end\') {\n            const preIndex = this.compState.largeList.length;\n            this.compState.largeList = this.compState.largeList.concat(\n                Array.from({ length: 100 }, (_, i) => ({\n                    title: `title${preIndex + i}`,\n                    content: `content${preIndex + i}`\n                }))\n            );\n        }\n    }\n\n    static template = xml`\n<div class="list-container">\n    \x3c!-- 普通列表  --\x3e\n    <t t-if="!state.virtual">\n        <List className="\'list\'" dataSource="compState.list" bordered="state.bordered" size="state.size">\n            <t t-set-slot="header">\n                header\n            </t>\n            <t t-set-slot="footer">\n                footer\n            </t>\n            <t t-set-slot="item" t-slot-scope="scope">\n                item-<t t-esc="scope.data.title"/>\n            </t>\n        </List>\n    </t>\n    <t t-else="">\n        \x3c!-- 虚拟滚动列表  --\x3e\n        <List ref="listRef" className="\'list\'" dataSource="compState.largeList" bordered="state.bordered" size="state.size" virtual="true" itemHeight="30" onScroll.bind="onScroll">\n            <t t-set-slot="item" t-slot-scope="scope">\n                <div>item-<t t-esc="scope.data.title"/></div>\n            </t>\n        </List>\n        <div class="input-container">\n            <button t-on-click="handleTurn">跳转到</button>\n            <InputNumber value="compState.turnLine" onChange.bind="onChangeTurnLine">\n                <t t-set-slot="addonAfter">行</t>\n            </InputNumber>\n        </div>\n    </t>\n</div>   \n    `;\n}\n'}}},args:{bordered:!1,size:"middle",virtual:!1},argTypes:{bordered:{description:"边框模式"},size:{description:"尺寸",control:"select",options:["small","middle","large"]},virtual:{description:"开启虚拟滚动"}},render:(0,StoryComp.p)(ListRoot)};List_stories_List.parameters={...List_stories_List.parameters,docs:{...List_stories_List.parameters?.docs,source:{originalSource:"{\n  parameters: {\n    docs: {\n      source: {\n        code: ListCompRaw\n      }\n    }\n  },\n  args: {\n    bordered: false,\n    size: 'middle',\n    virtual: false\n  },\n  argTypes: {\n    bordered: {\n      description: '边框模式'\n    },\n    size: {\n      description: '尺寸',\n      control: 'select',\n      options: ['small', 'middle', 'large']\n    },\n    virtual: {\n      description: '开启虚拟滚动'\n    }\n  },\n  render: renderStoryComp(ListComp)\n}",...List_stories_List.parameters?.docs?.source}}};const __namedExportsOrder=["List"]},"./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./stories/examples/list/list.scss":(module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/css-loader/dist/runtime/sourceMaps.js"),_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__),_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js"),___CSS_LOADER_EXPORT___=__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());___CSS_LOADER_EXPORT___.push([module.id,".list-container{box-sizing:border-box;padding:20px 0;height:500px;overflow:hidden;width:700px;display:flex;flex-direction:column;gap:15px}.list-container .list{flex:1;overflow:auto}.list-container .input-container{width:300px}.list-container .input-container button{border:1px solid #ccc;padding:4px 8px;border-radius:5px;margin-right:10px;color:white;background-color:rgba(var(--primary-color-base), 0.7)}.list-container .input-container button:hover{background-color:rgba(var(--primary-color-base), 1)}\n","",{version:3,sources:["webpack://./stories/examples/list/list.scss"],names:[],mappings:"AAAA,gBACE,qBAAsB,CACtB,cAAe,CACf,YAAa,CACb,eAAgB,CAChB,WAAY,CACZ,YAAa,CACb,qBAAsB,CACtB,QAAS,CARX,sBAWI,MAAO,CACP,aAAc,CAZlB,iCAgBI,WAAY,CAhBhB,wCAmBM,qBAAsB,CACtB,eAAgB,CAChB,iBAAkB,CAClB,iBAAkB,CAClB,WAAY,CACZ,qDAAsD,CAxB5D,8CA2BQ,mDAAoD",sourcesContent:[".list-container {\n  box-sizing: border-box;\n  padding: 20px 0;\n  height: 500px;\n  overflow: hidden;\n  width: 700px;\n  display: flex;\n  flex-direction: column;\n  gap: 15px;\n\n  .list {\n    flex: 1;\n    overflow: auto;\n  }\n\n  .input-container {\n    width: 300px;\n\n    button {\n      border: 1px solid #ccc;\n      padding: 4px 8px;\n      border-radius: 5px;\n      margin-right: 10px;\n      color: white;\n      background-color: rgba(var(--primary-color-base), 0.7);\n\n      &:hover {\n        background-color: rgba(var(--primary-color-base), 1);\n      }\n    }\n  }\n}\n"],sourceRoot:""}]);const __WEBPACK_DEFAULT_EXPORT__=___CSS_LOADER_EXPORT___}}]);
//# sourceMappingURL=examples-list-List-stories.7a804ce8.iframe.bundle.js.map