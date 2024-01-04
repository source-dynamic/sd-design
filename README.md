# sd-design

![License](https://img.shields.io/github/license/source-dynamic/sd-design)
![GitHub stars](https://img.shields.io/github/stars/source-dynamic/sd-design)

## 简介

`sd-design` 是一个基于 OWL2.0+ 框架构建的 UI 组件库，旨在满足国内用户对 Odoo UI 的审美和使用需求。本项目启发于 [ant-design](https://github.com/ant-design/ant-design)，旨在提供更加美观和易用的 UI 组件，以优化用户体验。

## 依赖

- [owl](https://github.com/odoo/owl) version: 2.0+

## 特点

- **美观**: 参照 `ant-design`，`sd-design` 提供了符合国内用户审美的 UI 设计。
- **易用性**: 提供简洁明了的 API，使得组件易于集成和使用。
- **灵活性**: 组件可高度自定义，满足不同场景下的需求。
- 完全开源使用，不会有商业版等区别对待

## 前言

odoo 作为一个开源的 ERP 系统，其 UI 设计一直是国内用户诟病的地方。虽然 odoo 13 中的 UI 设计已经有了很大的改进，但是仍然有很多地方不够美观，也不够符合国内用户的使用习惯。因此，我们希望能够提供一个 UI 组件库，使得 odoo 的 UI 更加美观和易用。
odoo从采用owl到如今，owl逐渐完善。到了目前2.0+版本，使用起来已经和vue、react等前端框架比较接近，因此我们基于owl2.0+进行二次开发，提供一套符合国内用户审美和使用习惯的UI组件库。
ui库我们选择跟随owl版本而不是跟随odoo版本，是因为owl是odoo的前端框架，odoo每年都会发布新版本，但其内核使用的owl版本一般不会有大的变化，因此同一大版本的ui库理论上可以兼容多个odoo版本。版本兼容性比跟随odoo版本更好。

## 预览图

![sd-design](./assets/images/img.png)

## 组件列表

| 组件           | 功能         | 已实现 |
| -------------- | ------------ | ------ |
| Row            | 栅格行       | √      |
| Col            | 栅格列       | √      |
| Input          | 输入框       | √      |
| Input.Password | 密码框       | √      |
| Input.TextArea | 多行文本     | √      |
| InputNumber    | 数字输入组件 | √      |
| List           | 通用列表     | √      |
| VirtualList    | 通用虚拟列表 | √      |
| Select         | 下拉选择框   | √      |
| Checkbox       | 多选框       | √      |
| Checkbox.Group | 多选组       | √      |
| Switch         | 开关         | ×      |
| Radio          | 单选框       | ×      |
| Slider         | 滑动输入条   | ×      |



## DEMO

[在线DEMO及文档](https://source-dynamic.github.io/sd-design/)

## 快速开始

### 在Odoo中使用

> 需要odoo17及以上版本  

参考 [sd-design-addons](https://github.com/source-dynamic/sd-design-addons)



### 本地运行
```bash
yarn install

yarn run storybook
```

## 贡献

欢迎对 sd-design 提出宝贵意见或贡献代码。请遵循以下步骤进行贡献：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feat/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到远程分支 (`git push origin feat/AmazingFeature`)
5. 开启一个 Pull Request。

## 许可
该项目采用 MIT 许可证进行授权。查看 [LICENSE](./LICENSE) 获取更多信息。

## 附言

目前，`sd-design` 项目仍处于发展阶段，我们只提供了部分核心组件。我们计划未来逐步扩充和完善这个组件库，以更好地满足用户需求。由于目前团队规模较小，我们的更新和迭代速度可能不会很快，但我们致力于保持项目的持续发展和改进。
我们非常欢迎社区的任何建议、反馈或贡献。如果您对 `sd-design` 有任何建议或意见，欢迎通过提出 issue 来分享您的想法。同时，如果您希望加入到讨论中或对项目有更深入的了解，欢迎加入我们的微信群进行交流。
您的支持和理解对我们至关重要，这将帮助我们不断进步，使 `sd-design` 成为更优秀的 UI 组件库。

## 联系方式

如果您有任何问题或建议，请通过以下方式联系我们：

- 在仓库中提交issue
- 微信联系进群讨论：
  <div>
    <img src="./assets/images/IMG_3775.JPG" alt="sd-design" style="margin-top: 10px" width="200" height="260">
  </div>
