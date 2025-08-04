import { Pedido } from "@/app/types";
import { formatearFecha } from "@/app/utils/utils";

export const handleImprimirSeleccionados = (pedidos: Pedido[], seleccionados: number[]) => {
  const pedidosAImprimir = pedidos.filter(p => seleccionados.includes(p.id));

  const contenido = `
    <html>
      <head>
        <title>Pedidos Seleccionados</title>
        <style>
        .pedido {
          page-break-inside: avoid;
          break-inside: avoid; /* Para compatibilidad */
          margin-bottom: 40px;
        }
          body { font-family: sans-serif; padding: 20px; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          td, th { border: 1px solid #ccc; padding: 6px; font-size: 14px; }
          h3 { margin: 20px 0 10px; color: #444; }
          .pedido-info { margin-bottom: 6px; font-size: 14px; color: #555; }
          .linea-cliente { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        ${pedidosAImprimir.map(pedido => {
          const totalFormateado = Number(pedido.total).toLocaleString("es-PY", {
            style: "currency", currency: "PYG"
          });

          return `
            <div class="pedido">
              <h3>Pedido #${pedido.id} - ${formatearFecha(pedido.fechaPedido)}</h3>
              <div class="linea-cliente">
                <strong>Cliente: ${pedido.clienteNombre}</strong> | RUC: ${pedido.cliente?.ruc} |
                ${pedido.cliente?.ciudad} - ${pedido.cliente?.direccion}<br/>
                Vendedor: ${pedido.vendedorNombre || "No asignado"} |
                Obs: ${pedido.observaciones || "-"}

              </div>

              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Precio Unit.</th>
                    <th>Sub   Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${pedido.detalles.map(d => {
                    const precioUnit = Number(d.precioUnitario);
                    const totalLinea = precioUnit * d.cantidad;

                    return `
                      <tr>
                        <td>${d.producto?.nombre}</td>
                        <td>${d.cantidad}</td>
                        <td>${precioUnit.toLocaleString("es-PY", {
                          style: "currency", currency: "PYG"
                        })}</td>
                        <td>${totalLinea.toLocaleString("es-PY", {
                          style: "currency", currency: "PYG"
                        })}</td>
                      </tr>
                    `;
                  }).join("")}
                  <tr>
                    <td colspan="3" style="text-align: right; font-weight: bold;">Total:</td>
                    <td colspan="3" style="text-align: right; font-weight: bold;">${totalFormateado}</td>
                  </tr>
                </tbody>

              </table>

            </div>
          `;
        }).join("")}
      </body>
    </html>
  `;


  const win = window.open("", "_blank");
  if (win) {
    win.document.write(contenido);
    win.document.close();
    win.print();
  }
};