/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/static-module/module.scss":
/*!**************************************************!*\
  !*** ./src/components/static-module/module.scss ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/components/static-module/module.scss?");

/***/ }),

/***/ "./src/components/static-module/style.scss":
/*!*************************************************!*\
  !*** ./src/components/static-module/style.scss ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/components/static-module/style.scss?");

/***/ }),

/***/ "./src/components/static-module/custom-css.ts":
/*!****************************************************!*\
  !*** ./src/components/static-module/custom-css.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   cssFields: () => (/* binding */ cssFields)\n/* harmony export */ });\n/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ \"@wordpress/i18n\");\n/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _module_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module.json */ \"./src/components/static-module/module.json\");\nvar __assign = (undefined && undefined.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\n// WordPress dependencies.\n\n\nvar customCssFields = _module_json__WEBPACK_IMPORTED_MODULE_1__.customCssFields;\ncustomCssFields.contentContainer.label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Container', 'cg-divi5-modules');\ncustomCssFields.title.label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title', 'cg-divi5-modules');\ncustomCssFields.summary.label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Summary', 'cg-divi5-modules');\ncustomCssFields.content.label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content', 'cg-divi5-modules');\ncustomCssFields.image.label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image', 'cg-divi5-modules');\nvar cssFields = __assign({}, customCssFields);\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/components/static-module/custom-css.ts?");

/***/ }),

/***/ "./src/components/static-module/edit.tsx":
/*!***********************************************!*\
  !*** ./src/components/static-module/edit.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   StaticModuleEdit: () => (/* binding */ StaticModuleEdit)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _divi_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @divi/module */ \"@divi/module\");\n/* harmony import */ var _divi_module__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_divi_module__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles */ \"./src/components/static-module/styles.tsx\");\n/* harmony import */ var _module_classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./module-classnames */ \"./src/components/static-module/module-classnames.ts\");\n/* harmony import */ var _module_script_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./module-script-data */ \"./src/components/static-module/module-script-data.tsx\");\n// External Dependencies.\n\n// Divi Dependencies.\n\n\n\n\n/**\n * Static Module edit component of visual builder.\n *\n * @since ??\n *\n * @param {StaticModuleEditProps} props React component props.\n *\n * @returns {ReactElement}\n */\nvar StaticModuleEdit = function (props) {\n    var attrs = props.attrs, elements = props.elements, id = props.id, name = props.name;\n    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_divi_module__WEBPACK_IMPORTED_MODULE_1__.ModuleContainer, { attrs: attrs, elements: elements, id: id, name: name, stylesComponent: _styles__WEBPACK_IMPORTED_MODULE_2__.ModuleStyles, classnamesFunction: _module_classnames__WEBPACK_IMPORTED_MODULE_3__.moduleClassnames, scriptDataComponent: _module_script_data__WEBPACK_IMPORTED_MODULE_4__.ModuleScriptData },\n        elements.styleComponents({\n            attrName: 'module',\n        }),\n        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", { className: \"cg_static_module__inner\" },\n            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", { className: \"cg_static_module__image\" },\n                elements.render({\n                    attrName: 'badge',\n                }),\n                elements.render({\n                    attrName: 'image',\n                })),\n            react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", { className: \"cg_static_module__content-container\" },\n                elements.render({\n                    attrName: 'title',\n                }),\n                elements.render({\n                    attrName: 'summary',\n                }),\n                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", { className: \"cg_static_module__content\" }, elements.render({\n                    attrName: 'content',\n                }))))));\n};\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/components/static-module/edit.tsx?");

/***/ }),

/***/ "./src/components/static-module/index.ts":
/*!***********************************************!*\
  !*** ./src/components/static-module/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   staticModule: () => (/* binding */ staticModule)\n/* harmony export */ });\n/* harmony import */ var _module_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module.json */ \"./src/components/static-module/module.json\");\n/* harmony import */ var _module_default_render_attributes_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module-default-render-attributes.json */ \"./src/components/static-module/module-default-render-attributes.json\");\n/* harmony import */ var _module_default_printed_style_attributes_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./module-default-printed-style-attributes.json */ \"./src/components/static-module/module-default-printed-style-attributes.json\");\n/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ \"./src/components/static-module/edit.tsx\");\n/* harmony import */ var _placeholder_content__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./placeholder-content */ \"./src/components/static-module/placeholder-content.ts\");\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ \"./src/components/static-module/style.scss\");\n/* harmony import */ var _module_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./module.scss */ \"./src/components/static-module/module.scss\");\n// Local dependencies.\n\n\n\n\n\n// Styles.\n\n\nvar staticModule = {\n    // Imported json has no inferred type hence type-cast is necessary.\n    metadata: _module_json__WEBPACK_IMPORTED_MODULE_0__,\n    defaultAttrs: _module_default_render_attributes_json__WEBPACK_IMPORTED_MODULE_1__,\n    defaultPrintedStyleAttrs: _module_default_printed_style_attributes_json__WEBPACK_IMPORTED_MODULE_2__,\n    placeholderContent: _placeholder_content__WEBPACK_IMPORTED_MODULE_4__.placeholderContent,\n    renderers: {\n        edit: _edit__WEBPACK_IMPORTED_MODULE_3__.StaticModuleEdit,\n    },\n};\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/components/static-module/index.ts?");

