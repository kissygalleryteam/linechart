## 综述

面对一些数据可视化的图，我们经常会需要用到连接两（多）列数据的关系图，例如：

* **uData的来源去向图**：
![udata](http://gtms02.alicdn.com/tps/i2/TB1MdQYHpXXXXXOXXXXVyyl3XXX-1003-505.png)
* **A+的多维分析图**：![A+](http://gtms03.alicdn.com/tps/i3/TB1tRcQHpXXXXXCXVXX2jihVXXX-519-541.png)

该组件整理出他们的共性，方便开发者调用，利用更加语义化的方式来实现线条的连接关系与线条绘制的可扩展性。


## 初始化组件
        
    S.use('kg/linechart/1.0.1/index', function (S, LineChart) {
         var lineChart = new LineChart();
    })

## API说明

### html写法
    ```
        <div class="container"> <!-- 容器 -->
            <div class="parentElem"> <!-- 父数据节点集 -->
                <div data-childIds="a1,a2,a3,a4">a</div>
                <div data-childIds="a2">b</div>
                <div data-childIds="a3">c</div>
                <div data-childIds="a4">d</div>
                <div data-childIds="a5,a6,a7,a8">e</div>
                <div data-childIds="a6">f</div>
                <div data-childIds="a7">g</div>
                <div data-childIds="a8">h</div>
            </div>
            <canvas id="canvas" width="300" height="400"></canvas> <!-- 画布区域 -->
            <div class="childElem"> <!-- 子数据节点集 -->
                <div data-id="a1">a1</div>
                <div data-id="a2">a2</div>
                <div data-id="a3">a3</div>
                <div data-id="a4">a4</div>
                <div data-id="a5">a5</div>
                <div data-id="a6">a6</div>
                <div data-id="a7">a7</div>
                <div data-id="a8">a8</div>
            </div>
        </div>
    ```
#### **使用说明**：

在指定的容器container里，按照上面的代码格式编写；然后使用每个**父数据节点上的data-childIds**和**子数据节点上的data-id**来连接父子数据节点。

**data-childIds的扩展**:

    1. 使用a1,a2,a3,a4这样的逗号分割的方式来表示指向多个的关系
    2. 使用a1|0.5,a2|0.3来表示每一条连线的流量大小（最大值1：表示当前父数据节点的高度）


### js调用（初级配置）
```
var lineChart = new LineChart();
var options = {
    canvas: "#canvas",                    // 画布节点，可以使id，class，或者选择器对象
    render: "curve",                      // 线条渲染方式，内置了curve（曲线）与straight（直线）
    scroll: {                             // 启动滚动回调
        startCallback: function() {       // 父数据节点集合的滚动回调
            console.log("preCallback");
        },
        endCallback: function () {        // 子数据节点集合的滚动回调
            console.log("endCallback");
        }
    }
};
lineChart.add(options);  
```


### js调用（高级配置）

#####  arrows（箭头）配置
在options中增加arrows配置，如：

```
    ...
    arrows: {
        size: 0.05,                     // 箭头长度
        sharp: 0.025,                   // 箭头夹角
        lineWidth: 2,                   // 箭头宽度
        color: "rgba(211, 84, 0, 0.5)" // 箭头颜色
    };
    ...
```

#### render的扩展配置
options中，线条的渲染方式内置了curve（曲线）与straight（直线）两种线条，使用字符串即可使用，我们可以先看下内置的具体函数实现，其中curveLine，借用了uData的实现方式。

```
	...
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
    }
    ...
```

当然我们也可以自己绘图，所以render也可以是函数，我在函数中提供了如下的参数：

* ctx: context 对象 
* l1: 线条左上位置，格式为[x,y]
* l2: 线条右上位置，格式为[x,y]
* l3: 线条左下位置，格式为[x,y]
* l4: 线条右下位置，格式为[x,y]
* arrows: 箭头配置；个人如果没有配置，会有默认配置。

#### 级联配置
当我们涉及到多列的时候，按照上面的html格式继续叠加即可（即上一层作为下一层的父数据节点集）。
那么此时，在滚动回调加上如下配置，即可串接整个数据集合。在add的时候，只需添加最后一个option即可。

```
    scroll: {                             // 启动滚动回调
        preOption: preOptions             // 上一层的配置项
        startCallback: function() {       // 父数据节点集合的滚动回调
            console.log("preCallback");
        },
        endCallback: function () {        // 子数据节点集合的滚动回调
            console.log("endCallback");
        }
    }
```


