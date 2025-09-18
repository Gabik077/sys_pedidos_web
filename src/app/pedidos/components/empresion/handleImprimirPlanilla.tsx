import { EnvioHeader } from "@/app/types";
import { formatearFecha, numberFormatter, priceFormatter } from "@/app/utils/utils";

  export const handleImprimirPlanilla = (envio: EnvioHeader) => {
  const win = window.open('', '_blank');
  if (!win) return;

  // Encabezado de la planilla
  const fechaActual = new Date();
  fechaActual.setDate(fechaActual.getDate() + 1);
  const fecha = formatearFecha(fechaActual);
  const movil = envio.envioPedido[0]?.movil;
  const totalEnvio = envio.envioPedido.reduce((total, ep) => total + Number(ep.pedido.total), 0);
  const totalEnvioFormatted = priceFormatter.format(totalEnvio);


  // Construir filas de detalle
// Filas con contenido
const filasContenido = envio.envioPedido
  .sort((a, b) => a.ordenEnvio - b.ordenEnvio)
  .map(({ pedido, ordenEnvio }) => {
    return `
      <tr>
        <td>${ordenEnvio}</td>
        <td  class="campo-ciudad">${pedido.cliente?.ciudad || ''}</td>
        <td class="campo-cliente">${ pedido.clienteNombre || ''}</td>
        <td>${ numberFormatter.format(Number(pedido.total)) || ''}</td>
        <td class="campo-factura"></td>
        <td ></td>
        <td></td>

        <td class="campo-observacion"></td>
        <td style="text-align:center;">
          <div style="display:flex; gap:4px; font-size:10px; justify-content:center;">
            <div style="width:12px; height:12px; border:1px solid #000; background:#ffffff;"></div>
            <div style="width:12px; height:12px; border:1px solid #000; background:#ffffff;"></div>
            <div style="width:12px; height:12px; border:1px solid #000; background:#ffffff;"></div>
          </div>
        </td>
      </tr>
    `;
  })
  .join('');

// Cinco filas vacías adicionales
const filasVacias = Array.from({ length: 5 })
  .map(() => `
    <tr>
      <td>&nbsp;</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td>&nbsp;</td>
    </tr>
  `)
  .join('');

// Combina ambas
const filas = filasContenido + filasVacias;


  const contenido = `
    <html>
      <head>
        <title>Planilla de Rendición - Envío #${envio.id}</title>
        <style>
         .pedido {
              page-break-inside: avoid;
              break-inside: avoid; /* Para compatibilidad */
              margin-bottom: 20px;
            }
          body { font-family: sans-serif; padding:20px; }
          h1 { margin:0; font-size:18px; }
          .header { display:flex; flex-wrap: wrap; gap:12px; margin-bottom:16px; }
          .campo { flex:1 1 100px; font-size:12px; }
          .campo-cliente { width:120px; max-width:120px; } }
          .campo-ciudad { width:80px; max-width:80px; }
          .campo-factura { width:60px; max-width:60px; } }
          .campo-efectivo { max-width:20px;  }
          .campo-observacion { width:300px; max-width:400px; }
          .datos { font-weight:500; }
          .tabla { width:100%; border-collapse: collapse; margin-top:8px; }
          th, td { border:1px solid #444; padding:6px; font-size:11px; }
          thead { background:#efefef; }
          .lado { display:flex; gap:40px; margin-top:12px; }

          .detalle-costos { float:right; width:220px; border:1px solid #666; padding:8px; font-size:12px; }
          .seccion-mas { margin-top:20px; }
          .linea { border-bottom:1px solid #ccc; height:18px; margin-bottom:4px; }
          .totales { margin-top:8px; }
          .etiqueta { width:120px; display:inline-block; }
          .cuadrados span { display:inline-block; width:14px; height:14px; margin-right:4px; border:1px solid #000; vertical-align:middle; }

 .resumen {
    flex:1;
    min-width: 250px;
    max-width:300px;
    border:1px solid #555;
    border-radius:6px;
    padding:10px 12px;
    font-size:12px;
  }
  .resumen-demas {
    flex:1;
    min-width: 200px;
    max-width:200px;
    border:1px solid #555;
    border-radius:6px;
    padding:10px 12px;
    font-size:12px;
  }

     .detalle-costos {
    flex:1;
    min-width: 250px;
    max-width:260px;
    border:1px solid #555;
    border-radius:6px;
    padding:10px 12px;
    font-size:12px;
  }
  .card-titulo {
    font-weight:700;
    margin-bottom:8px;
    border-bottom:1px solid #ccc;
    padding-bottom:14px;
    font-size:13px;
  }
  .fila-costo {
    display:flex;
    justify-content: space-between;
    margin-bottom:6px;
  }
  .fila-costo.total {
    margin-top:6px;
    border-top:1px dashed #999;
    padding-top:6px;
    font-weight:600;
  }
  .label {
    flex:0 0 100px;
  }
  .valor {
    flex:1;
    text-align:right;
  }
  .linea-input {
    display:inline-block;
    border-bottom:1px solid #000;
    min-width:100px;
    padding:10 4px;
    margin-left:4px;

  }

   .linea-input-demas {
    display:inline-block;
    border-bottom:1px solid #000;
    min-width:180px;
    max-width:180px;
    padding:10 4px;
    align-items: center;
    margin-left:4px;

  }

  .seccion-mas {
    margin-top:22px;
    font-size:12px;
  }
  .subtitulo {
    font-weight:700;
    margin-bottom:6px;
  }
  .notas {
    display:flex;
    flex-direction: column;
    gap:6px;
  }
  .nota-line {
    position: relative;
    height:16px;
  }
  .linea-larga {
    display:block;
    border-bottom:1px solid #999;
    width:100%;
    height:0;
  }
        </style>
      </head>
      <body>
        <h1>Planilla de Rendición</h1><br>
        <div class="header pedido">
          <div class="campo"><div class="etiqueta">Responsables:___________________</div></div>

          <div style="font-size:12px;">Móvil: ${movil?.nombreMovil || ''} chapa: ${movil?.chapaMovil || ''} ,  Km Inicial:__________ Km Final__________ </div></div>
             <div style="font-size:12px;">Fecha envío: ${fecha}</div>
        </div>

        <table class="tabla pedido">
          <thead>
            <tr>
              <th></th>
              <th>Ciudad</th>
              <th>Cliente</th>
              <th>A cobrar</th>
              <th>Fact Nro.</th>
              <th>Cobro Efec</th>
              <th>Cobro transf</th>
              <th>Observación</th>
              <th>Eval
                <div style="margin-top:2px; display:flex; gap:4px; justify-content:center;">
                <div style="width:12px; height:12px; border:1px solid #000; background:#ff4d4f;  -webkit-print-color-adjust: exact; print-color-adjust: exact;"></div>
                <div style="width:12px; height:12px; border:1px solid #000; background:#faad14;  -webkit-print-color-adjust: exact; print-color-adjust: exact;"></div>
                <div style="width:12px; height:12px; border:1px solid #000; background:#52c41a;  -webkit-print-color-adjust: exact; print-color-adjust: exact;"></div>
              </div>
              </th>
            </tr>
          </thead>
          <tbody>
            ${filas}
          </tbody>
        </table>

       <div class="lado">
  <div class="resumen pedido">
    <div class="totales">
      <div><span class="etiqueta">Total Pedidos:</span> <span class="linea-input">${totalEnvioFormatted}</span></div>
      <div><span class="etiqueta">Gastos:</span> <span class="linea-input"></span></div>
      <div><span class="etiqueta">Saldo:</span> <span class="linea-input"></span></div>
    </div>
  </div>

  <div class="detalle-costos pedido">
    <div class="card-titulo">Detalle de costos</div>
    <div class="fila-costo">
      <div class="label">Combustible:</div>
      <div class="valor">______________</div>
    </div>
    <div class="fila-costo">
      <div class="label">Viáticos:</div>
      <div class="valor">______________</div>
    </div>
    <div class="fila-costo">
      <div class="label">Peaje:</div>
      <div class="valor">______________</div>
    </div>
    <div class="fila-costo total">
      <div class="label">Total:</div>
      <div class="valor"><br>______________</div>
    </div>
  </div>

    <div class="resumen-demas pedido">
    <div >
      <div><strong>De más:</strong></div>
      <div> <span class="linea-input-demas"></span></div>
      <div> <span class="linea-input-demas"></span></div>
      <div> <span class="linea-input-demas"></span></div>
      <div> <span class="linea-input-demas"></span></div>
      <div> <span class="linea-input-demas"></span></div>
    </div>
  </div>
</div>


        <script>window.print();</script>
      </body>
    </html>
  `;

  win.document.write(contenido);
  win.document.close();
};
