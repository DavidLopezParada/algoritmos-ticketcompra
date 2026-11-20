import { obtenerPorcentajeIva, calcularPrecioSinIva, calcularIva, calcularResultadoLinea, calcularTotales, calcularDesgloseIva } from "./ticket.helpers";
import { TipoIva, LineaTicket, ResultadoLineaTicket } from "./model";
import { calculaTicket } from "./ticket";

describe("obtenerPorcentajeIva", () => {
   
    it.each<[TipoIva, number]>([
        ["general",21],
        ["reducido",10],
        ["superreducidoA",5],
        ["superreducidoB",4],
        ["superreducidoC",0],
        ["sinIva",0],
    ])(
        "si el tipo de IVA es %s deveria devolver %s",
        (tipoIva: TipoIva, expected: number) => {
            //arrange

            //act
            const result = obtenerPorcentajeIva(tipoIva)

            //assert
            expect(result).toBe(expected)
        }
    );
});

describe("calcularPrecioSinIva", () => {
    it("Deberia multiplicar el precio del producto por su cantidad sin el Iva")
    //arrange
    const linea: LineaTicket = {
      producto: {
        nombre: "Perfume",
        precio: 20,
        tipoIva: "general",
      },
      cantidad: 3,
    };

    //act
    const result = calcularPrecioSinIva(linea)

    //assert
    const precioSinIva = 60
    expect(result).toBe(precioSinIva)
})

describe("calcularIva", () => {
    it("Deberia calcular el IVA de los productos con tipo general"),  () => {
    //arrange
    const precionSinIva = 60
    const tipoIva: TipoIva = "general"
    
    //act
    const result = calcularIva(precionSinIva, tipoIva)

    //assert
    const IvaEsperado = 12.6
    expect (result).toBe(IvaEsperado)
    };

    it("Deberia calcular el IVA de los productos con tipo reducido"),  () => {
    //arrange
    const precionSinIva = 50
    const tipoIva: TipoIva = "reducido"
    
    //act
    const result = calcularIva(precionSinIva, tipoIva)

    //assert
    const IvaEsperado = 5
    expect (result).toBe(IvaEsperado)
    };


})

describe("calcularResultadoLinea", () => {
  it("debería devolver la línea con el precio sin IVA y con IVA", () => {
    //arrange
    const linea: LineaTicket = {
      producto: { nombre: "Perfume", precio: 20, tipoIva: "general" },
      cantidad: 3,
    };

    //act
    const result = calcularResultadoLinea(linea);

    //assert
    const expected: ResultadoLineaTicket = {
      nombre: "Perfume",
      cantidad: 3,
      precionSinIva: 60,
      tipoIva: "general",
      precioConIva: 72.6,
    };
    expect(result).toEqual(expected);
  });

  it("debería devolver el mismo precio sin y con IVA si el IVA es 0", () => {
    //arrange
    const linea: LineaTicket = {
      producto: { nombre: "Leche", precio: 1, tipoIva: "superreducidoC" },
      cantidad: 6,
    };

    //act
    const result = calcularResultadoLinea(linea);

    //assert
    const expected: ResultadoLineaTicket = {
      nombre: "Leche",
      cantidad: 6,
      precionSinIva: 6,
      tipoIva: "superreducidoC",
      precioConIva: 6,
    };
    expect(result).toEqual(expected);
  });
});

describe("calcularTotales", () => {
  it("debería sumar los totales de todas las líneas", () => {
    //arrange
    const lineas: ResultadoLineaTicket[] = [
      { nombre: "Perfume", cantidad: 3, precionSinIva: 60, tipoIva: "general", precioConIva: 72.6 },
      { nombre: "Lasaña", cantidad: 1, precionSinIva: 5, tipoIva: "superreducidoA", precioConIva: 5.25 },
    ];

    //act
    const result = calcularTotales(lineas);

    //assert
    const expected = { totalSinIva: 65, totalConIva: 77.85, totalIva: 12.85 };
    expect(result).toEqual(expected);
  });
});

describe("calcularDesgloseIva", () => {
  it("debería sumar el IVA de las líneas que tienen el mismo tipo", () => {
    //arrange
    const lineas: ResultadoLineaTicket[] = [
      { nombre: "Legumbres", cantidad: 2, precionSinIva: 4, tipoIva: "general", precioConIva: 4.84 },
      { nombre: "Lasaña", cantidad: 1, precionSinIva: 5, tipoIva: "superreducidoA", precioConIva: 5.25 },
      { nombre: "Perfume", cantidad: 3, precionSinIva: 60, tipoIva: "general", precioConIva: 72.6 },
    ];

    //act
    const result = calcularDesgloseIva(lineas);

    //assert
    const expected = [
      { tipoIva: "general", cuantia: 13.44 },
      { tipoIva: "superreducidoA", cuantia: 0.25 },
    ];
    expect(result).toEqual(expected);
  });
});

describe("calculaTicket", () => {
  it("debería calcular el ticket completo de los productos de ejemplo", () => {
    //arrange
    const productos: LineaTicket[] = [
      { producto: { nombre: "Legumbres", precio: 2, tipoIva: "general" }, cantidad: 2 },
      { producto: { nombre: "Perfume", precio: 20, tipoIva: "general" }, cantidad: 3 },
      { producto: { nombre: "Leche", precio: 1, tipoIva: "superreducidoC" }, cantidad: 6 },
      { producto: { nombre: "Lasaña", precio: 5, tipoIva: "superreducidoA" }, cantidad: 1 },
    ];

    //act
    const result = calculaTicket(productos);

    //assert
    expect(result.total).toEqual({ totalSinIva: 75, totalConIva: 88.69, totalIva: 13.69 });
    expect(result.desgloseIva).toEqual([
      { tipoIva: "general", cuantia: 13.44 },
      { tipoIva: "superreducidoC", cuantia: 0 },
      { tipoIva: "superreducidoA", cuantia: 0.25 },
    ]);
    expect(result.lineas.length).toBe(4);
  });
});