/***/ }),

/***/ "./src/components/static-module/module-classnames.ts":
/*!***********************************************************!*\
  !*** ./src/components/static-module/module-classnames.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   moduleClassnames: () => (/* binding */ moduleClassnames)\n/* harmony export */ });\n/* harmony import */ var _divi_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @divi/module */ \"@divi/module\");\n/* harmony import */ var _divi_module__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_divi_module__WEBPACK_IMPORTED_MODULE_0__);\n\n/**\n * Module classnames function for Static Module.\n *\n * @since ??\n *\n * @param {ModuleClassnamesParams<StaticModuleAttrs>} param0 Function parameters.\n */\nvar moduleClassnames = function (_a) {\n    var _b, _c;\n    var classnamesInstance = _a.classnamesInstance, attrs = _a.attrs;\n    // Text Options.\n    classnamesInstance.add((0,_divi_module__WEBPACK_IMPORTED_MODULE_0__.textOptionsClassnames)((_c = (_b = attrs === null || attrs === void 0 ? void 0 : attrs.module) === null || _b === void 0 ? void 0 : _b.advanced) === null || _c === void 0 ? void 0 : _c.text));\n};\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/components/static-module/module-classnames.ts?");

/***/ }),

/***/ "./src/components/static-module/module-script-data.tsx":
/*!*************************************************************!*\
  !*** ./src/components/static-module/module-script-data.tsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ModuleScriptData: () => (/* binding */ ModuleScriptData)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\n/**\n * Static module's script data component.\n *\n * @since ??\n *\n * @param {ModuleScriptDataProps<StaticModuleAttrs>} props React component props.\n *\n * @returns {ReactElement}\n */\nvar ModuleScriptData = function (_a) {\n    var elements = _a.elements;\n    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, elements.scriptData({\n        attrName: 'module',\n    })));\n};\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/components/static-module/module-script-data.tsx?");

/***/ }),

/***/ "./src/components/static-module/placeholder-content.ts":
/*!*************************************************************!*\
  !*** ./src/components/static-module/placeholder-content.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   placeholderContent: () => (/* binding */ placeholderContent)\n/* harmony export */ });\n/* harmony import */ var _divi_module_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @divi/module-utils */ \"@divi/module-utils\");\n/* harmony import */ var _divi_module_utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_divi_module_utils__WEBPACK_IMPORTED_MODULE_0__);\n// Divi dependencies.\n\nvar placeholderContent = {\n    title: {\n        innerContent: {\n            desktop: {\n                value: _divi_module_utils__WEBPACK_IMPORTED_MODULE_0__.placeholderContent.title,\n            },\n        }\n    },\n    content: {\n        innerContent: {\n            desktop: {\n                value: _divi_module_utils__WEBPACK_IMPORTED_MODULE_0__.placeholderContent.body,\n            },\n        }\n    },\n    image: {\n        innerContent: {\n            desktop: {\n                value: {\n                    src: _divi_module_utils__WEBPACK_IMPORTED_MODULE_0__.placeholderContent.image.landscape,\n                },\n            },\n        },\n    },\n};\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/components/static-module/placeholder-content.ts?");

