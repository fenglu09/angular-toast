angular.module('ToastModule', [])
  .factory('Toast', ['$document', '$timeout', function ($document, $timeout) {
    var jQLite = angular.element;

    function __dealCssEvent(eventNameArr, callback) {
      var events = eventNameArr,
        i, dom = this;

      function fireCallBack(e) {
        /*jshint validthis:true */
        if (e.target !== this) return;
        callback.call(this, e);
        for (i = 0; i < events.length; i++) {
          dom.off(events[i], fireCallBack);
        }
      }

      if (callback) {
        for (i = 0; i < events.length; i++) {
          dom.on(events[i], fireCallBack);
        }
      }
    }

    var _transitionEnd = function (element, callback) {
      var _this = angular.element(element);
      __dealCssEvent.call(_this, ['webkitTransitionEnd', 'transitionend'], callback);
      return this;
    };

    function getDuration(duration) {
      duration = duration || 2000;
      if (angular.isString(duration)) {
        switch (duration) {
          case 'short':
            duration = 2000;
            break;
          case 'long':
            duration = 3500;
            break;
          default:
            duration = 2000;
            break;
        }
      }
      // 减去动画的300毫秒
      return duration - 300;
    }

    /**
     * 提示toast消息
     * @param msg  消息内容
     * @param duration  'short', 'long'或者毫秒数;
     * @private
     */
    function _showToast(msg, duration) {
      var toastEle = jQLite('<div class="toast">' + msg + '</div>');

      duration = getDuration(duration);

      $document.find('body').append(toastEle);

      toastEle.css({
        display: 'block'
      });

      var offsetHeight = toastEle[0].offsetHeight;
      var offsetWidth = toastEle[0].offsetWidth;

      // 将left属性放在js里面去设置。
      // 由于toast的宽度是动态变化的，在css里面设置了left：50% 后，toast的最大宽度仅为50%,
      // 在js里面设置了margin-left后，最大宽度也只为75%. 因此无法水平居中
      toastEle.css({
        marginTop: -Math.round(offsetHeight / 2) + 'px',
        marginLeft: -Math.round(offsetWidth / 2) + 'px',
        left: '50%'
      });

      toastEle.addClass('toast-show');

      $timeout(function () {
        closeToast();
      }, duration);

      function closeToast() {
        toastEle.removeClass('toast-show').addClass('toast-hide');
        _transitionEnd(toastEle, function () {
          toastEle.remove();
        });
      }
    }

    return {
      show: _showToast
    }
  }]);
