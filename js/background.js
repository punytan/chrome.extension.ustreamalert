$(function () {
    var ustbase = 'http://www.ustream.tv/channel/';
    var status  = {};

    var main = function (channel, res) {
        if (res.match(/現在、番組はオフラインです/)) {
            delete status[channel];
            return;
        }

        if (status[channel] === undefined)
            status[channel] = { isNotified : false };

        if (status[channel].isNotified)
            return;

        (new Audio("../sound/alert.mp3")).play();

        var icon = res.match(/class="image".+src="([^"]+)/gi)
            ? RegExp.$1 : 'img/icon.png';

        var notification = webkitNotifications.createNotification(icon, channel, 'ON AIR!');
        notification.onclick = function () {
            chrome.tabs.create({ url : ustbase + encodeURIComponent(channel) });
            notification.cancel();
        };
        notification.show();

        status[channel].isNotified = true;
    }

    var pollcb = function (channel) {
        return function (res) {
            main(channel, res);
        };
    };

    var pollHandler = function () {
        var channels = localStorage['channels']
            ? JSON.parse(localStorage['channels'])
            : new Array('mogra1', 'dommune', '2-5d1');

        status.channels = channels.length;
        for (var i = 0; i < channels.length; i++) {
            var channel = channels[i];
            $.get(ustbase + encodeURIComponent(channel), pollcb(channel));
        }
    };

    pollHandler(); // on start, check ustream lives once
    setInterval(pollHandler, 1000 * 60 * status.channels);
});
