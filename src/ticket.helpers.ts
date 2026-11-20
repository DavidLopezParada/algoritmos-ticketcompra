import { TipoIva, LineaTicket, ResultadoLineaTicket, ResultadoTotalTicket, TotalPorTipoIva} from "./model"

export const obtenerPorcentajeIva = (tipoIva : TipoIva): number => {
  switch (tipoIva) {
     case "general":
      return 21;
    case "reducido":
      return 10;
    case "superreducidoA":
      return 5;
    case "superreducidoB":
      return 4;
    case "superreducidoC":
      return 0;
    case "sinIva":
      return 0;
  }
};

export const calcularPrecioSinIva = (linea: LineaTicket): number => {
 const precio = linea.producto.precio;
 const cantidad = linea.cantidad;
 const precionSinIva = precio * cantidad;

 return precionSinIva
};


export const calcularIva = (precioSinIva: number, tipoIva: TipoIva): number => {
  const porcentaje = obtenerPorcentajeIva(tipoIva);
  const iva = (precioSinIva * porcentaje) / 100;

  return Number(iva.toFixed(2));
};

export const calcularResultadoLinea = (
  linea: LineaTicket
): ResultadoLineaTicket => {
  const precioSinIva = calcularPrecioSinIva(linea);
  const iva = calcularIva(precioSinIva, linea.producto.tipoIva);
  const precioConIva = Number((precioSinIva + iva).toFixed(2));

  return {
    nombre: linea.producto.nombre,
    cantidad: linea.cantidad,
    precionSinIva: precioSinIva,
    tipoIva: linea.producto.tipoIva,
    precioConIva: precioConIva,
  };
};

export const calcularTotales = (
  lineas: ResultadoLineaTicket[]
): ResultadoTotalTicket => {
  let totalSinIva = 0;
  let totalConIva = 0;

  for (let i = 0; i < lineas.length; i++) {
    totalSinIva = totalSinIva + lineas[i].precionSinIva;
    totalConIva = totalConIva + lineas[i].precioConIva;
  }

  const totalIva = totalConIva - totalSinIva;

  return {
    totalSinIva: Number(totalSinIva.toFixed(2)),
    totalConIva: Number(totalConIva.toFixed(2)),
    totalIva: Number(totalIva.toFixed(2)),
  };
};

export const calcularDesgloseIva = (
  lineas: ResultadoLineaTicket[]
): TotalPorTipoIva[] => {
  const desglose: TotalPorTipoIva[] = [];

  for (let i = 0; i < lineas.length; i++) {
    const iva = calcularIva(lineas[i].precionSinIva, lineas[i].tipoIva);
    let encontrado = false;

    for (let j = 0; j < desglose.length; j++) {
      if (desglose[j].tipoIva === lineas[i].tipoIva) {
        desglose[j].cuantia = Number((desglose[j].cuantia + iva).toFixed(2));
        encontrado = true;
        break;
      }
    }

    if (!encontrado) {
      desglose.push({ tipoIva: lineas[i].tipoIva, cuantia: iva });
    }
  }

  return desglose;
};