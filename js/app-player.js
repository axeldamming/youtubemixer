
var AppPlayer = function(id, config){
  config     = $.extend(AppPlayer.default_config, config);
  var self   = this;
  this.ready = false;

  var init = function(){
    self.player = new YT.Player(id, $.extend(config.yt, { events: {
                                                          'onReady': on_player_ready,
                                                          'onStateChange': on_state_change
                                                      }}));
  };

  var on_player_ready = function(e){
    self.ready = true;

    if(typeof config.player.on_ready == 'function')
      config.player.on_ready(e);
  };

  var on_state_change = function(e){
    if(typeof config.player.on_change == 'function')
      config.player.on_change(e);
  };

  this.volume = function(level = null){
    if(level === null)
      return self.player.getVolume();

    if(level > 0)
      $('#'+id).addClass('active');
    else
      $('#'+id).removeClass('active');

    self.player.setVolume(level);
  };

  this.is_playing = function (){
    return self.player.getPlayerState() === YT.PlayerState.PLAYING;
  };

  $('#search-'+id+'-button').click(function(){
    App.search($('#search-'+id+'-input').val(), function(data){
      var str = '';
      for(var i = 0; i < data.results.length; i++)
        str+=AppView.format_search_result(data.results[i]);

      $('#search-'+id+'-result').html(str);
    });
  });

  $(document).on('click', '#search-'+id+'-result .record', function(){
    var video_id = $(this).data('id');

    /*if(self.volume() > 0)
      //TODO add to playlist
    else*/
      self.player.loadVideoById(video_id);
  });

  init();
}

AppPlayer.default_config = {
  yt: {
    height: '390',
    width: '640',
    playerVars: { listType:'playlist',
            list: '<YOURPLAYLISTID>' }

  },
  player:{
    on_ready: null,
    on_change: null
  }
}