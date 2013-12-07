$(document).ready(function() {
  app.initialize();
});

var app = {
  initialize: function() {
    this.bind_events();
    this.load_section();

    if (this.is_installed()) {
      $(".btn-install").hide();
    }
  },

  bind_events: function() {
    $(document).on("click", ".switch-section", function(e) {
      app.switch_section($(this).data("section"));
    });

    $(document).on("click", this.dots + ".active", function(e) {
      app.add_point();
    });

    $(document).on("click", ".btn-install", function(e) {
      app.install();
      $(".btn-install").html("Installed!").fadeOut("slow");
    });
  },

  /* ******************** **
  ** ******************** **
  ** **** FIREFOX OS **** **
  ** ******************** **
  ** ******************** */
  app_url: "http://app.myxotod.de/manifest.webapp",
  is_installed: function() {
    var request = navigator.mozApps.checkInstalled(this.app_url);
    request.onsuccess = function() {
      if (request.result) {
        return true;
      } else {
        return false;
      }
    };
    request.onerror = function() {
      console.log(this.error.message);
      return false;
    };
  },
  install: function() {
    var request = navigator.mozApps.install(this.app_url);
    request.onsuccess = function() {
      return true;
    };
    request.onerror = function() {
      console.log(this.error.name);
      return false;
    };
  },

  /* ******************** **
  ** ******************** **
  ** ***** SECTIONS ***** **
  ** ******************** **
  ** ******************** */
  current_section: "home",
  switch_speed: 150, // ms
  load_section: function() {
    $("section." + this.current_section).css("display", "block").css("left", "0");
    this.check_section(this.current_section);
  },
  switch_section: function(section) {
    $("section." + this.current_section).animate({
      left: "-100%"
    }, this.switch_speed, function() {
      $(this).css("display", "none").css("left", "100%");
    });
    $("section." + section).css("display", "block").animate({
      left: "0%"
    }, this.switch_speed);
    this.current_section = section;
    this.check_section(this.current_section);
  },
  check_section: function(section) {
    switch (section) {
      case "play":
        this.start_game();
      break;
    }
  },

  /* ******************** **
  ** ******************** **
  ** ******* GAME ******* **
  ** ******************** **
  ** ******************** */
  game_field: "section.play .game",
  dots: "section.play .game .dot",
  score: 0,
  time_left: 30,
  time_interval: "",
  start_game: function() {
    this.prepare_game();
    this.time_interval = setInterval("app.update_time()", 1000);
    this.set_dot();
  },
  prepare_game: function() {
    // Reset variables
    this.score = 0;
    this.time_left = 30;

    // Prepare game field
    var game_size = $(this.game_field).width();
    $(this.game_field).css("height", game_size + "px");

    // Insert dots
    var dots_per_row = 6;
    var dots_count = dots_per_row * dots_per_row;
    for (var i=1;i<=36;i++) {
      var new_dot = $("<div class='dot'></div>");
      $(this.game_field).append(new_dot);
    }

    // Calculate dot size
    var dot_size = Math.floor(game_size / dots_per_row);
    $(this.dots).css("width", dot_size + "px");
    $(this.dots).css("height", dot_size + "px");
  },
  set_dot: function() {
    $(this.dots).removeClass("active");
    var active = Math.floor((Math.random() * ($(this.dots).length - 1))+1);
    $(this.dots + ":eq("+active+")").addClass("active");
  },
  add_point: function() {
    this.score++;
    this.play_sound();
    this.vibrate();
    $("section.play header .score span").html(this.score);
    this.set_dot();
  },
  update_time: function() {
    this.time_left--;
    if (this.time_left == 0) {
      $("section.play header .time span").html(this.time_left);
      this.end_game();
    } else {
      if (this.time_left.length < 2) {
        this.time_left = "0" + this.time_left;
      }
      $("section.play header .time span").html(this.time_left);
    }
  },
  end_game: function() {
    clearInterval(this.time_interval);
    $("section.gameover").html("You scored " + this.score + " points in 30 seconds");
    this.switch_section("gameover");
  },
  play_sound: function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'assets/sounds/tap.mp3');
    audioElement.setAttribute('type', 'audio/mp3');
    audioElement.setAttribute('autoplay', 'autoplay');

    //$.get();

    audioElement.addEventListener("load", function() {
      audioElement.play();
    }, true);
  },
  vibrate: function() {
    if('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  }
};