'use strict';

exports.__esModule = true;
exports.includeEventsIn = includeEventsIn;
exports.configure = configure;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaLogging = require('aurelia-logging');

var LogManager = _interopRequireWildcard(_aureliaLogging);

var logger = LogManager.getLogger('event-aggregator');

var Handler = (function () {
    function Handler(messageType, callback) {
        _classCallCheck(this, Handler);

        this.messageType = messageType;
        this.callback = callback;
    }

    Handler.prototype.handle = function handle(message) {
        if (message instanceof this.messageType) {
            this.callback.call(null, message);
        }
    };

    return Handler;
})();

var EventAggregator = (function () {
    function EventAggregator() {
        _classCallCheck(this, EventAggregator);

        this.eventLookup = {};
        this.messageHandlers = [];
    }

    EventAggregator.prototype.publish = function publish(event, data) {
        var subscribers = undefined;
        var i = undefined;
        if (typeof event === 'string') {
            subscribers = this.eventLookup[event];
            if (subscribers) {
                subscribers = subscribers.slice();
                i = subscribers.length;
                try {
                    while (i--) {
                        subscribers[i](data, event);
                    }
                } catch (e) {
                    logger.error(e);
                }
            }
        } else {
            subscribers = this.messageHandlers.slice();
            i = subscribers.length;
            try {
                while (i--) {
                    subscribers[i].handle(event);
                }
            } catch (e) {
                logger.error(e);
            }
        }
    };

    EventAggregator.prototype.subscribe = function subscribe(event, callback) {
        var handler = undefined;
        var subscribers = undefined;
        if (typeof event === 'string') {
            handler = callback;
            subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);
        } else {
            handler = new Handler(event, callback);
            subscribers = this.messageHandlers;
        }
        subscribers.push(handler);
        return {
            dispose: function dispose() {
                var idx = subscribers.indexOf(handler);
                if (idx !== -1) {
                    subscribers.splice(idx, 1);
                }
            }
        };
    };

    EventAggregator.prototype.subscribeOnce = function subscribeOnce(event, callback) {
        var sub = this.subscribe(event, function (a, b) {
            sub.dispose();
            return callback(a, b);
        });
        return sub;
    };

    return EventAggregator;
})();

exports.EventAggregator = EventAggregator;

function includeEventsIn(obj) {
    var ea = new EventAggregator();
    obj.subscribeOnce = function (event, callback) {
        return ea.subscribeOnce(event, callback);
    };
    obj.subscribe = function (event, callback) {
        return ea.subscribe(event, callback);
    };
    obj.publish = function (event, data) {
        return ea.publish(event, data);
    };
    return ea;
}

