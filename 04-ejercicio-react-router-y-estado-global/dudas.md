# Aquí puedes dejar tus dudas

## Primera parte

<!-- Dudas de la primera parte del ejercicio -->

## Segunda parte

<!-- Dudas de la segunda parte del ejercicio -->
En la clase de "Ejercicio: terminar de estilar la página de detalle" se menciona que se puede hacer lo siguiente, pero no me queda claro como agregar directo en el markdown que regresa la api, agregué este css en Detail.module.css usando .sectionContent y desde ahí a los elementos de la lista

3. Listas con estilo
Si quieres listas con iconos en lugar de viñetas:

.prose ul.check {
  list-style: none;
  padding-left: 0;
}

.prose ul.check li {
  position: relative;
  padding-left: 1.5rem;
}

.prose ul.check li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #16a34a;
  font-weight: bold;
}
Copiar
Y en tu markdown o HTML generado, añade la clase check a las listas especiales:

<ul class="check">
  <li>Experiencia con React</li>
  <li>Conocimiento de TypeScript</li>
</ul>

## Tercera parte

<!-- Dudas de la tercera parte del ejercicio -->

## Cuarta parte

<!-- Dudas de la cuarta parte del ejercicio -->

## Quinta parte

<!-- Dudas de la quinta parte del ejercicio -->

## Sexta parte

<!-- Dudas de la sexta parte del ejercicio -->
