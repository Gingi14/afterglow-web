// Menú lateral (móvil) y modo claro/oscuro con jQuery
$(function () {
  var $menu = $('#menu-lateral');
  var $velo = $('#velo');
  var $btnMenu = $('#btn-menu');

  function abrirMenu() {
    $menu.removeClass('-translate-x-full');
    $velo.removeClass('hidden');
    $btnMenu.attr('aria-expanded', 'true');
    $('body').addClass('menu-abierto');
    $('#btn-cerrar').trigger('focus');
  }

  function cerrarMenu() {
    $menu.addClass('-translate-x-full');
    $velo.addClass('hidden');
    $btnMenu.attr('aria-expanded', 'false').trigger('focus');
    $('body').removeClass('menu-abierto');
  }

  $btnMenu.on('click', abrirMenu);
  $('#btn-cerrar, #velo').on('click', cerrarMenu);
  $menu.find('a').on('click', cerrarMenu);
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && !$menu.hasClass('-translate-x-full')) cerrarMenu();
  });

  // Modo claro / oscuro
  $('#btn-tema').on('click', function () {
    var oscuro = $('html').toggleClass('dark').hasClass('dark');
    try { localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro'); } catch (e) {}
  });
});