/***/ }),

/***/ "./src/components/static-module/styles.tsx":
/*!*************************************************!*\
  !*** ./src/components/static-module/styles.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ModuleStyles: () => (/* binding */ ModuleStyles)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _divi_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @divi/module */ \"@divi/module\");\n/* harmony import */ var _divi_module__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_divi_module__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _custom_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./custom-css */ \"./src/components/static-module/custom-css.ts\");\n// External dependencies.\n\n// Divi dependencies.\n\n\n/**\n * Static Module's style components.\n *\n * @since ??\n */\nvar ModuleStyles = function (_a) {\n    var _b, _c, _d, _e;\n    var attrs = _a.attrs, elements = _a.elements, settings = _a.settings, orderClass = _a.orderClass, mode = _a.mode, state = _a.state, noStyleTag = _a.noStyleTag;\n    var textSelector = \"\".concat(orderClass, \" .cg_static_module__content-container\");\n    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_divi_module__WEBPACK_IMPORTED_MODULE_1__.StyleContainer, { mode: mode, state: state, noStyleTag: noStyleTag },\n        elements.style({\n            attrName: 'module',\n            styleProps: {\n                disabledOn: {\n                    disabledModuleVisibility: settings === null || settings === void 0 ? void 0 : settings.disabledModuleVisibility,\n                },\n                advancedStyles: [\n                    {\n                        componentName: \"divi/text\",\n                        props: {\n                            selector: textSelector,\n                            attr: (_c = (_b = attrs === null || attrs === void 0 ? void 0 : attrs.module) === null || _b === void 0 ? void 0 : _b.advanced) === null || _c === void 0 ? void 0 : _c.text,\n                        }\n                    }\n                ]\n            },\n        }),\n        elements.style({\n            attrName: 'image',\n        }),\n        elements.style({\n            attrName: 'title',\n        }),\n        elements.style({\n            attrName: 'summary',\n        }),\n        elements.style({\n            attrName: 'content',\n        }),\n        elements.style({\n            attrName: 'badge',\n            styleProps: {\n                advancedStyles: [\n                    {\n                        componentName: 'divi/common',\n                        props: {\n                            attr: (_e = (_d = attrs === null || attrs === void 0 ? void 0 : attrs.badge) === null || _d === void 0 ? void 0 : _d.decoration) === null || _e === void 0 ? void 0 : _e.color,\n                            property: 'color',\n                        },\n                    },\n                ],\n            },\n        }),\n        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_divi_module__WEBPACK_IMPORTED_MODULE_1__.CssStyle, { selector: orderClass, attr: attrs.css, cssFields: _custom_css__WEBPACK_IMPORTED_MODULE_2__.cssFields })));\n};\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/components/static-module/styles.tsx?");

/***/ }),

/***/ "./src/icons/index.ts":
/*!****************************!*\
  !*** ./src/icons/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   moduleStatic: () => (/* reexport module object */ _module_static__WEBPACK_IMPORTED_MODULE_0__)\n/* harmony export */ });\n/* harmony import */ var _module_static__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module-static */ \"./src/icons/module-static/index.tsx\");\n\n\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/icons/index.ts?");

/***/ }),

