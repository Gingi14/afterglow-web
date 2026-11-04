// Página de compra: color, cantidad, favorito y barra de deslizar (jQuery)
$(function () {
  var $barra = $('#deslizar');
  var $asa = $('#asa');
  var $texto = $('#texto-barra');
  var $precio = $('#precio-total');
  var precio = parseFloat($barra.data('precio'));
  var cantidad = 1;
  var MIN = 1, MAX = 10;
  var formato = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

  // ---------- Cantidad ----------
  function pintarCantidad() {
    $('#cantidad').text(cantidad);
    $precio.text(formato.format(precio * cantidad));
    $('#btn-menos').prop('disabled', cantidad <= MIN);
    $('#btn-mas').prop('disabled', cantidad >= MAX);
  }
  $('#btn-menos').on('click', function () { if (cantidad > MIN) { cantidad--; pintarCantidad(); } });
  $('#btn-mas').on('click', function () { if (cantidad < MAX) { cantidad++; pintarCantidad(); } });
  pintarCantidad();

  // ---------- Color ----------
  $('input[name="color"]').on('change', function () {
    var $c = $(this);
    $('#color-elegido').text('Color: ' + $c.val());
    if ($c.data('img')) $('#img-producto').attr('src', $c.data('img'));
  });

  // ---------- Favorito ----------
  $('#btn-favorito').on('click', function () {
    var activo = $(this).attr('aria-pressed') !== 'true';
    $(this)
      .attr('aria-pressed', activo)
      .attr('aria-label', activo ? 'Quitar de favoritos' : 'Añadir a favoritos');
    try { localStorage.setItem('fav-freefall', activo ? '1' : '0'); } catch (e) {}
  });
  try {
    if (localStorage.getItem('fav-freefall') === '1') {
      $('#btn-favorito').attr('aria-pressed', 'true').attr('aria-label', 'Quitar de favoritos');
    }
  } catch (e) {}

  // ---------- Deslizar para añadir ----------
  var arrastrando = false, ocupado = false;
  var inicioX = 0, pos = 0, max = 0;

  function limite() { return $barra.innerWidth() - $asa.outerWidth() - 8; }
  function mover(x) { pos = x; $asa.css('transform', 'translateX(' + x + 'px)'); }

  function guardarEnCesta() {
    try {
      var cesta = JSON.parse(localStorage.getItem('cesta') || '[]');
      cesta.push({
        producto: 'Freefall',
        color: $('input[name="color"]:checked').val(),
        cantidad: cantidad,
        precio: precio
      });
      localStorage.setItem('cesta', JSON.stringify(cesta));
    } catch (e) {}
  }

  function confirmar() {
    ocupado = true;
    $asa.addClass('transition-transform');
    mover(limite());
    guardarEnCesta();
    $precio.text('Añadido a la cesta ✓');
    $texto.css('opacity', 1);

    setTimeout(function () {
      mover(0);
      pintarCantidad();
      ocupado = false;
    }, 1600);
  }

  $asa.on('pointerdown', function (e) {
    if (ocupado) return;
    var oe = e.originalEvent;
    arrastrando = true;
    max = limite();
    inicioX = oe.clientX - pos;
    this.setPointerCapture(oe.pointerId);
    $asa.removeClass('transition-transform');
  });

  $asa.on('pointermove', function (e) {
    if (!arrastrando) return;
    var x = Math.max(0, Math.min(max, e.originalEvent.clientX - inicioX));
    mover(x);
    $texto.css('opacity', 1 - x / max * 0.8);
  });

  $asa.on('pointerup pointercancel', function () {
    if (!arrastrando) return;
    arrastrando = false;
    $asa.addClass('transition-transform');
    $texto.css('opacity', 1);
    if (pos >= max * 0.85) confirmar(); else mover(0);
  });

  // Alternativa con teclado
  $asa.on('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (!ocupado) confirmar();
    }
  });
});
