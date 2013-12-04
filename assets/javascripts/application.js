$(document).ready(function() {
  app.initialize();
});

var app = {
  initialize: function() {
    this.bind_events();
    this.load_section();
  },

  bind_events: function() {
    $(document).on("click", "button.switch-section", function(e) {
      app.switch_section($(this).data("section"));
    });
  },

  current_section: "home",
  load_section: function() {
    $("section." + this.current_section).css("z-index", "1").css("opacity", "1");
  },
  switch_section: function(section) {
    $("section." + this.current_section).css("z-index", "0").animate({
      opacity: "0"
    });
    $("section." + section).css("z-index", "1").animate({
      opacity: "1"
    });
  }
};