/***/ "./src/icons/module-static/index.tsx":
/*!*******************************************!*\
  !*** ./src/icons/module-static/index.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   component: () => (/* binding */ component),\n/* harmony export */   name: () => (/* binding */ name),\n/* harmony export */   viewBox: () => (/* binding */ viewBox)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\n// Icon data.\nvar name = 'cg/module-static'; // Unique name.\nvar viewBox = '0 96 960 960'; // You will need to adjust this to match your SVG.\nvar component = function () { return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"path\", { d: \"M114 838V710h491v128H114Zm0-198V512h733v128H114Zm0-198V314h733v128H114Z\" })); }; // Your SVG path. without the svg tag.\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/icons/module-static/index.tsx?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ \"@wordpress/hooks\");\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _divi_module_library__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @divi/module-library */ \"@divi/module-library\");\n/* harmony import */ var _divi_module_library__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_divi_module_library__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_static_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/static-module */ \"./src/components/static-module/index.ts\");\n/* harmony import */ var _module_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./module-icons */ \"./src/module-icons.ts\");\nvar _a, _b;\n\n\n\n\n\n// Register modules.\nvar registerModules = function () {\n    (0,_divi_module_library__WEBPACK_IMPORTED_MODULE_2__.registerModule)(_components_static_module__WEBPACK_IMPORTED_MODULE_3__.staticModule.metadata, (0,lodash__WEBPACK_IMPORTED_MODULE_0__.omit)(_components_static_module__WEBPACK_IMPORTED_MODULE_3__.staticModule, 'metadata'));\n};\n(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addAction)('divi.moduleLibrary.registerModuleLibraryStore.after', 'cgDivi5Modules', registerModules);\n// Fallback in case the hook has already fired when this bundle loads\nif (typeof window !== 'undefined' && ((_b = (_a = window.divi) === null || _a === void 0 ? void 0 : _a.moduleLibrary) === null || _b === void 0 ? void 0 : _b.registerModule)) {\n    registerModules();\n}\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/index.ts?");

/***/ }),

/***/ "./src/module-icons.ts":
/*!*****************************!*\
  !*** ./src/module-icons.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ \"@wordpress/hooks\");\n/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./icons */ \"./src/icons/index.ts\");\nvar __assign = (undefined && undefined.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\n\n\n// Add module icons to the icon library.\n(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('divi.iconLibrary.icon.map', 'cgDivi5Modules', function (icons) {\n    var _a;\n    return __assign(__assign({}, icons), (_a = {}, _a[_icons__WEBPACK_IMPORTED_MODULE_1__.moduleStatic.name] = _icons__WEBPACK_IMPORTED_MODULE_1__.moduleStatic, _a));\n});\n\n\n//# sourceURL=webpack://cg-divi5-modules/./src/module-icons.ts?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = lodash;

/***/ }),

/***/ "@divi/module":
/*!**********************************!*\
  !*** external ["divi","module"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = divi.module;

/***/ }),

/***/ "@divi/module-library":
/*!*****************************************!*\
  !*** external ["divi","moduleLibrary"] ***!
  \*****************************************/
/***/ ((module) => {

module.exports = divi.moduleLibrary;

/***/ }),

/***/ "@divi/module-utils":
/*!***************************************!*\
  !*** external ["divi","moduleUtils"] ***!
  \***************************************/
/***/ ((module) => {

module.exports = divi.moduleUtils;

/***/ }),

/***/ "react":
/*!***********************************!*\
  !*** external ["vendor","React"] ***!
  \***********************************/
/***/ ((module) => {

module.exports = vendor.React;

/***/ }),

/***/ "@wordpress/hooks":
/*!****************************************!*\
  !*** external ["vendor","wp","hooks"] ***!
  \****************************************/
/***/ ((module) => {

module.exports = vendor.wp.hooks;

/***/ }),

/***/ "@wordpress/i18n":
/*!***************************************!*\
  !*** external ["vendor","wp","i18n"] ***!
  \***************************************/
/***/ ((module) => {

module.exports = vendor.wp.i18n;

/***/ }),

/***/ "./src/components/static-module/module-default-printed-style-attributes.json":
/*!***********************************************************************************!*\
  !*** ./src/components/static-module/module-default-printed-style-attributes.json ***!
  \***********************************************************************************/
