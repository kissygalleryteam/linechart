KISSY.add("kg/linechart/1.0.1/index",["base","node"],function(t,e,o,r){var n,i=e("base"),a=e("node");n=function(e){var o=a.all,r=i,n=r.extend({initializer:function(){var t=this;t.scrolling=!1},trim:function(t){return t&&t.replace(/(^\s*)|(\s*$)/g,"")},getTop:function(t,e){return e.offsetTop-t.offsetTop-t.scrollTop},getVisibleItems:function(t,e){var o=this,t=t[0],r=t.offsetHeight,n=[];return e.each(function(e){if(0!==e[0].offsetHeight){var i=o.getTop(t,e[0]);i>=-e[0].offsetHeight&&r>i&&n.push(e)}}),n},arrow:function(){var t={paintArrow:function(t){r(this,t)},paintLine:function(t){o(this,t)},set:function(t,o,r,n,i,a){e(this,t,o,r,n,i,a)}},e=function(t,e,o,r,n,i,a){t.sp=e,t.ep=o,t.size=r,t.color=a,t.sharp=n,t.lineWidth=i},o=function(t,e){var o=t.sp,r=t.ep;void 0!=e&&(e.beginPath(),e.moveTo(o.x,o.y),e.lineTo(r.x,r.y),e.strokeStyle=t.color,e.closePath())},r=function(t,e){var o=t.sp,r=t.ep;if(void 0!=e){var i=n(t,o,r,e);e.beginPath(),e.moveTo(r.x,r.y),e.lineTo(i.h1.x,i.h1.y),e.moveTo(r.x,r.y),e.lineTo(i.h2.x,i.h2.y),e.lineWidth=t.lineWidth,e.lineCap="round",e.strokeStyle=t.color,e.stroke(),e.closePath()}},n=function(t,e,o){var r=Math.atan((o.x-e.x)/(o.y-e.y)),n=i(o,-r),a=i(e,-r),s={x:0,y:0},l={x:0,y:0},c=250;n.y-a.y<0&&(c*=-1),s.x=n.x+c*(t.sharp||.025),s.y=n.y-c*(t.size||.05),l.x=n.x-c*(t.sharp||.025),l.y=n.y-c*(t.size||.05);var f=i(s,r),h=i(l,r);return{h1:f,h2:h}},i=function(t,e){return{x:t.x*Math.cos(e)+t.y*Math.sin(e),y:t.y*Math.cos(e)-t.x*Math.sin(e)}};return t},straightLine:function(t,e,o,r,n,i){var a=this;t.beginPath(),t.moveTo(e[0],e[1]),t.lineTo(o[0],o[1]),t.lineTo(n[0],n[1]),t.lineTo(r[0],r[1]),t.lineTo(e[0],e[1]),t.fillStyle="rgba(211, 84, 0, 0.5)",t.fill(),t.closePath(),i&&(i.color=i.color||color,a.renderArrow(t,(e[0]+r[0])/2,(e[1]+r[1])/2,(o[0]+n[0])/2,(o[1]+n[1])/2,i))},curveLine:function(t,e,o,r,n,i,a,s){var l=this,c=[.5,.5],f="rgba(211, 84, 0, 0.5)",h=c&&[a*c[0],s*c[1]];t.beginPath(),t.moveTo(e[0],e[1]),t.quadraticCurveTo(h[0],h[1],o[0],o[1]),t.lineTo(n[0],n[1]),t.quadraticCurveTo(h[0],h[1],r[0],r[1]),t.lineTo(e[0],e[1]),t.fillStyle=f,t.fill(),t.closePath(),i&&(i.color=i.color||f,l.renderArrow(t,h[0],h[1],(o[0]+n[0])/2,(o[1]+n[1])/2,i))},renderArrow:function(t,e,o,r,n,i){var a=this,s=new a.arrow;s.set({x:e,y:o},{x:r,y:n},i.size,i.sharp,i.lineWidth,i.color),s.paintArrow(t)},mergeDefault:function(e){var o="rgba(211, 84, 0, 0.5)",r={color:o,size:.05},n={size:.05,sharp:.025,lineWidth:2,color:o};return e.arrows&&(e.arrows=t.merge(n,e.arrows)),e=t.merge(r,e)},add:function(e){var r=this;if(!e.canvas||!e.render)throw"lack some options!";e=r.mergeDefault(e);var n=(e.color,e.size),i=o(e.canvas),a=e.arrows,s=e.scroll,l=e.render,c=i[0].getContext("2d"),f=(1-n)/2,h=parseInt(i.css("width")),p=parseInt(i.css("height")),u=i.prev(),d=i.next(),v=u.children(),g=d.children(),T=function(t,e){if(t){var r=parseInt(o(t).css("height")),n=o(t).parent()[0],i=h,a=t[0].offsetTop-d[0].scrollTop-n.offsetTop+r*(1-(e||f)),s=i,l=t[0].offsetTop-d[0].scrollTop-n.offsetTop+r*(e||f);return[[i,a],[s,l]]}},y=function(){var t=u.attr("data-bind");s&&!t&&(u.attr("data-bind","1"),u.on("scroll",function(){r.scrolling||(r.scrolling=!0,r.add(e),s.preOption&&r.add(s.preOption),s.preCallback&&s.preCallback(),r.scrolling=!1)}),s.endCallback&&d.on("scroll",function(){r.add(e),s.endCallback&&s.endCallback()}))};c.clearRect(0,0,i.width(),i.height());var x=[],b=[],m={},w=r.getVisibleItems(u,v),k=r.getVisibleItems(d,g);t.each(k,function(t){var e=o(t).attr("data-id");m[e]=t}),t.each(w,function(e){{var n=parseInt(o(e).css("height")),i=o(e).parent()[0],a=o(e).attr("data-childIds").split(",");r.getTop(u[0],e[0])}t.each(a,function(t){var o=r.trim(t).split("|"),a=r.trim(o[0]),s=(1-r.trim(o[1]))/2,l=0,c=e[0].offsetTop-u[0].scrollTop-("absolute"==e.css("position")?0:i.offsetTop)+n*(1-(s||f)),h=l,p=e[0].offsetTop-u[0].scrollTop-("absolute"==e.css("position")?0:i.offsetTop)+n*(s||f);x.push([l,c,a,s]),b.push([h,p])})}),x.forEach(function(t,e){var o=t,n=b[e],i=t[2],s=t[3],f=T(m[i],s);if(f){var u=f[0],d=f[1];"string"==typeof l?("straight"==l&&r.straightLine(c,o,u,n,d,a),"curve"==l&&r.curveLine(c,o,u,n,d,a,h,p)):"function"==typeof l&&l.call(this,c,o,u,n,d,h,p)}}),y()}},{ATTRS:{$target:{value:"",getter:function(t){return o(t)}}}});return e=n}(),r.exports=n});