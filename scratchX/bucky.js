(function(ext) {
  const colors = {
    green: '00ff00', yellow: 'ffff00', blue: '0000ff', red: 'ff0000',
    magenta: 'ff00ff', cyan: '00ffff', pink: 'ffc0cb',
    orange: 'ffa500', white: 'ffffff', black: '000000',
  };
  const baseUrl = 'http://0.0.0.0:1234/api';
  const sendRequest = function(url, data, callback) {
    $.ajax({
      url,
      type: 'POST',
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      dataType: 'application/json'
    }).always(() => callback());
  };

  ext._shutdown = function() {};

  ext._getStatus = function() {
    return { status: 2, msg: 'Ready' };
  };

  ext.set_color_value = function(color, callback) {
    sendRequest(
      `${baseUrl}/color`,
      { color: colors[color] },
      callback
    );
  };

  ext.set_color = function(r, g, b, callback) {
    // 0 - 00 (0), 100 - ff (255)
    r = Math.round(r * 100 / 255).toString(16);
    g = Math.round(g * 100 / 255).toString(16);
    b = Math.round(b * 100 / 255).toString(16);

    if (r.length === 1) r = `0${r}`;
    if (g.length === 1) g = `0${g}`;
    if (b.length === 1) b = `0${b}`;

    sendRequest(
      `${baseUrl}/color`,
      { color: `${r}${g}${b}` },
      callback
    );
  };

  ext.set_motor = function(number, speed, callback) {
    // -100% - 0, 100% - 180
    sendRequest(
      `${baseUrl}/motor`,
      { number, speed: (speed + 100) / 200 * 180 },
      callback
    );
  };

  ext.get_touch = function(sensor, callback) {
    $.ajax({
      url: `${baseUrl}/touch?sensor=${sensor}`,
    }).success(({ value }) => { callback(value); });
  };

  ext.get_touch_value = function(sensor, callback) {
    $.ajax({
      url: `${baseUrl}/touch?sensor=${sensor}&value=true`,
    }).success(({ value }) => { callback(value); });
  };

  ext.get_angle = function(axis, callback) {
    $.ajax({
      url: `${baseUrl}/angle?axis=${axis}`,
    }).success(({ value }) => { callback(value); });
  };

  ext.get_light = function(callback) {
    $.ajax({
      url: `${baseUrl}/light`,
    }).success(({ value }) => { callback(value); });
  };

  var descriptor = {
    blocks: [
      ['R', 'Touch sensor %m.sensorValue value', 'get_touch_value', 1],
      ['R', 'Touch sensor %m.sensorValue is activated?', 'get_touch', 1],
      ['R', 'Tilt angle %m.tiltAngle', 'get_angle', 'x'],
      ['R', 'Light value in %', 'get_light'],
      ['w', 'Set motor %m.motorValue to speed value %n%', 'set_motor', 1, 100],
      ['w', 'Set color to %m.colors', 'set_color_value', 'green'],
      ['w', 'Set color RGB to %n %n %n', 'set_color', 100, 0, 0],
      // TODO: Temperature value
      // TODO: Play sound FREQ (0-20000 in Hz)
    ],
    menus: {
      sensorValue: [1, 2, 3, 4, 5],
      tiltAngle: ['x', 'y', 'z'],
      motorValue: [1, 2, 3, 4],
      colors: ['green','yellow','blue','red','magenta','cyan','pink','orange','white','black'],
    },
  };

  ScratchExtensions.register('Bucky', descriptor, ext);
})({});
