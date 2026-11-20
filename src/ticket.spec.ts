import { LineaTicket } from "./model";
import { calculaTicket } from "./ticket";

describe("calculaTicket", () => {
  it("debería calcular el ticket completo de los productos de ejemplo", () => {
    // Arrange
    const productos: LineaTicket[] = [
      { producto: { nombre: "Legumbres", precio: 2, tipoIva: "general" }, cantidad: 2 },
      { producto: { nombre: "Perfume", precio: 20, tipoIva: "general" }, cantidad: 3 },
      { producto: { nombre: "Leche", precio: 1, tipoIva: "superreducidoC" }, cantidad: 6 },
      { producto: { nombre: "Lasaña", precio: 5, tipoIva: "superreducidoA" }, cantidad: 1 },
    ];

    // Act
    const result = calculaTicket(productos);

    // Assert
    expect(result.total).toEqual({ totalSinIva: 75, totalConIva: 88.69, totalIva: 13.69 });
    expect(result.desgloseIva).toEqual([
      { tipoIva: "general", cuantia: 13.44 },
      { tipoIva: "superreducidoC", cuantia: 0 },
      { tipoIva: "superreducidoA", cuantia: 0.25 },
    ]);
    expect(result.lineas.length).toBe(4);
  });
});