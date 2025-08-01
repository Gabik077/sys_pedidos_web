import { EnvioHeader } from "@/app/types";
import { formatearFecha } from "@/app/utils/utils";

  export const handleImprimirPlanilla = (envio: EnvioHeader) => {
  const win = window.open('', '_blank');
  if (!win) return;

  // Encabezado de la planilla
  const fecha = formatearFecha(envio.fechaCreacion);
  const movil = envio.envioPedido[0]?.movil;

  // Construir filas de detalle
  const filas = envio.envioPedido
    .sort((a, b) => a.ordenEnvio - b.ordenEnvio)
    .map(({ pedido, ordenEnvio }) => {
      return `
        <tr>
          <td>${ordenEnvio}</td>
          <td>${pedido.cliente?.ciudad || ''}</td>
          <td>${pedido.clienteNombre || ''}</td>
          <td></td> <!-- A cobrar -->
          <td></td> <!-- Factura Nro -->
          <td></td> <!-- Cobro efectivo -->
          <td></td> <!-- Cobro giro -->
          <td></td> <!-- Cobro transferencia -->
          <td></td> <!-- Pendiente -->
          <td></td> <!-- Observación -->
          <td style="text-align:center;">
            <div style="display:flex; gap:4px; font-size:12px; justify-content:center;">
              <div style="width:15px; height:15px; border:1px solid #000; background:#ffffff;"></div>
              <div style="width:15px; height:15px; border:1px solid #000; background:#ffffff;"></div>
              <div style="width:15px; height:15px; border:1px solid #000; background:#ffffff;"></div>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  const contenido = `
    <html>
      <head>
        <title>Planilla de Rendición - Envío #${envio.id}</title>
        <style>
          body { font-family: sans-serif; padding:20px; }
          h1 { margin:0; font-size:18px; }
          .header { display:flex; flex-wrap: wrap; gap:12px; margin-bottom:16px; }
          .campo { flex:1 1 200px; font-size:12px; }
          .datos { font-weight:500; }
          .tabla { width:100%; border-collapse: collapse; margin-top:8px; }
          th, td { border:1px solid #444; padding:6px; font-size:11px; }
          thead { background:#efefef; }
          .lado { display:flex; gap:40px; margin-top:12px; }
          .resumen { flex:1; border:1px solid #666; padding:8px; font-size:12px; }
          .detalle-costos { float:right; width:220px; border:1px solid #666; padding:8px; font-size:12px; }
          .seccion-mas { margin-top:20px; }
          .linea { border-bottom:1px solid #ccc; height:18px; margin-bottom:4px; }
          .totales { margin-top:8px; }
          .etiqueta { width:120px; display:inline-block; }
          .cuadrados span { display:inline-block; width:14px; height:14px; margin-right:4px; border:1px solid #000; vertical-align:middle; }

            .detalle-costos {
    flex:1;
    max-width:260px;
    border:1px solid #555;
    border-radius:6px;
    padding:10px 12px;
    font-size:12px;
    background: #fafafa;

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
    //  letter-spacing:2px;
  }
  .linea-input {
    display:inline-block;
    border-bottom:1px solid #000;
    min-width:150px;
    padding:10 4px;
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
        <div class="header">
          <div class="campo"><div class="etiqueta">Responsables:___________________</div></div>

          <div style="font-size:12px;">Móvil: ${movil?.nombreMovil || ''} chapa: ${movil?.chapaMovil || ''} ,  Km Inicial:__________ Km Final__________ </div></div>
             <div style="font-size:12px;">Fecha envío: ${fecha}</div>


        </div>

        <table class="tabla">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Ciudad</th>
              <th>Cliente</th>
              <th>A cobrar</th>
              <th>Factura Nro.</th>
              <th>Cobro efectivo</th>
              <th>Cobro giro</th>
              <th>Cobro transferencia</th>
              <th>Pendiente</th>
              <th>Observación</th>
              <th>Evaluación
                <div style="margin-top:2px; display:flex; gap:4px; justify-content:center;">
                <div style="width:14px; height:14px; border:1px solid #000; background:#ff4d4f;  -webkit-print-color-adjust: exact; print-color-adjust: exact;"></div>
                <div style="width:14px; height:14px; border:1px solid #000; background:#faad14;  -webkit-print-color-adjust: exact; print-color-adjust: exact;"></div>
                <div style="width:14px; height:14px; border:1px solid #000; background:#52c41a;  -webkit-print-color-adjust: exact; print-color-adjust: exact;"></div>
              </div>
              </th>
            </tr>
          </thead>
          <tbody>
            ${filas}
          </tbody>
        </table>

       <div class="lado">
  <div class="resumen">
    <div class="totales">
      <div><span class="etiqueta">Sub total:</span> <span class="linea-input"></span></div>
      <div><span class="etiqueta">Gastos:</span> <span class="linea-input"></span></div>
      <div><span class="etiqueta">Saldo:</span> <span class="linea-input"></span></div>
    </div>
  </div>

  <div class="detalle-costos">
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
      <div class="valor">______________</div>
    </div>
  </div>
</div>

<div class="seccion-mas">
  <div class="subtitulo">De más:</div>
  <div class="notas">
    <div class="nota-line"><span class="linea-larga"></span></div>
    <div class="nota-line"><span class="linea-larga"></span></div>
    <div class="nota-line"><span class="linea-larga"></span></div>
    <div class="nota-line"><span class="linea-larga"></span></div>
  </div>
</div>


        <script>window.print();</script>
      </body>
    </html>
  `;

  win.document.write(contenido);
  win.document.close();
};