/***/ ((module) => {

eval("module.exports = /*#__PURE__*/JSON.parse('{\"_comment\":\"Default printed style attributes for static module\",\"module\":{\"decoration\":{\"background\":{\"desktop\":{\"value\":{\"color\":\"#ecf4f7\"}}}}},\"title\":{\"decoration\":{\"font\":{\"font\":{\"desktop\":{\"value\":{\"size\":\"26px\",\"lineHeight\":\"1em\",\"weight\":\"500\"}}}}}}}');\n\n//# sourceURL=webpack://cg-divi5-modules/./src/components/static-module/module-default-printed-style-attributes.json?");

/***/ }),

/***/ "./src/components/static-module/module-default-render-attributes.json":
/*!****************************************************************************!*\
  !*** ./src/components/static-module/module-default-render-attributes.json ***!
  \****************************************************************************/
/***/ ((module) => {

eval("module.exports = /*#__PURE__*/JSON.parse('{\"_comment\":\"Testing separated default render attributes for 3rd party modules\",\"module\":{\"meta\":{\"adminLabel\":{\"desktop\":{\"value\":\"Static Module\"}}},\"advanced\":{\"text\":{\"text\":{\"desktop\":{\"value\":{\"color\":\"light\"}}}}},\"decoration\":{\"spacing\":{\"desktop\":{\"value\":{\"padding\":{\"top\":\"30px\",\"right\":\"30px\",\"bottom\":\"30px\",\"left\":\"30px\"}}}}}},\"title\":{\"decoration\":{\"font\":{\"font\":{\"desktop\":{\"value\":{\"headingLevel\":\"h2\"}}}}}},\"summary\":{\"innerContent\":{\"desktop\":{\"value\":\"This is a brief summary that provides an overview of the content below. It can span multiple lines to give readers a comprehensive understanding of what to expect in the main content section.\"}}},\"badge\":{\"innerContent\":{\"desktop\":{\"value\":\"New\"}},\"decoration\":{\"color\":{\"desktop\":{\"value\":\"#ffffff\"}}}}}');\n\n//# sourceURL=webpack://cg-divi5-modules/./src/components/static-module/module-default-render-attributes.json?");

/***/ }),

/***/ "./src/components/static-module/module.json":
/*!**************************************************!*\
  !*** ./src/components/static-module/module.json ***!
  \**************************************************/
