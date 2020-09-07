(function(ext) {
  ext._shutdown = function() {};

  ext._getStatus = function() {
    return { status: 2, msg: 'Ready' };
  };

  ext.set_color = function(color) {
    $.post('http://0.0.0.0:1234/color', { color });
  };

  ext.set_motor = function() {
  };

  ext.stop = function() {
  };

  ext.move_forward = function() {
  };

  ext.move_backward = function() {
  };

  ext.turn_right = function() {
  };

  ext.turn_left = function() {
  };

  ext.get_light = function(callback) {
    $.ajax({
      url: 'http://api.openweathermap.org/data/2.5/weather?q=Boston&units=imperial&appid=506c04c8964f81d05743f45f600991e8',
      dataType: 'jsonp',
      success: function(weather_data) {
        temperature = weather_data['main']['temp'];
        callback(temperature);
      }
    });
  };

  ext.get_direction = function() {
  };

  ext.get_touch = function() {
  };

  ext.get_angle = function() {
  };

  var descriptor = {
    blocks: [
      ['w', 'Set color', 'set_color', '#ff0000'],
      ['w', 'Set motor', 'set_motor'],
      ['w', 'Stop', 'stop'],
      ['w', 'Move forward', 'move_forward'],
      ['w', 'Move backward', 'move_backward'],
      ['w', 'Turn right', 'turn_right'],
      ['w', 'Turn left', 'turn_left'],
      ['R', 'Get light', 'get_light'],
      ['R', 'Get direction', 'get_direction'],
      ['R', 'Get touch', 'get_touch'],
      ['R', 'Get angle', 'get_angle'],
    ]
  };

  ScratchExtensions.register('Bucky', descriptor, ext);
})({});
