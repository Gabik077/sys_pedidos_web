import { Pedido } from "@/app/types";
import { formatearFecha } from "@/app/utils/utils";

export const handleImprimirVentaDelivery = (pedidosAImprimir: Pedido[]) => {

  const contenido = `
    <html>
      <head>
        <title>Ventas</title>
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
        ${pedidosAImprimir.map(venta => {
          const totalFormateado = Number(venta.total).toLocaleString("es-PY", {
            style: "currency", currency: "PYG"
          });

          return `
            <div class="pedido">
              <h3>Venta #${venta.id} - ${formatearFecha(venta.fechaPedido)}</h3>
              <div class="linea-cliente">
                <strong>Cliente:</strong> ${venta.cliente?.nombre || "No asignado"} | Código: ${venta.cliente?.id || ""} -
                ${venta.cliente?.ciudad || ""} - ${venta.cliente?.direccion || ""}<br/>
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
                  ${venta.detalles.map(d => {
                    const precioUnit = Number(d.producto?.precio_venta);
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