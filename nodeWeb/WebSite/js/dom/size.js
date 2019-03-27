collections.dom.size = {};
collections.dom.size = (function(){
  var size = {};
  // 例15-8：查询窗口滚动条的位置。
  // 以一个对象的x和y属性的方式返回滚动条的偏移量。
  function getScrollOffsets(w) {
    // 使用指定的窗口，如果不带参数则使用当前窗口。
    var w = w || window;
    // 除了IE8及更早的版本之外，其他浏览器都能用。
    if(w.pageXOffset != null) return {x: w.pageXOffset,y:w.pageYOffset};
    // 对标准模式下的IE（或任何浏览器）
    var d = w.document;
    if(document.compatMode === 'CSS1Compat') {
      return {x:d.documentElement.scrollLeft, y: d.documentElement.scrollTop};
    }
  
    // 对怪异模式下的浏览器
    return {x: d.body.scrollLeft,y: d.body.scrollTop};
  }
  
  // 例15-9:查询窗口的视口尺寸。
  // 作为一个对象的w和h属性返回视口的尺寸。
  function getViewportSize(w) {
    // 使用当前窗口,如果不带参数则使用当前窗口。
    var w = w || window;
  
    // 除了IE8及更早的版本之外，其他浏览器都能用。
    if(w.innerWidth != null) return {w:innerWidth,h:w.innerHeight};
  
    // 对标准模式下的IE（或任何浏览器）。
    var d = w.document;
    if(document.compatMode == 'CSS1Compat') {
      return {w: d.documentElement.clientWidth,
              h: d.documentElement.clientHeight};
    }
    
    // 对怪异模式下的浏览器
    return {w: d.body.clientWidth,h: d.body.clientWidth};
  }
  
  function getDocumentCoordinate(elt){   
    var box = elt.getBoundingClientRect();  // 获得在视口坐标的位置。
    var offsets = getScrollOffsets();             // 上面定义的工具函数。
    return {x : box.left + offsets.x,             // 转换为文档坐标值。
            y : box.top  + offsets.y};
  }
  
  function toFoot(){
    // 获得文档的和视口的高度，offsetHeight会在下面解释
    var documentHeight = document.documentElement.offsetHeight;
    var viewportHeight = window.innerHeight; // 或使用上面的getViewportSize().
    // 然后滚动到最后一页的底部。
    var a = documentHeight - viewportHeight;
    window.scroll(0,documentHeight - viewportHeight);
  }
  
  function getElementPosition(e) {
    var x = 0, y = 0;
    while(e != null) {
      x += e.offsetLeft;
      y += e.offsetTop;
      e = e.offsetPrent;
    }
    return {x:x,y:y};
  }
  
  function getElementPos(elt){
    // 获取偏移量。
    var coordinate = getElementPosition(elt);
    var x = coordinate.x;
    var y = coordinate.y;
    // 循环所有的祖先元素，减去滚动条的偏移值，转换成视口值。
    for(var e = elt.parentNode; e != null && e.nodeType === 1;  e = e.parentNode) {
      x -= e.scrollLeft;
      y -= e.scrollTop;
    }
    return {x:x,y:y};
  }

  size.method = {};
  size.method.getScrollOffsets = getScrollOffsets;
  size.method.getViewportSize  = getViewportSize;
  size.method.getDocumentCoordinate = getDocumentCoordinate;
  size.method.toFoot = toFoot;
  size.method.getElementPosition = getElementPosition;
  size.method.getElementPos = getElementPos;
  
  return size;
}());