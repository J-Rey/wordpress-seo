/* eslint-disable no-unused-vars */
import initBlockEditorIntegration from "./initializers/block-editor-integration";
import BlockEditorData from "./analysis/block-editor-data";

window.yoast = window.yoast || {};
window.yoast.initEditorIntegration = initBlockEditorIntegration;
window.yoast.EditorData = BlockEditorData;
/* eslint-enable no-unused-vars */
