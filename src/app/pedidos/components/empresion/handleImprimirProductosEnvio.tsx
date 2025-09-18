import { ComboDetalle, EnvioHeader } from "@/app/types";
import { formatearFecha } from "@/app/utils/utils";

export const handleImprimirProductos = (envio: EnvioHeader) => {
    const productosMap = new Map<string, { nombre: string; cantidad: number; idCategoria: number, esCombo: boolean ,detallesCombo: ComboDetalle[] }>();

    envio.envioPedido.forEach(ep => {
      ep.pedido.detalles.forEach(det => {
        const nombre = det.producto?.nombre ?? "Sin nombre";
        const key = nombre.toLowerCase();
        const idCategoria = det.producto?.id_categoria ?? 0;
        const esCombo = det.producto?.is_combo;
        const detallesCombo = det.producto?.comboHeader?.detalles || [];

        if (!productosMap.has(key)) {
          productosMap.set(key, { nombre, cantidad: det.cantidad, idCategoria, esCombo: esCombo || false, detallesCombo  });
        } else {
          productosMap.get(key)!.cantidad += det.cantidad;
        }
      });
    });

   /* const productosOrdenados = Array.from(productosMap.values()).sort((a, b) => {
      if (a.idCategoria !== b.idCategoria) {
        return a.idCategoria - b.idCategoria;
      }
      return a.nombre.localeCompare(b.nombre);
    });*/


    const productosHTML = Array.from(productosMap.values())
   // .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map(p => {
      const filaPrincipal = `
        <tr class="${p.esCombo ? 'combo' : ''}">
          <td>${p.nombre}</td>
          <td>${p.cantidad}</td>
        </tr>
      `;

      const filasDetalles = p.esCombo && Array.isArray(p.detallesCombo)
        ? p.detallesCombo.map(d => `
            <tr class="combo-detalle">
              <td style="padding-left: 30px;">- ${d.producto?.nombre}</td>
              <td>${d.cantidad}</td>
            </tr>
          `).join('')
        : '';

      return filaPrincipal + filasDetalles;
    })
    .join('');




    const win = window.open('', '_blank');
    if (!win) return;

    const contenido = `
    <html>
      <head>
        <title>Productos del Envío #${envio.id}</title>
        <style>
          body {
            font-family: sans-serif;
            padding: 20px;
          }

          h2 {
            margin-top: 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            border: 1px solid #aaa; /* Gris medio para bordes de grilla */
            padding: 8px;
            text-align: left;
          }

          thead {
            background-color: #f0f0f0;
          }

          tr.combo {
            background-color: #f9f9f9; /* Gris muy suave para combos */
            font-weight: bold;
          }

          tr.combo-detalle {
            background-color: #f9f9f9; /* Gris muy claro para productos dentro del combo */
            font-style: italic;
          }
          th.producto, td.producto {
              width: 35%;
            }
            th.cantidad, td.cantidad {
              width: 65%;
            }
        </style>
      </head>
      <body>
        <h2>Productos del Envío #${envio.id}</h2>
        <p><strong>Fecha:</strong> ${formatearFecha(envio.fechaCreacion)}</p>
        <p><strong>Móvil:</strong> ${envio.envioPedido[0]?.movil?.nombreMovil} - Chofer: ${envio.envioPedido[0]?.movil?.nombreChofer} - Chapa: ${envio.envioPedido[0]?.movil?.chapaMovil}</p>

        <table>
          <thead>
            <tr>
              <th class="producto">Producto</th>
              <th class="cantidad">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            ${productosHTML}
          </tbody>
        </table>

        <script>window.print();</script>
      </body>
    </html>
    `;



    win.document.write(contenido);
    win.document.close();
  };