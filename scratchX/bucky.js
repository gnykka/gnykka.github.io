(function(ext) {
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

  ext.set_color = function(color, callback) {
    sendRequest(
      `${baseUrl}/color`,
      { color },
      callback
    );
  };

  ext.set_motor = function(number, speed) {
    sendRequest(
      `${baseUrl}/motor`,
      { number, speed: speed + 90 }
    );
  };

  ext.stop = function() {
    sendRequest(
      `${baseUrl}/stop`,
      {}
    );
  };

  ext.move_forward = function() {
    sendRequest(
      `${baseUrl}/move`,
      { direction: 'forward' }
    )
  };

  ext.move_backward = function() {
    sendRequest(
      `${baseUrl}/move`,
      { direction: 'backward' }
    )
  };

  ext.turn_right = function() {
    sendRequest(
      `${baseUrl}/move`,
      { direction: 'right' }
    )
  };

  ext.turn_left = function() {
    sendRequest(
      `${baseUrl}/move`,
      { direction: 'left' }
    )
  };

  ext.get_light = function(callback) {
    $.ajax({
      url: `${baseUrl}/light`,
    }).success(({ value }) => { callback(value); });
  };

  ext.get_direction = function(axis, callback) {
    $.ajax({
      url: `${baseUrl}/direction?axis=${axis}`,
    }).success(({ value }) => { callback(value); });
  };

  ext.get_angle = function(axis, callback) {
    $.ajax({
      url: `${baseUrl}/angle?axis=${axis}`,
    }).success(({ value }) => { callback(value); });
  };

  ext.get_touch = function(sensor, callback) {
    $.ajax({
      url: `${baseUrl}/touch?sensor=${sensor}`,
    }).success(({ value }) => { callback(value); });
  };

  var descriptor = {
    blocks: [
      ['w', 'Set color to %s', 'set_color', 'ff0000'],
      [' ', 'Set motor %n to speed value %n', 'set_motor', 1, 90],
      [' ', 'Stop', 'stop'],
      [' ', 'Move forward', 'move_forward'],
      [' ', 'Move backward', 'move_backward'],
      [' ', 'Turn right', 'turn_right'],
      [' ', 'Turn left', 'turn_left'],
      ['R', 'Get direction %m.dirAxis', 'get_direction', 'roll'],
      ['R', 'Get angle %m.angAxis', 'get_angle', 'x'],
      ['R', 'Get light', 'get_light'],
      ['R', 'Get touch %m.sensor', 'get_touch', 'hexagon'],
    ],
    menus: {
      dirAxis: ['roll', 'pitch', 'yaw'],
      angAxis: ['x', 'y', 'z'],
      sensor: ['hexagon', 'triangle', 'square', 'rhombus', 'trapeze'],
    },
  };

  ScratchExtensions.register('Bucky', descriptor, ext);
})({});
