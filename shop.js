// Buscador y filtros por categoría de la página Shop (jQuery)
$(function () {
  var $items = $('#lista-productos > li');
  var $buscar = $('#buscar');
  var $chips = $('.chip');
  var filtro = '';

  function aplicar() {
    var q = $.trim($buscar.val()).toLowerCase();
    var visibles = 0;

    $items.each(function () {
      var $li = $(this);
      var categorias = String($li.data('categorias') || '').split(' ');
      var coincideFiltro = !filtro || categorias.indexOf(filtro) > -1;
      var coincideTexto = !q || $li.text().toLowerCase().indexOf(q) > -1;
      var visible = coincideFiltro && coincideTexto;

      $li.toggleClass('hidden', !visible);
      if (visible) visibles++;
    });

    $('#sin-resultados').toggleClass('hidden', visibles > 0);
  }

  // Búsqueda mientras se escribe
  $buscar.on('input', aplicar);
  $('#form-buscar').on('submit', function (e) { e.preventDefault(); });

  // Filtros: al pulsar el activo se quita el filtro
  $chips.on('click', function () {
    var nuevo = $(this).data('filtro');
    filtro = (filtro === nuevo) ? '' : nuevo;
    $chips.each(function () {
      $(this).attr('aria-pressed', $(this).data('filtro') === filtro ? 'true' : 'false');
    });
    aplicar();
  });

  // Viniendo del icono de búsqueda de la Home (shop.html#buscar)
  if (window.location.hash === '#buscar') $buscar.trigger('focus');
});
