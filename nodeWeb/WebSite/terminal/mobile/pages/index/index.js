const lib_base = require('../../includes/lib_base');
const config =require('../../includes/config');
Page({
  data : {
    loading : true,
    page : 1,
    size : 20,
    category_id : 53,
    category : '蔬菜',
    loadingAnimation : false
  },
  onLoad(options) {
  },
  async getData() {
    this.setData({
      loadingAnimation : true
    })
    const res = await lib_base.getData('goods','findType=list','GET');
    let data = res.data.map((item)=> {
      item.img_url = config.host +  item.img_url;
      return item;
    })
    this.setData(
      {
        loading : false,
        data,
        loadingAnimation : false
      }
    );
  }
});

// find type - list \ a \