import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Categoria,
  CompraDTO,
  Direccion,
  Producto,
  ReclamoDTO,
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
  fechaNacimiento: Date;
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
  fechaNacimiento: Date;
}

interface ModificarStockProps {
  productoId: number;
  cantidad: number;
}
type AuthResponse = {
  token: string;
};

interface UserDataProps {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  fechaNacimiento: Date;
  rol: 0 | 1;
  eliminado: 0 | 1;
  bloqueado: 0 | 1;
  usuario: string;
  direcciones: Direccion[];
}
interface ModificarContrasenaProps {
  guid: string;
  contrasena: string;
  contrasenaRepeticion: string;
}

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
  tagTypes: ["VentasPagadas", "VentasConfirmadas", "UserData", "AtenderReclamo", "Direccion"],
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
    recuperarContrasena: builder.mutation<string, string>({
      query: (body) => ({
        url: "auth/generarRecuperacionContrasena",
        method: "POST",
        body,
      })
    }),
    modificarContrasena: builder.mutation<any, ModificarContrasenaProps>({
      query: (body) => ({
        url: "auth/modificarContrasena",
        method: "POST",
        body,
      })
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
    getUserData: builder.query<UserDataProps, void>({
      query: () => "usuario/obtenerUsuario",
      providesTags: ["UserData"]
    }),
    addAddress: builder.mutation<Token, AddressProps>({
      query: (body) => ({
        url: "direccion/crear",
        method: "POST",
        body,
      }),
    }),
    getDirecciones: builder.query<Direccion[], void>({
      query: () => "direccion/listar",
      providesTags: ["Direccion"],
    }),
    eliminarDireccion: builder.mutation<any, any>({
      query: (body) => ({
        url: "direccion/eliminar",
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
    crearReclamo: builder.mutation<Token, ReclamoDTO>({
      query: (body) => ({
        url: "reclamo/crear",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserData"]
    }),
    modificarComprador: builder.mutation<Token, ModificarCompradorProps>({
      query: (body) => ({
        url: "cliente/modificarComprador",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserData"]
    }),
    modificarDireccion: builder.mutation<Token, Direccion>({
      query: (body) => ({
        url: "direccion/modificar",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Direccion"]
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
    getCompras: builder.query<any[], void>({
      query: () => "venta/listar",
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
    getReclamos: builder.query<ReclamoDTO[], void>({
      query: () => "reclamo/listar",
      providesTags: ["AtenderReclamo"],
    }),
    atenderReclamo: builder.mutation<ReclamoDTO, ReclamoDTO>({
      query: (body) => ({
        url: "reclamo/atender",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AtenderReclamo"],
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
  useGetUserDataQuery,
  useGetVentasQuery,
  useGetVentasConfirmadasQuery,
  useConfirmarVentaMutation,
  useFinalizarVentaMutation,
  useGetComprasQuery,
  useCrearReclamoMutation,
  useGetDireccionesQuery,
  useEliminarDireccionMutation,
  useModificarDireccionMutation,
  useGetReclamosQuery,
  useAtenderReclamoMutation,
  useRecuperarContrasenaMutation,
  useModificarContrasenaMutation,
} = super5Api;
