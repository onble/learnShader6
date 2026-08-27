
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/__qc_index__.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}
require('./assets/script/CornerColorCtrl');
require('./assets/script/DissolveEffect');
require('./assets/script/Fake3D');
require('./assets/script/HologramLoading2D');
require('./assets/script/MagnifyingGlass');
require('./assets/script/ScratchCard');
require('./assets/script/SpineCtrl');
require('./assets/script/SpineRunner');
require('./assets/script/TextureBlend');
require('./assets/script/TriangleCounter');
require('./assets/script/testCamera');
require('./assets/script/testCamera2');

                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();