/**
 * Easter egg para quien abra la consola.
 *
 * Solo se ejecuta en el navegador (lo llama main.tsx, que nunca entra en el
 * bundle de SSG), así que no toca el HTML prerenderizado.
 */
export function printConsoleSignature(): void {
  console.log(
    `%c Designed by:\n` +
      `%c` +
      ` ██╗  ██╗ █████╗ ██╗      █████╗ ███╗   ███╗ █████╗ ██████╗ ██╗ ██████╗ ██████╗ \n` +
      ` ██║ ██╔╝██╔══██╗██║     ██╔══██╗████╗ ████║██╔══██╗██╔══██╗██║██╔════╝██╔═══██╗\n` +
      ` █████╔╝ ███████║██║     ███████║██╔████╔██║███████║██████╔╝██║██║     ██║   ██║\n` +
      ` ██╔═██╗ ██╔══██║██║     ██╔══██║██║╚██╔╝██║██╔══██║██╔══██╗██║██║     ██║   ██║\n` +
      ` ██║  ██╗██║  ██║███████╗██║  ██║██║ ╚═╝ ██║██║  ██║██║  ██║██║╚██████╗╚██████╔╝\n` +
      ` ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═════╝ \n\n` +
      ` 🔗 @calamarico\n`,
    // Colores CSS con nombre: los tokens del tema viven en index.css y no
    // alcanzan aquí, así que nada de hex sueltos en el JS.
    "color: darkgray; font-size: 14px; font-weight: normal;",
    "color: plum; font-size: 10px; font-family: monospace; font-weight: bold;",
  );
}
