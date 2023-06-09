import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Categoria,
  CompraDTO,
  Producto,
  Sucursal,
  Token,
} from "../../interfaces/interfaces";
import { RootState } from "../store";

interface LoginProps {
  usuarioOCorreo: string;
  contrasenia: string;
}

interface SignupProps {
  nombre: string;
  apellido: string;
  correo: string;
  contrasenia: string;
  telefono: string;
  rol: 0 | 1;
  eliminado: 0 | 1;
  bloqueado: 0 | 1;
  usuario: string;
}

interface AddressProps {
  direccion: string;
  ciudad: string;
  departamento: string;
  longitud: string;
  latitud: string;
  aclaracion: string;
}

interface ModificarCompradorProps {
  nombre: string;
  apellido: string;
  telefono: string;
}

interface ModificarStockProps {
  productoId: number;
  cantidad: number;
}
type AuthResponse = {
  token: string;
};

export const super5Api = createApi({
  reducerPath: "super5Api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8080/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["VentasPagadas", "VentasConfirmadas"],
  endpoints: (builder) => ({
    login: builder.mutation<string, LoginProps>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: AuthResponse, meta, arg) => {
        return response.token;
      },
    }),
    signup: builder.mutation<string, SignupProps>({
      query: (body) => ({
        url: "cliente/crear",
        method: "POST",
        body,
      }),
      transformResponse: (resp: AuthResponse, meta) => resp.token,
    }),
    getProductosPorSucursal: builder.query<Producto[], string>({
      query: (id) => `producto/obtenerPorSucursal/${id}`,
    }),
    getCategorias: builder.query<Categoria[], void>({
      query: () => "producto/listarCategorias",
    }),
    getSucursales: builder.query<Sucursal[], void>({
      query: () => "sucursal/obtener",
    }),
    addAddress: builder.mutation<Token, AddressProps>({
      query: (body) => ({
        url: "direccion/crear",
        method: "POST",
        body,
      }),
    }),
    generarCompraPaypal: builder.mutation<CompraDTO, CompraDTO>({
      query: (body) => ({
        url: "paypal/crear",
        method: "POST",
        body,
      }),
    }),
    generarPago: builder.mutation<CompraDTO | undefined, CompraDTO>({
      query: (body) => ({
        url: "venta/generarPago",
        method: "POST",
        body,
      }),
    }),
    modificarComprador: builder.mutation<Token, ModificarCompradorProps>({
      query: (body) => ({
        url: "cliente/modificarComprador",
        method: "POST",
        body,
      }),
    }),
    modificarStock: builder.mutation<string, ModificarStockProps>({
      query: (body) => ({
        url: "producto/modificarStock",
        method: "POST",
        body,
        responseHandler: (response) => response.text(),
      }),
      transformErrorResponse: (
        response: { status: number; data: string },
        meta,
        arg
      ) => {
        return response.data;
      },
    }),
    getVentas: builder.query<any[], void>({
      query: () => "venta/obtenerVentasPagas",
      providesTags: ["VentasPagadas"],
    }),
    getVentasConfirmadas: builder.query<any[], void>({
      query: () => "venta/obtenerVentasConfirmadas",
      providesTags: ["VentasConfirmadas"],
    }),
    confirmarVenta: builder.mutation<CompraDTO, CompraDTO>({
      query: (body) => ({
        url: "venta/confirmar",
        method: "POST",
        body,
      }),
      invalidatesTags: ["VentasPagadas", "VentasConfirmadas"],
    }),
    finalizarVenta: builder.mutation<CompraDTO, CompraDTO>({
      query: (body) => ({
        url: "venta/finalizar",
        method: "POST",
        body,
      }),
      invalidatesTags: ["VentasConfirmadas"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetProductosPorSucursalQuery,
  useLazyGetProductosPorSucursalQuery,
  useAddAddressMutation,
  useGetSucursalesQuery,
  useGenerarCompraPaypalMutation,
  useGenerarPagoMutation,
  useModificarCompradorMutation,
  useGetCategoriasQuery,
  useModificarStockMutation,
  useGetVentasQuery,
  useGetVentasConfirmadasQuery,
  useConfirmarVentaMutation,
  useFinalizarVentaMutation,
} = super5Api;