/***/ ((module) => {

eval("module.exports = /*#__PURE__*/JSON.parse('{\"name\":\"cg/static-module\",\"d4Shortcode\":\"\",\"title\":\"Static Module\",\"titles\":\"Static Modules\",\"moduleIcon\":\"cg/module-static\",\"moduleClassName\":\"cg_static_module\",\"moduleOrderClassName\":\"cg_static_module\",\"category\":\"module\",\"attributes\":{\"module\":{\"type\":\"object\",\"selector\":\"{{selector}}\",\"styleProps\":{\"border\":{\"important\":true}},\"settings\":{\"meta\":{\"adminLabel\":{}},\"advanced\":{\"link\":{},\"text\":{},\"htmlAttributes\":{}},\"decoration\":{\"attributes\":{},\"background\":{},\"sizing\":{},\"spacing\":{},\"border\":{},\"boxShadow\":{},\"filters\":{},\"transform\":{},\"animation\":{},\"overflow\":{},\"disabledOn\":{},\"transition\":{},\"position\":{},\"zIndex\":{},\"scroll\":{},\"sticky\":{}}}},\"image\":{\"type\":\"object\",\"selector\":\"{{selector}} .cg_static_module__image img\",\"elementType\":\"imageLink\",\"supportsCustomAttributes\":true,\"styleProps\":{\"border\":{\"important\":true}},\"settings\":{\"innerContent\":{\"groupType\":\"group-items\",\"items\":{\"src\":{\"groupSlug\":\"contentImage\",\"attrName\":\"image.innerContent\",\"subName\":\"src\",\"priority\":10,\"render\":true,\"label\":\"Image\",\"description\":\"Upload an Image\",\"features\":{\"sticky\":false,\"dynamicContent\":false},\"component\":{\"name\":\"divi/upload\",\"type\":\"field\",\"props\":{\"syncImageData\":{\"src\":true,\"id\":true,\"alt\":true,\"titleText\":true}}}}}},\"decoration\":{\"attributes\":{},\"border\":{\"groupType\":\"group-item\",\"item\":{\"groupSlug\":\"designImage\",\"priority\":10,\"render\":true,\"component\":{\"type\":\"group\",\"name\":\"divi/border\",\"props\":{\"grouped\":false}}}},\"spacing\":{\"groupType\":\"group-item\",\"item\":{\"groupSlug\":\"designImage\",\"priority\":20,\"render\":true,\"component\":{\"type\":\"group\",\"name\":\"divi/spacing\",\"props\":{\"grouped\":false}}}},\"boxShadow\":{\"groupType\":\"group-item\",\"item\":{\"groupSlug\":\"designImage\",\"priority\":30,\"render\":true,\"component\":{\"type\":\"group\",\"name\":\"divi/box-shadow\",\"props\":{\"grouped\":false}}}},\"filters\":{\"groupType\":\"group-item\",\"item\":{\"groupSlug\":\"designImage\",\"priority\":40,\"render\":true,\"component\":{\"type\":\"group\",\"name\":\"divi/filters\",\"props\":{\"grouped\":false}}}}}}},\"title\":{\"type\":\"object\",\"selector\":\"{{selector}} .cg_static_module__title\",\"styleProps\":{\"font\":{\"important\":{\"font\":{\"desktop\":{\"value\":{\"color\":true}}}}}},\"settings\":{\"innerContent\":{\"groupType\":\"group-item\",\"item\":{\"groupName\":\"mainContent\",\"priority\":10,\"render\":true,\"attrName\":\"title.innerContent\",\"label\":\"Title\",\"description\":\"Input your value to action title here.\",\"features\":{\"sticky\":false,\"dynamicContent\":false},\"component\":{\"name\":\"divi/text\",\"type\":\"field\"}}},\"decoration\":{\"font\":{\"priority\":10,\"component\":{\"props\":{\"groupLabel\":\"Title Text\",\"fieldLabel\":\"Title\",\"fields\":{\"headingLevel\":{\"render\":false}}}}}}},\"tagName\":\"h2\",\"attributes\":{\"class\":\"cg_static_module__title\"},\"inlineEditor\":\"plainText\",\"elementType\":\"heading\",\"childrenSanitizer\":\"et_core_esc_previously\"},\"summary\":{\"type\":\"object\",\"selector\":\"{{selector}} .cg_static_module__summary\",\"tagName\":\"div\",\"attributes\":{\"class\":\"cg_static_module__summary\"},\"inlineEditor\":\"plainText\",\"childrenSanitizer\":\"et_core_esc_previously\",\"settings\":{\"innerContent\":{\"groupType\":\"group-item\",\"item\":{\"groupName\":\"mainContent\",\"priority\":15,\"render\":true,\"attrName\":\"summary.innerContent\",\"label\":\"Summary\",\"description\":\"Input your summary text here. This field supports multiple lines.\",\"features\":{\"sticky\":false,\"dynamicContent\":false,\"responsive\":false},\"component\":{\"name\":\"divi/textarea\",\"type\":\"field\",\"props\":{\"showPlaceholderOnEmpty\":true}}}},\"decoration\":{\"font\":{\"priority\":10,\"component\":{\"props\":{\"groupLabel\":\"Summary Text\",\"fieldLabel\":\"Summary\"}}}}}},\"content\":{\"type\":\"object\",\"selector\":\"{{selector}} .cg_static_module__content\",\"tagName\":\"div\",\"attributes\":{\"class\":\"cg_static_module__content\"},\"inlineEditor\":\"richText\",\"childrenSanitizer\":\"et_core_esc_previously\",\"styleProps\":{\"bodyFont\":{\"selectors\":{\"desktop\":{\"value\":\"{{selector}} .cg_static_module__content\"}}}},\"settings\":{\"innerContent\":{\"groupType\":\"group-item\",\"item\":{\"groupName\":\"mainContent\",\"priority\":20,\"render\":true,\"attrName\":\"content.innerContent\",\"label\":\"Content\",\"description\":\"Input the main text content for your module here.\",\"features\":{\"sticky\":false,\"dynamicContent\":false},\"component\":{\"name\":\"divi/richtext\",\"type\":\"field\"}}},\"decoration\":{\"bodyFont\":{}}}},\"badge\":{\"type\":\"object\",\"selector\":\"{{selector}} .cg_static_module__badge\",\"tagName\":\"span\",\"attributes\":{\"class\":\"cg_static_module__badge\"},\"inlineEditor\":\"plainText\",\"childrenSanitizer\":\"et_core_esc_previously\",\"settings\":{\"innerContent\":{\"groupType\":\"group-item\",\"item\":{\"groupName\":\"mainContent\",\"priority\":5,\"render\":true,\"attrName\":\"badge.innerContent\",\"label\":\"Badge Text\",\"description\":\"Enter the badge text (e.g., \\\\\"New\\\\\", \\\\\"Featured\\\\\", \\\\\"Sale\\\\\").\",\"features\":{\"sticky\":false,\"dynamicContent\":false},\"component\":{\"name\":\"divi/text\",\"type\":\"field\"}}},\"decoration\":{\"color\":{\"groupType\":\"group-item\",\"item\":{\"groupSlug\":\"designBadge\",\"priority\":10,\"render\":true,\"label\":\"Badge Color\",\"description\":\"Here you can define a custom color for your badge text.\",\"features\":{\"sticky\":false},\"component\":{\"type\":\"field\",\"name\":\"divi/color-picker\"}}}}}}},\"customCssFields\":{\"contentContainer\":{\"subName\":\"contentContainer\",\"selectorSuffix\":\" .cg_static_module__content-container\"},\"title\":{\"subName\":\"title\",\"selector\":\"div{{selector}}\",\"selectorSuffix\":\" .cg_static_module__title\"},\"summary\":{\"subName\":\"summary\",\"selectorSuffix\":\" .cg_static_module__summary\"},\"content\":{\"subName\":\"content\",\"selectorSuffix\":\" .cg_static_module__content\"},\"image\":{\"subName\":\"image\",\"selectorSuffix\":\" .cg_static_module__image img\"},\"badge\":{\"subName\":\"badge\",\"selectorSuffix\":\" .cg_static_module__badge\"}},\"settings\":{\"content\":\"auto\",\"design\":\"auto\",\"advanced\":\"auto\",\"groups\":{\"contentImage\":{\"panel\":\"content\",\"priority\":20,\"groupName\":\"contentImage\",\"multiElements\":true,\"component\":{\"name\":\"divi/composite\",\"props\":{\"groupLabel\":\"Image\"}}},\"designImage\":{\"panel\":\"design\",\"priority\":10,\"groupName\":\"designImage\",\"multiElements\":true,\"component\":{\"name\":\"divi/composite\",\"props\":{\"groupLabel\":\"Image Style\"}}},\"designBadge\":{\"panel\":\"design\",\"priority\":20,\"groupName\":\"designBadge\",\"multiElements\":true,\"component\":{\"name\":\"divi/composite\",\"props\":{\"groupLabel\":\"Badge Style\"}}}}},\"mousetrap\":{\"inner\":{\"edited\":true}}}');\n\n//# sourceURL=webpack://cg-divi5-modules/./src/components/static-module/module.json?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"bundle": 0,
/******/ 			"./vb-bundle": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcg_divi5_modules"] = self["webpackChunkcg_divi5_modules"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./vb-bundle"], () => (__webpack_require__("./src/index.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;