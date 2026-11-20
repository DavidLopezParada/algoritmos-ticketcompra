import { LineaTicket, ResultadoLineaTicket, TicketFinal } from "./model";
import { calcularResultadoLinea, calcularTotales, calcularDesgloseIva } from "./ticket.helpers";



export const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
   const lineas: ResultadoLineaTicket[] = [];
  
  for (let i = 0; i < lineasTicket.length; i++) {
      lineas.push(calcularResultadoLinea(lineasTicket[i]));
  }

  const total = calcularTotales(lineas);
  const desgloseIva = calcularDesgloseIva(lineas);

  return {
    lineas: lineas,
    total: total,
    desgloseIva: desgloseIva,
  }
};