const EVENT_EXCHANGE = "event_exchange"
const EVENT_EXCHANGE_ROLLBACK = "event_exchange_rollback"

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
    }
});