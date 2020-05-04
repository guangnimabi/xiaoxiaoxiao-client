const EVENT_EXCHANGE = "event_exchange"
const EVENT_EXCHANGE_ROLLBACK = "event_exchange_rollback"
const EVENT_DISAPPEAR = "event_disappear"
const EVENT_RENEW = "event_renew"

module.exports = cc.Class({
    statics: {
        receiver: cc.Node,
        _lastTouch: cc.Vec2,
        _lastlastTouch: cc.Vec2,

        //操作事件
        registOperateEvent: function (eventHandler) {
            var self = this;
            self.receiver.on(cc.Node.EventType.TOUCH_START, function (event) {
                self._lastlastTouch = self._lastTouch;
                self._lastTouch = self.receiver.convertToNodeSpaceAR(event.getLocation());
            });
            self.receiver.on(cc.Node.EventType.TOUCH_END, function (event) {
                var position = self._lastTouch;
                var direction = self.receiver.convertToNodeSpaceAR(event.getLocation()).sub(position);
                if (direction.mag() === 0) {
                    if (self._lastlastTouch.mag() === 0) {
                        return;
                    }

                    position = self._lastlastTouch;
                    direction = self._lastTouch.sub(position);
                }

                self._lastTouch = new cc.v2();
                self._lastlastTouch = new cc.v2();

                cc.log(position.x + "," + position.y + "     " + direction.x + ","+direction.y)
                eventHandler(position, direction);
            });
        },

        //交换事件
        registExchangeEvent: function (eventHandler) {
            this.receiver.on(EVENT_EXCHANGE, function (cell1, cell2) {
                eventHandler(cell1, cell2);
            });
        },

        dispatchExchangeEvent: function (cell1, cell2) {
            this.receiver.emit(EVENT_EXCHANGE, cell1, cell2);
        },

        //交换回退事件
        registExchangeRollbackEvent: function (eventHandler) {
            this.receiver.on(EVENT_EXCHANGE_ROLLBACK, function (cell1, cell2) {
                eventHandler(cell1, cell2);
            });
        },

        dispatchExchangeRollbackEvent: function (cell1, cell2) {
            this.receiver.emit(EVENT_EXCHANGE_ROLLBACK, cell1, cell2);
        },

        //消失事件
        registDisappearEvent: function (eventHandler) {
            this.receiver.on(EVENT_DISAPPEAR, function (event) {
                var disappearCells = event.getUserData();
                eventHandler(disappearCells);
            });
        },

        dispatchDisappearEvent: function (disappearCells) {
            var event = new cc.Event.EventCustom(EVENT_DISAPPEAR, false);
            event.setUserData(disappearCells);
            this.receiver.dispatchEvent(event);
        },

        //重建事件
        registRenewEvent: function (eventHandler) {
            this.receiver.on(EVENT_RENEW, function (event) {
                var renewCells = event.getUserData();
                eventHandler(renewCells);
            });
        },

        dispatchRenewEvent: function (renewCells) {
            var event = new cc.Event.EventCustom(EVENT_RENEW, false);
            event.setUserData(renewCells);
            this.receiver.dispatchEvent(event);
        },
    }
});