function configure(config) {
    config.instance(EventAggregator, includeEventsIn(config.aurelia));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1cmVsaWEtZXZlbnQtYWdncmVnYXRvci50cyJdLCJuYW1lcyI6WyJIYW5kbGVyIiwiSGFuZGxlci5jb25zdHJ1Y3RvciIsIkhhbmRsZXIuaGFuZGxlIiwiRXZlbnRBZ2dyZWdhdG9yIiwiRXZlbnRBZ2dyZWdhdG9yLmNvbnN0cnVjdG9yIiwiRXZlbnRBZ2dyZWdhdG9yLnB1Ymxpc2giLCJFdmVudEFnZ3JlZ2F0b3Iuc3Vic2NyaWJlIiwiRXZlbnRBZ2dyZWdhdG9yLnN1YnNjcmliZS5kaXNwb3NlIiwiRXZlbnRBZ2dyZWdhdG9yLnN1YnNjcmliZU9uY2UiLCJpbmNsdWRlRXZlbnRzSW4iLCJjb25maWd1cmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OEJBQTRCLGlCQUFpQjs7SUFBakMsVUFBVTs7QUFFdEIsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztJQUV4RCxPQUFBO0FBQ0VBLGFBREYsT0FBQSxDQUNzQkEsV0FBZ0JBLEVBQVVBLFFBQWdDQSxFQUFBQTs4QkFEaEYsT0FBQTs7QUFDc0JDLFlBQUFBLENBQUFBLFdBQVdBLEdBQVhBLFdBQVdBLENBQUtBO0FBQVVBLFlBQUFBLENBQUFBLFFBQVFBLEdBQVJBLFFBQVFBLENBQXdCQTtLQUM3RUE7O0FBRkgsV0FBQSxXQUlFRCxNQUFNQSxHQUFBQSxnQkFBQ0EsT0FBWUEsRUFBQUE7QUFDakJFLFlBQUlBLE9BQU9BLFlBQVlBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBO0FBQ3ZDQSxnQkFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0E7U0FDbkNBO0tBQ0ZBOztXQVJILE9BQUE7OztJQXdCQSxlQUFBO0FBQUFDLGFBQUEsZUFBQSxHQUFBQTs4QkFBQSxlQUFBOztBQUNVQyxZQUFBQSxDQUFBQSxXQUFXQSxHQUFRQSxFQUFFQSxDQUFDQTtBQUN0QkEsWUFBQUEsQ0FBQUEsZUFBZUEsR0FB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VUFBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBQUE7QUFDeENBLGVBQUdBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBO0FBQ2RBLG1CQUFPQSxRQUFRQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtTQUN2QkEsQ0FBQ0EsQ0FBQ0E7QUFFSEEsZUFBT0EsR0FBR0EsQ0FBQ0E7S0FDWkE7O1dBdEdILGVBQUE7Ozs7O0FBNkdBLFNBQUEsZUFBQSxDQUFnQyxHQUFRLEVBQUE7QUFDdENDLFFBQUlBLEVBQUVBLEdBQUdBLElBQUlBLGVBQWVBLEVBQUVBLENBQUNBO0FBQy9CQSxPQUFHQSxDQUFDQSxhQUFhQSxHQUFHQSxVQUFDQSxLQUFVQSxFQUFFQSxRQUFhQTtlQUFLQSxFQUFFQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxFQUFFQSxRQUFRQSxDQUFDQTtLQUFBQSxDQUFDQTtBQUNyRkEsT0FBR0EsQ0FBQ0EsU0FBU0EsR0FBR0EsVUFBQ0EsS0FBVUEsRUFBRUEsUUFBYUE7ZUFBS0EsRUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsUUFBUUEsQ0FBQ0E7S0FBQUEsQ0FBQ0E7QUFDN0VBLE9BQUdBLENBQUNBLE9BQU9BLEdBQUdBLFVBQUNBLEtBQVVBLEVBQUVBLElBQVVBO2VBQUtBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLEVBQUVBLElBQUlBLENBQUNBO0tBQUFBLENBQUNBO0FBQ2xFQSxXQUFPQSxFQUFFQSxDQUFDQTtDQUNYQTs7QUFNRCxTQUFBLFNBQUEsQ0FBMEIsTUFBVyxFQUFBO0FBQ25DQyxVQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxlQUFlQSxFQUFFQSxlQUFlQSxDQUFDQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtDQUNuRUEiLCJmaWxlIjoiYXVyZWxpYS1ldmVudC1hZ2dyZWdhdG9yLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgTG9nTWFuYWdlciBmcm9tICdhdXJlbGlhLWxvZ2dpbmcnO1xyXG5cclxuY29uc3QgbG9nZ2VyID0gTG9nTWFuYWdlci5nZXRMb2dnZXIoJ2V2ZW50LWFnZ3JlZ2F0b3InKTtcclxuXHJcbmNsYXNzIEhhbmRsZXIge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbWVzc2FnZVR5cGU6IGFueSwgcHJpdmF0ZSBjYWxsYmFjazogKG1lc3NhZ2U6IGFueSkgPT4gdm9pZCkge1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlKG1lc3NhZ2U6IGFueSkge1xyXG4gICAgaWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiB0aGlzLm1lc3NhZ2VUeXBlKSB7XHJcbiAgICAgIHRoaXMuY2FsbGJhY2suY2FsbChudWxsLCBtZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4qIFJlcHJlc2VudHMgYSBkaXNwb3NhYmxlIHN1YnNjaXB0aW9uIHRvIGFuIEV2ZW50QWdncmVnYXRvciBldmVudC5cclxuKi9cclxuZXhwb3J0IGludGVyZmFjZSBTdWJzY3JpcHRpb24ge1xyXG4gIC8qKlxyXG4gICogRGlzcG9zZXMgdGhlIHN1YnNjcmlwdGlvbi5cclxuICAqL1xyXG4gIGRpc3Bvc2UoKTogdm9pZDtcclxufVxyXG5cclxuLyoqXHJcbiogRW5hYmxlcyBsb29zZWx5IGNvdXBsZWQgcHVibGlzaC9zdWJzY3JpYmUgbWVzc2FnaW5nLlxyXG4qL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRBZ2dyZWdhdG9yIHtcclxuICBwcml2YXRlIGV2ZW50TG9va3VwOiBhbnkgPSB7fTtcclxuICBwcml2YXRlIG1lc3NhZ2VIYW5kbGVyczogSGFuZGxlcltdID0gW107XHJcblxyXG4gIC8qKlxyXG4gICogUHVibGlzaGVzIGEgbWVzc2FnZS5cclxuICAqIEBwYXJhbSBldmVudCBUaGUgbWVzc2FnZSBkYXRhIHR5cGUgdG8gcHVibGlzaCB0by5cclxuICAqL1xyXG4gIHB1Ymxpc2g8VD4oZXZlbnQ6IFQpOiB2b2lkO1xyXG4gIC8qKlxyXG4gICogUHVibGlzaGVzIGEgbWVzc2FnZS5cclxuICAqIEBwYXJhbSBldmVudCBUaGUgbWVzc2FnZSBjaGFubmVsIHRvIHB1Ymxpc2ggdG8uXHJcbiAgKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSB0byBwdWJsaXNoIG9uIHRoZSBjaGFubmVsLlxyXG4gICovXHJcbiAgcHVibGlzaChldmVudDogc3RyaW5nLCBkYXRhPzogYW55KTogdm9pZDtcclxuICBwdWJsaXNoKGV2ZW50OiBhbnksIGRhdGE/OiBhbnkpOiB2b2lkIHtcclxuICAgIGxldCBzdWJzY3JpYmVyczogYW55W107XHJcbiAgICBsZXQgaTogbnVtYmVyO1xyXG5cclxuICAgIGlmICh0eXBlb2YgZXZlbnQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHN1YnNjcmliZXJzID0gdGhpcy5ldmVudExvb2t1cFtldmVudF07XHJcbiAgICAgIGlmIChzdWJzY3JpYmVycykge1xyXG4gICAgICAgIHN1YnNjcmliZXJzID0gc3Vic2NyaWJlcnMuc2xpY2UoKTtcclxuICAgICAgICBpID0gc3Vic2NyaWJlcnMubGVuZ3RoO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgICAgICBzdWJzY3JpYmVyc1tpXShkYXRhLCBldmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3Vic2NyaWJlcnMgPSB0aGlzLm1lc3NhZ2VIYW5kbGVycy5zbGljZSgpO1xyXG4gICAgICBpID0gc3Vic2NyaWJlcnMubGVuZ3RoO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgICBzdWJzY3JpYmVyc1tpXS5oYW5kbGUoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcihlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiBTdWJzY3JpYmVzIHRvIGEgbWVzc2FnZSB0eXBlLlxyXG4gICogQHBhcmFtIGV2ZW50IFRoZSBtZXNzYWdlIGRhdGEgVHlwZSB0byBzdWJzY3JpYmUgdG8uXHJcbiAgKiBAcGFyYW0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbiB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UgaXMgcHVibGlzaGVkLlxyXG4gICovXHJcbiAgc3Vic2NyaWJlPFQ+KGV2ZW50OiBDb25zdHJ1Y3RvcjxUPiwgY2FsbGJhY2s6IChtZXNzYWdlOiBUKSA9PiB2b2lkKTogU3Vic2NyaXB0aW9uO1xyXG4gIC8qKlxyXG4gICogU3Vic2NyaWJlcyB0byBhIG1lc3NhZ2UgY2hhbm5lbC5cclxuICAqIEBwYXJhbSBldmVudCBUaGUgbWVzc2FnZSBjaGFubmVsIHRvIHN1YnNjcmliZSB0by5cclxuICAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSBpcyBwdWJsaXNoZWQuXHJcbiAgKi9cclxuICBzdWJzY3JpYmUoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IChtZXNzYWdlOiBhbnksIGV2ZW50Pzogc3RyaW5nKSA9PiB2b2lkKTogU3Vic2NyaXB0aW9uO1xyXG4gIHN1YnNjcmliZShldmVudDogc3RyaW5nfENvbnN0cnVjdG9yPGFueT4sIGNhbGxiYWNrOiAobWVzc2FnZTogYW55LCBldmVudD86IHN0cmluZykgPT4gdm9pZCk6IFN1YnNjcmlwdGlvbiB7XHJcbiAgICBsZXQgaGFuZGxlcjogRnVuY3Rpb258SGFuZGxlcjtcclxuICAgIGxldCBzdWJzY3JpYmVyczogYW55W107XHJcblxyXG4gICAgaWYgKHR5cGVvZiBldmVudCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgaGFuZGxlciA9IGNhbGxiYWNrO1xyXG4gICAgICBzdWJzY3JpYmVycyA9IHRoaXMuZXZlbnRMb29rdXBbZXZlbnRdIHx8ICh0aGlzLmV2ZW50TG9va3VwW2V2ZW50XSA9IFtdKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGhhbmRsZXIgPSBuZXcgSGFuZGxlcihldmVudCwgY2FsbGJhY2spO1xyXG4gICAgICBzdWJzY3JpYmVycyA9IHRoaXMubWVzc2FnZUhhbmRsZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIHN1YnNjcmliZXJzLnB1c2goaGFuZGxlcik7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZGlzcG9zZSgpIHtcclxuICAgICAgICBsZXQgaWR4ID0gc3Vic2NyaWJlcnMuaW5kZXhPZihoYW5kbGVyKTtcclxuICAgICAgICBpZiAoaWR4ICE9PSAtMSkge1xyXG4gICAgICAgICAgc3Vic2NyaWJlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgKiBTdWJzY3JpYmVzIHRvIGEgbWVzc2FnZSB0eXBlLCB0aGVuIGRpc3Bvc2VzIHRoZSBzdWJzY3JpcHRpb24gYXV0b21hdGljYWxseSBhZnRlciB0aGUgZmlyc3QgbWVzc2FnZSBpcyByZWNlaXZlZC5cclxuICAqIEBwYXJhbSBldmVudCBUaGUgbWVzc2FnZSBkYXRhIFR5cGUgdG8gc3Vic2NyaWJlIHRvLlxyXG4gICogQHBhcmFtIGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdoZW4gd2hlbiB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UgaXMgcHVibGlzaGVkLlxyXG4gICovXHJcbiAgc3Vic2NyaWJlT25jZTxUPihldmVudDogQ29uc3RydWN0b3I8VD4sIGNhbGxiYWNrOiAobWVzc2FnZTogVCkgPT4gdm9pZCk6IFN1YnNjcmlwdGlvbjtcclxuICAvKipcclxuICAqIFN1YnNjcmliZXMgdG8gYSBtZXNzYWdlIGNoYW5uZWwsIHRoZW4gZGlzcG9zZXMgdGhlIHN1YnNjcmlwdGlvbiBhdXRvbWF0aWNhbGx5IGFmdGVyIHRoZSBmaXJzdCBtZXNzYWdlIGlzIHJlY2VpdmVkLlxyXG4gICogQHBhcmFtIGV2ZW50IFRoZSBtZXNzYWdlIGNoYW5uZWwgdG8gc3Vic2NyaWJlIHRvLlxyXG4gICogQHBhcmFtIGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdoZW4gd2hlbiB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UgaXMgcHVibGlzaGVkLlxyXG4gICovXHJcbiAgc3Vic2NyaWJlT25jZShldmVudDogc3RyaW5nLCBjYWxsYmFjazogKG1lc3NhZ2U6IGFueSwgZXZlbnQ/OiBzdHJpbmcpID0+IHZvaWQpOiBTdWJzY3JpcHRpb247XHJcbiAgc3Vic2NyaWJlT25jZShldmVudDogc3RyaW5nfENvbnN0cnVjdG9yPGFueT4sIGNhbGxiYWNrOiAobWVzc2FnZTogYW55LCBldmVudD86IHN0cmluZykgPT4gdm9pZCk6IFN1YnNjcmlwdGlvbiB7XHJcbiAgICBsZXQgc3ViID0gdGhpcy5zdWJzY3JpYmUoPGFueT5ldmVudCwgKGEsIGIpID0+IHtcclxuICAgICAgc3ViLmRpc3Bvc2UoKTtcclxuICAgICAgcmV0dXJuIGNhbGxiYWNrKGEsIGIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHN1YjtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4qIEluY2x1ZGVzIEV2ZW50IEFnZ3JlZ2F0b3IgZnVuY3Rpb25hbGl0eSBpbnRvIGFuIG9iamVjdCBpbnN0YW5jZS5cclxuKiBAcGFyYW0gb2JqIFRoZSBvYmplY3QgdG8gbWl4IEV2ZW50IEFnZ3JlZ2F0b3IgZnVuY3Rpb25hbGl0eSBpbnRvLlxyXG4qL1xyXG5leHBvcnQgZnVuY3Rpb24gaW5jbHVkZUV2ZW50c0luKG9iajogYW55KTogRXZlbnRBZ2dyZWdhdG9yIHtcclxuICBsZXQgZWEgPSBuZXcgRXZlbnRBZ2dyZWdhdG9yKCk7XHJcbiAgb2JqLnN1YnNjcmliZU9uY2UgPSAoZXZlbnQ6IGFueSwgY2FsbGJhY2s6IGFueSkgPT4gZWEuc3Vic2NyaWJlT25jZShldmVudCwgY2FsbGJhY2spO1xyXG4gIG9iai5zdWJzY3JpYmUgPSAoZXZlbnQ6IGFueSwgY2FsbGJhY2s6IGFueSkgPT4gZWEuc3Vic2NyaWJlKGV2ZW50LCBjYWxsYmFjayk7XHJcbiAgb2JqLnB1Ymxpc2ggPSAoZXZlbnQ6IGFueSwgZGF0YT86IGFueSkgPT4gZWEucHVibGlzaChldmVudCwgZGF0YSk7XHJcbiAgcmV0dXJuIGVhO1xyXG59XHJcblxyXG4vKipcclxuKiBDb25maWd1cmVzIGEgZ2xvYmFsIEV2ZW50IEFnZ3JlZ2F0b3IgYnkgbWVyZ2luZyBmdW5jdGlvbmFsaXR5IGludG8gdGhlIEF1cmVsaWEgaW5zdGFuY2UuXHJcbiogQHBhcmFtIGNvbmZpZyBUaGUgQXVyZWxpYSBGcmFtZXdvcmsgY29uZmlndXJhdGlvbiBvYmplY3QgdXNlZCB0byBjb25maWd1cmUgdGhlIHBsdWdpbi5cclxuKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ3VyZShjb25maWc6IGFueSk6IHZvaWQge1xyXG4gIGNvbmZpZy5pbnN0YW5jZShFdmVudEFnZ3JlZ2F0b3IsIGluY2x1ZGVFdmVudHNJbihjb25maWcuYXVyZWxpYSkpO1xyXG59XHJcbiJdfQ==
