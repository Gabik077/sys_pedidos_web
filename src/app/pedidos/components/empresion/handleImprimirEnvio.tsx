import { EnvioHeader } from "@/app/types";
import { formatearFecha } from "@/app/utils/utils";

  export const handleImprimirEnvio = (envio: EnvioHeader) => {
    const win = window.open('', '_blank');
    if (!win) return;
    let totalEnvio = 0;

    const contenido = `
      <html>
        <head>
          <title>Envío #${envio.id}</title>
          <style>
            body {
              font-family: sans-serif;
              padding: 20px;
            }

            h2, h3 {
              margin-top: 0;
            }

            .pedido {
              padding-bottom: 15px;
              border-bottom: 2px solid #ccc;
              page-break-inside: avoid;
              break-inside: avoid; /* Para compatibilidad */
              margin-bottom: 20px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              margin-bottom: 10px;
            }

            th, td {
              border: 1px solid #aaa;
              padding: 8px;
              text-align: left;
            }

            thead {
              background-color: #f0f0f0;
            }

            tr.combo {
              background-color: #fff8c4;
              font-weight: bold;
            }

            tr.combo-detalle {
              background-color: #f9f9f9;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <p><strong>Envío #${envio.id}</strong> , ${formatearFecha(envio.fechaCreacion)}, Móvil:${envio.envioPedido[0]?.movil?.nombreMovil} - Chofer: ${envio.envioPedido[0]?.movil?.nombreChofer} - Chapa: ${envio.envioPedido[0]?.movil?.chapaMovil}</p>
          <p><strong>Cantidad pedidos:</strong> ${envio.envioPedido.length}</p>


          ${envio.envioPedido.map((ep) => {
            const p = ep.pedido;
            totalEnvio += Number(p.total);

            const detalles = p.detalles.map(d => {
              const esCombo = !!d.producto?.comboHeader;
              return `
                <tr class="${esCombo ? 'combo' : ''}">
                  <td>${d.producto?.nombre || 'Sin nombre'}</td>
                  <td>${d.cantidad}</td>
                  <td>${(Number(d.precioUnitario) * d.cantidad).toLocaleString('es-PY', {
                    style: 'currency',
                    currency: 'PYG'
                  })}</td>
                </tr>
                ${esCombo && d.producto.comboHeader?.detalles
                  ? d.producto.comboHeader.detalles.map(cd => `
                    <tr class="combo-detalle">
                      <td>- ${cd.producto?.nombre}</td>
                      <td>${cd.cantidad}</td>
                      <td></td>
                    </tr>
                  `).join('')
                  : ''
                }
              `;
            }).join('');

            return `
              <div class="pedido">
                <p><strong>Pedido #${p.id}</strong></p>
                <p><strong>Cliente:</strong> ${p.clienteNombre} - ${p.cliente?.ruc}, Dirección: ${p.cliente?.direccion} - ${p.cliente?.ciudad}</p>
                <p><strong>Vendedor:</strong> ${p.vendedorNombre || "Sin vendedor"} - <strong>Observaciones:</strong> ${p.observaciones || "Sin observaciones"}</p>
                <p><strong>Total:</strong> ${Number(p.total).toLocaleString('es-PY', {
                  style: 'currency',
                  currency: 'PYG'
                })}</p>
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${detalles}
                  </tbody>
                </table>
              </div>
            `;
          }).join('')}

          <h3>Total pedidos: ${Number(totalEnvio).toLocaleString('es-PY', {
            style: 'currency',
            currency: 'PYG'
          })}</h3>

          <script>window.print();</script>
        </body>
      </html>
    `;

    win.document.write(contenido);
    win.document.close();
  };