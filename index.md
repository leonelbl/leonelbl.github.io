---
layout: home
lang-ref: home
---

{% if site.active_lang == 'es' %}
  <!-- Contenido en Español -->
  <div class="home-intro">
    <h1>Mi Blog de Herramientas</h1>
    <p>Notas y herramientas útiles para el día a día</p>
  </div>

{% else %}
  <!-- Content in English -->
  <div class="home-intro">
    <h1>My Tools Blog</h1>
    <p>Useful notes and tools for everyday use</p>
  </div>

{% endif %}

<!-- El resto lo maneja automáticamente el layout 'home' de minima -->