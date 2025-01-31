import { Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";
import { RoutesUsuarios } from "../usuarios/routes/RoutesUsuarios";
import { DashboardSucursalesPage } from "../sucursales/pages/DashboardSucursalesPage";
import { TipoUsuario } from "../interfaces/interfaces";
import { ModificarContrasena } from "../auth/pages/ModificarContrasena";

import { DashboardAdministradores } from "../administradores/pages/DashboardAdministradores";

export const Super5Routes = () => {
  const { tipoUsuario } = useAppSelector((state) => state.auth);

  return (
    <>
      <Routes>
        {tipoUsuario === TipoUsuario.Invitado && (
          <Route
            path="modificarcontrasena/*"
            element={<ModificarContrasena />}
          />
        )}
        {(tipoUsuario === TipoUsuario.Comprador ||
          tipoUsuario === TipoUsuario.Invitado) && (
          <Route path="*" element={<RoutesUsuarios />} />
        )}
        {tipoUsuario === TipoUsuario.Sucursal && (
          <>
            <Route path="sucursal/*" element={<DashboardSucursalesPage />} />
            <Route path="*" element={<Navigate to="sucursal" />} />
          </>
        )}
        {tipoUsuario === TipoUsuario.Administrador && (
          <>
            <Route
              path="administrador/*"
              element={<DashboardAdministradores />}
            />
            <Route path="*" element={<Navigate to="administrador" />} />
          </>
        )}
      </Routes>
    </>
  );
};
