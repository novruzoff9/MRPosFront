$(document).ready(function () {
  // Event delegation ile dinamik elementler de dahil olur
  $(document).on("click", ".actions", function (e) {
    e.stopPropagation(); // Menünün kendi üzerinde tıklama olayını durdur

    var $currentIcon = $(this)
      .find("i.fa-chevron-down, i.fa-chevron-up")
      .first();
    var $currentSubMenu = $(this).children(".sub-menu");

    // Diğer açık menüleri kapat
    $(".actions")
      .not($(this))
      .each(function () {
        var $icon = $(this).find("i.fa-chevron-down, i.fa-chevron-up").first();
        if ($icon.hasClass("fa-chevron-up")) {
          $icon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
          $(this).children(".sub-menu").hide();
        }
      });

    // Bu menüyü aç/kapat
    if ($currentIcon.hasClass("fa-chevron-down")) {
      $currentIcon.removeClass("fa-chevron-down").addClass("fa-chevron-up");
      $currentSubMenu.show();
    } else {
      $currentIcon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
      $currentSubMenu.hide();
    }
  });

  // Sayfanın herhangi bir yerine tıklandığında menüyü kapat
  $(document).click(function () {
    $(".actions").each(function () {
      var $icon = $(this).find("i.fa-chevron-down, i.fa-chevron-up").first();
      if ($icon.hasClass("fa-chevron-up")) {
        $icon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
        $(this).children(".sub-menu").hide();
      }
    });
  });

  // Alt menüye tıklanırsa menü kapanmasını engelle
  $(document).on("click", ".sub-menu", function (e) {
    e.stopPropagation(); // Alt menü tıklanınca kapanmayı engelle
  });
});
