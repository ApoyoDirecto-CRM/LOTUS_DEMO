# Guia: Subir landing page a WordPress

## Opcion 1: Pagina HTML completa (Recomendada)

### Paso 1 — Preparar los archivos
1. Subir `styles.css` a: `wp-content/uploads/css/`
2. Subir `main.js` a: `wp-content/uploads/js/`
3. Anotar las URLs completas:
   - `https://tudominio.com/wp-content/uploads/css/styles.css`
   - `https://tudominio.com/wp-content/uploads/js/main.js`

### Paso 2 — Instalar plugin necesario
En WordPress Dashboard → Plugins → Añadir nuevo, buscar e instalar:
- **"WPCode"** (insertar codigo en head/body)
  O
- **"Insert Headers and Footers"**

### Paso 3 — Crear la pagina
1. Paginas → Añadir nueva
2. Titulo: "Lotus Travel"
3. En el editor, cambiar a modo "Codigo" (no Visual)
4. Pegar TODO el contenido interno de `voyage-landing.html`
   (desde `<header class="site-header">` hasta el cierre de `</footer>`)

### Paso 4 — Enlazar CSS y JS
En WPCode → Añadir nuevo snippet personalizado:

**Snippet CSS** (en Head):
```html
<link rel="stylesheet" href="https://tudominio.com/wp-content/uploads/css/styles.css">
```

**Snippet JS** (en Body - Footer):
```html
<script src="https://tudominio.com/wp-content/uploads/js/main.js"></script>
```

### Paso 5 — Configurar como pagina de inicio
1. Ajustes → Lectura
2. Seleccionar "Una pagina estatica"
3. En "Pagina de inicio" seleccionar "Lotus Travel"
4. Guardar cambios

---

## Opcion 2: Usar Elementor (sin codigo)

1. Instalar plugin **Elementor** (versión gratis)
2. Crear pagina nueva → "Editar con Elementor"
3. Arrastrar widget **HTML** al canvas
4. Pegar todo el codigo HTML
5. En "Configuracion" → "CSS personalizado", pegar el contenido de `styles.css`
6. Para JS, usar el plugin **"Custom JS"** o agregar via WPCode

---

## Opcion 3: Via FTP

1. Conectar al servidor via FTP (FileZilla)
2. Navegar a `/wp-content/themes/tu-tema/`
3. Subir:
   - `voyage-landing.html` como `front-page.php`
   - `css/styles.css`
   - `js/main.js`
4. En `functions.php` agregar:
```php
function lotus_assets() {
    wp_enqueue_style('lotus-style', get_template_directory_uri().'/css/styles.css');
    wp_enqueue_script('lotus-main', get_template_directory_uri().'/js/main.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'lotus_assets');
```

---

## Opcion 4: Plugin "Custom HTML Widget" (rapida)

1. Apariencia → Widgets
2. Arrastrar "HTML personalizado" al area de contenido
3. Pegar el HTML completo
4. Guardar
5. Ir a Ajustes → Lectura → Pagina estatica → Seleccionar la pagina

---

## Notas importantes

- Las imagenes estan hotlinkadas de `lotustravel.com.mx` — funcionan sin subirlas
- El archivo via `wa.me` de WhatsApp funciona directo
- El scroll-smooth funciona nativamente en todos los navegadores modernos
- En movil, el menu hamburguesa funciona con el JS incluido
- El intro animation se ejecuta una sola vez por visita

## Si algo no carga bien

1. Abrir consola del navegador (F12 → Console)
2. Buscar errores de "mixed content" o "404"
3. Verificar que las URLs de CSS/JS sean correctas
4. Limpiar cache del navegador (Ctrl+Shift+R)
