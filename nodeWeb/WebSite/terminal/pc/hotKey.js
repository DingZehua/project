// ==UserScript==
// @name         hotKey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hotkey!
// @author       DingZehua9
// @include      https://www.google.com*
// @include      chrome-search://local-ntp/local-ntp.html
// @include      https://www.bilibili.com/video/*
// @include      https://www.baidu.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const hotKey = {
    els : {},
    action : []
  };
  const href = location.href;
  const holdPress = { stringKey : '',keys : [] ,_clearId : null};
  // 设置映射集合.
  const siteMap = [
    {
      name: 'bilibili',
      // 入口url
      url: 'https://www.bilibili.com/video/',
      // 提供给load事件回调.
      callback(e, hotKey) {
        return {
          els: {
            video : document.querySelector('video')
          },
          action: [
            { 
              // 动作命名
              name : 'playVideo',
              // 按键组合
              keys : ['alt','p'] ,
              // 执行动作
              exce() { 
                hotKey.els.video.paused ? hotKey.els.video.play() : hotKey.els.video.pause(); 
              }
            }, 
            {
              name : 'fullScreen',
              keys : ['alt','enter'],
              exce() {
                hotKey.els.video.requestFullscreen();
              }
            }
          ]
        }
      }
    },
    {
      name: 'googleSearch',
      url: 'https://www.google.com',
      callback(e, hotKey) {
        return {
          els: {
            search : document.querySelector('.gLFyf.gsfi')
          },
          action: [
            { 
              name : 'focusSearch',
              keys : ['shift','alt','s'] ,
              exce() { 
                hotKey.els.search.focus();
              }
            }
          ]
        }
      }
    },
    {
      name: 'baiduSearch',
      url: 'https://www.baidu.com',
      callback(e, hotKey) {
        return {
          els: {
            search : document.querySelector('#kw')
          },
          action: [
            { 
              name : 'focusSearch',
              keys : ['shift','alt','s'] ,
              exce() { 
                hotKey.els.search.focus();
              }
            }
          ]
        }
      }
    }
  ];

  init(hotKey, holdPress, siteMap, href);

  function init(hotKey, holdPress, siteMap, href) {
    let callback = null;
    // 查找对应的网址映射
    siteMap.every((v) => {
      if (href.indexOf(v.url) > -1) {
        callback = v.callback;
        return false;
      }
      return true;
    });

    if (!callback) return;

    window.addEventListener('load', function (e) {
      ({ els: hotKey.els, action: hotKey.action } = callback(e, hotKey));
      /* 绑定至主对象上 */
      hotKey.action.forEach((item) => {
        item._stringKey = item.keys.sort().join();
        hotKey['#' + item.name] = item;
      });
    }, false);
    window.addEventListener('keydown', function (e) {
      console.log('keydown')
      const key = e.key.toLowerCase();
      // 添加到按键集合.
      if (holdPress.keys.indexOf(key) === -1) {
        holdPress.keys.push(key);
        // 字符串化.
        holdPress.stringKey = holdPress.keys.sort().join();
      }

      // if(holdPress._clearId !== null) {
      //   holdPress._clearId
      // }

      setTimeout(function(){console.log('timeout')},0);

      let actionName = null;

      // 查找是否有对应的映射集合
      hotKey.action.every((item) => {
        if(item._stringKey === holdPress.stringKey) {
          actionName = item.name;
          return false;
        }
        return true;
      });
      
      if(!actionName) {
        return;
      }

      console.log(actionName)
      // 执行按键映射.
      hotKey['#' + actionName].exce();

    });

    window.addEventListener('keyup', function (e) {
      console.log('keyup');
      const key = e.key.toLowerCase();
      const i = holdPress.keys.indexOf(key);
      // 松开按键时移除掉按键列表对应的key值.
      if (i > -1) {
        holdPress.keys.splice(i, 1);
        holdPress.stringKey = holdPress.keys.sort().join();
      }
    });
    function clearKey(holdPress) {
      holdPress.keys = [];
      holdPress._stringKey = '';
      holdPress._clearId = null;
    }
  }

})();