var $ = require('node').all;
var Base = require('base');

var linechart = Base.extend({

    initializer: function() {
        var self = this;
        self.scrolling = false;
    },

    trim: function(str) {
        return str && str.replace(/(^\s*)|(\s*$)/g, "");
    },

    getTop: function(container, item) {
        return item.offsetTop - container.offsetTop - container.scrollTop;
    },

    getVisibleItems: function(container, items) {
        var self = this,
            container = container[0],
            conHeight = container.offsetHeight,
            visibleItems = [];

        items.each(function(item, index) {
            if (item[0].offsetHeight === 0) {
                return;
            }
            var top = self.getTop(container, item[0]);
            if (top >= -item[0].offsetHeight && top < conHeight) {
                visibleItems.push(item);
            }
        });
        return visibleItems;
    },

    arrow: function() {
        var proc = {
            paintArrow: function(ctx) {
                paintArrow(this, ctx);
            },

            paintLine: function(ctx) {
                paintLine(this, ctx);
            },

            set: function(sp, ep, size, sharp, lineWidth, color) {
                init(this, sp, ep, size, sharp, lineWidth, color);
            }
        };

        var init = function(a, sp, ep, size, sharp, lineWidth, color) {
            a.sp = sp; // 起点
            a.ep = ep; // 终点
            a.size = size; // 箭头大小
            a.color = color; // 箭头颜色
            a.sharp = sharp; // 箭头锐钝
            a.lineWidth = lineWidth; // 箭头线条宽度
        };

        var paintLine = function(a, ctx) {
            var sp = a.sp;
            var ep = a.ep;
            if (ctx == undefined) {
                return;
            }
            ctx.beginPath();
            ctx.moveTo(sp.x, sp.y);
            ctx.lineTo(ep.x, ep.y);
            ctx.strokeStyle = a.color;
            ctx.closePath();
        };

        var paintArrow = function(a, ctx) {
            var sp = a.sp;
            var ep = a.ep;
            if (ctx == undefined) {
                return;
            }
            var h = _calcH(a, sp, ep, ctx);
            ctx.beginPath();
            ctx.moveTo(ep.x, ep.y);
            ctx.lineTo(h.h1.x, h.h1.y);
            ctx.moveTo(ep.x, ep.y);
            ctx.lineTo(h.h2.x, h.h2.y);
            ctx.lineWidth = a.lineWidth;
            ctx.lineCap = "round";
            ctx.strokeStyle = a.color;
            ctx.stroke();
            ctx.closePath();
        };

        //计算头部坐标
        var _calcH = function(a, sp, ep, ctx) {
            var theta = Math.atan((ep.x - sp.x) / (ep.y - sp.y));
            var cep = _scrollXOY(ep, -theta);
            var csp = _scrollXOY(sp, -theta);
            var ch1 = {
                x: 0,
                y: 0
            };
            var ch2 = {
                x: 0,
                y: 0
            };
            var l = 250;
            if (cep.y - csp.y < 0) {
                l *= -1;
            }
            ch1.x = cep.x + l * (a.sharp || 0.025);
            ch1.y = cep.y - l * (a.size || 0.05);
            ch2.x = cep.x - l * (a.sharp || 0.025);
            ch2.y = cep.y - l * (a.size || 0.05);

            var h1 = _scrollXOY(ch1, theta);
            var h2 = _scrollXOY(ch2, theta);
            return {
                h1: h1,
                h2: h2
            };
        };

        //旋转坐标
        var _scrollXOY = function(p, theta) {
            return {
                x: p.x * Math.cos(theta) + p.y * Math.sin(theta),
                y: p.y * Math.cos(theta) - p.x * Math.sin(theta)
            };
        };

        return proc;
    },

    straightLine: function(ctx, l1, l2, l3, l4, arrows) {
        var self = this;

        ctx.beginPath();
        ctx.moveTo(l1[0], l1[1]);
        ctx.lineTo(l2[0], l2[1]);
        ctx.lineTo(l4[0], l4[1]);
        ctx.lineTo(l3[0], l3[1]);
        ctx.lineTo(l1[0], l1[1]);
        ctx.fillStyle = "rgba(211, 84, 0, 0.5)";
        ctx.fill();
        ctx.closePath(); //闭合路径 

        if (arrows) {
            arrows.color = arrows.color || color;
            self.renderArrow(ctx, (l1[0] + l3[0]) / 2, (l1[1] + l3[1]) / 2, (l2[0] + l4[0]) / 2, (l2[1] + l4[1]) / 2, arrows);
        }
    },

    curveLine: function(ctx, l1, l2, l3, l4, arrows, canvas_width, canvas_height) {
        var self = this;
        var curvature = [0.5, 0.5]; // 曲线曲度
        var color = "rgba(211, 84, 0, 0.5)";
        var control = curvature && [canvas_width * curvature[0], canvas_height * curvature[1]];

        ctx.beginPath();
        ctx.moveTo(l1[0], l1[1]);
        ctx.quadraticCurveTo(control[0], control[1], l2[0], l2[1]);
        ctx.lineTo(l4[0], l4[1]);
        ctx.quadraticCurveTo(control[0], control[1], l3[0], l3[1]);
        ctx.lineTo(l1[0], l1[1]);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath(); //闭合路径 

        if (arrows) {
            arrows.color = arrows.color || color;
            self.renderArrow(ctx, control[0], control[1], (l2[0] + l4[0]) / 2, (l2[1] + l4[1]) / 2, arrows);
        }
    },

    renderArrow: function(ctx, sp_x, sp_y, ep_x, ep_y, arrows) {
        var self = this;
        var arrow = new self.arrow();
        arrow.set({ //sp, ep, size, sharp, lineWidth, color
                x: sp_x,
                y: sp_y
            }, {
                x: ep_x,
                y: ep_y
            },
            arrows.size,
            arrows.sharp,
            arrows.lineWidth,
            arrows.color
        );
        arrow.paintArrow(ctx);
    },
    mergeDefault: function (ops) {
        var defaultColor = "rgba(211, 84, 0, 0.5)";
        var defaultOptions = {
            color: defaultColor, // 线条颜色
            size: 0.05,          // 线条粗细度
        };
        var defaultArrow = {    // 箭头样式的设置
            size: 0.05,         // 箭头长度
            sharp: 0.025,       // 箭头夹角
            lineWidth: 2,       // 箭头宽度
            color: defaultColor // 箭头颜色
        };
        if (ops.arrows) {
            ops.arrows = S.merge(defaultArrow, ops.arrows);
        }
        ops = S.merge(defaultOptions, ops);
        return ops;
    },

    add: function(ops) {
        var self = this;
        if (!ops.canvas || !ops.render) {
            throw "lack some options!";
        }
        ops = self.mergeDefault(ops);
        var color = ops.color,      // 线条颜色
            size = ops.size,        // 线条粗细度
            canvas = $(ops.canvas), // [必须] 画布
            arrows = ops.arrows,    // 箭头样式的设置
            scroll = ops.scroll,    // 是否开启滚动回调
            renderFn = ops.render;  // [必须] 绘制函数

        var ctx = canvas[0].getContext('2d'),
            beltValue = (1 - size) / 2,
            canvas_width = parseInt(canvas.css("width")),
            canvas_height = parseInt(canvas.css("height")),
            parentContainer = canvas.prev(),                  // 父容器
            childContainer = canvas.next(),                   // 子容器
            parentItems = parentContainer.children(),         // 父节点
            childItems = childContainer.children();           // 子节点


        var getEndPos = function(item, proportion) {
            if (!item) {
                return;
            }
            var height = parseInt($(item).css("height")),
                parent = $(item).parent()[0],
                x2 = canvas_width,
                y2 = item[0].offsetTop - childContainer[0].scrollTop - parent.offsetTop + height * (1 - (proportion || beltValue)),
                x4 = x2,
                y4 = item[0].offsetTop - childContainer[0].scrollTop - parent.offsetTop + height * (proportion || beltValue);
            return [
                [x2, y2],
                [x4, y4]
            ];
        };

        var bindEvent = function() {
            var isBind = parentContainer.attr("data-bind");
            if (!scroll || isBind) {
                return;
            }
            parentContainer.attr("data-bind", "1");
            parentContainer.on("scroll", function() {
                if (!self.scrolling) {
                    self.scrolling = true;
                    self.add(ops);
                    scroll.preOption && self.add(scroll.preOption);
                    scroll.preCallback && scroll.preCallback();
                    self.scrolling = false;
                }
            });

            if (scroll.endCallback) {
                childContainer.on("scroll", function() {
                    self.add(ops);
                    scroll.endCallback && scroll.endCallback();
                });
            }
        };

        ctx.clearRect(0, 0, canvas.width(), canvas.height());

        // L1 L2
        // L3 L4
        var L1 = [],
            L3 = [],
            childItemsWithId = {},
            visibleParentItems = self.getVisibleItems(parentContainer, parentItems),
            visibleChildItems = self.getVisibleItems(childContainer, childItems);

        S.each(visibleChildItems, function(item, index) {
            var id = $(item).attr("data-id");
            childItemsWithId[id] = item;
        });

        S.each(visibleParentItems, function(item, index) {
            var height = parseInt($(item).css("height")),
                parent = $(item).parent()[0],

                childIds = [],
                childPorportions = [],
                childData = $(item).attr("data-childIds").split(","),
                top = self.getTop(parentContainer[0], item[0]);

            S.each(childData, function(id_proportion_str, index) {
                var id_proportion = self.trim(id_proportion_str).split("|"),
                    id = self.trim(id_proportion[0]),
                    proportion = (1 - self.trim(id_proportion[1])) / 2,
                    x1 = 0,
                    y1 = item[0].offsetTop - parentContainer[0].scrollTop - (item.css("position") == "absolute" ? 0 : parent.offsetTop) + height * ((1 - (proportion || beltValue))),
                    x3 = x1,
                    y3 = item[0].offsetTop - parentContainer[0].scrollTop - (item.css("position") == "absolute" ? 0 : parent.offsetTop) + height * (proportion || beltValue);
                L1.push([x1, y1, id, proportion]);
                L3.push([x3, y3]);
            });
        });



        L1.forEach(function(item, index) {
            var l1_item = item,
                l3_item = L3[index],
                childId = item[2],
                childProportion = item[3],
                endPos = getEndPos(childItemsWithId[childId], childProportion);
            if (!endPos) {
                return;
            }
            var l2_item = endPos[0],
                l4_item = endPos[1];

            if (typeof renderFn == "string") {
                renderFn == "straight" && self.straightLine(ctx, l1_item, l2_item, l3_item, l4_item, arrows);
                renderFn == "curve"    && self.curveLine(ctx, l1_item, l2_item, l3_item, l4_item, arrows, canvas_width, canvas_height);
            } else if (typeof renderFn == "function") {
                renderFn.call(this, ctx, l1_item, l2_item, l3_item, l4_item, canvas_width, canvas_height)
            }
        });
        
        bindEvent();
    }
}, {
    ATTRS: {
        $target: {
            value: '',
            getter: function(v) {
                return $(v);
            }
        }
    }
});

module.exports = linechart;

