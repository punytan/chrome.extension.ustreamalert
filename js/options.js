function saveOptions () {
    var channels = toArray(document.getElementById('channel_list').value);
    localStorage['channels'] = JSON.stringify(channels);
}

function toText (array) {
    var text = '';
    for (var i in array)
        text += array[i] + '\n';
    return text;
}

function toArray (text) {
    var ret = new Array;
    var array = text.split('\n');
    for (var i in array)
        if (!!array[i])
            ret.push(array[i]);
    return ret;
}

function init () {
    console.log(localStorage['channels']);
    var channels = localStorage['channels']
        ? JSON.parse(localStorage['channels'])
        : new Array('mogra1', 'dommune', '2-5d1');

    document.getElementById('channel_list').value = toText(channels);
    document.getElementById('list_form').addEventListener('submit', saveOptions, false);
}

window.addEventListener('load', init, false);

