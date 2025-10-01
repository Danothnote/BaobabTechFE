import { DataView } from "primereact/dataview";
import { useGetData } from "../hooks/useGetData";
import type { AuthUser, GetUsersData } from "../types/authTypes";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

type FilterOption<T> = T | { value: T | null } | null;

export const AllUsersPage = () => {
  const { data: users, isLoading } = useGetData<GetUsersData>("users/");
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterOption<string>>(null);
  const [verifiedFilter, setVerifiedFilter] =
    useState<FilterOption<boolean>>(null);
  const [statusFilter, setStatusFilter] = useState<FilterOption<string>>(null);
  const navigate = useNavigate();

  const onRowSelect = (user_id: string) => {
    navigate(`/userView/${user_id}/`);
  };

  const filteredUsers = useMemo(() => {
    if (!users?.data) return [];

    const currentRole =
      roleFilter !== null && typeof roleFilter === "object"
        ? roleFilter.value
        : roleFilter;
    const currentVerified =
      verifiedFilter !== null && typeof verifiedFilter === "object"
        ? verifiedFilter.value
        : verifiedFilter;
    const currentStatus =
      statusFilter !== null && typeof statusFilter === "object"
        ? statusFilter.value
        : statusFilter;

    return users.data.filter((user) => {
      const globalMatch =
        !globalFilter ||
        user.firstname.toLowerCase().includes(globalFilter.toLowerCase()) ||
        user.lastname.toLowerCase().includes(globalFilter.toLowerCase()) ||
        user.email!.toLowerCase().includes(globalFilter.toLowerCase());

      const roleMatch = currentRole === null || user.role === currentRole;
      const verifiedMatch =
        typeof currentVerified !== "boolean" ||
        user.is_verified === currentVerified;
      const statusMatch =
        currentStatus === null || user.status === currentStatus;

      return globalMatch && roleMatch && verifiedMatch && statusMatch;
    });
  }, [users, globalFilter, roleFilter, verifiedFilter, statusFilter]);

  const roleOptions = [
    { label: "Todos los Roles", value: null },
    { label: "Administrador", value: "admin" },
    { label: "Mercante", value: "merchant" },
    { label: "Usuario", value: "user" },
  ];

  const verifiedOptions = [
    { label: "Verificación (Todos)", value: null },
    { label: "Verificado", value: true },
    { label: "No Verificado", value: false },
  ];

  const statusOptions = [
    { label: "Estado (Todos)", value: null },
    { label: "Activo", value: "active" },
    { label: "Inactivo", value: "inactive" },
  ];

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap flex-column md:flex-row justify-content-between p-4 gap-3">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            className="w-full"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar por nombre o email..."
          />
        </IconField>

        <div className="flex flex-column md:flex-row gap-3 w-full md:w-8 justify-content-end">
          <Dropdown
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.value)}
            options={roleOptions}
            placeholder="Filtrar por Rol"
            className="w-full md:w-4"
          />

          <Dropdown
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.value)}
            options={verifiedOptions}
            placeholder="Filtrar por Verificación"
            className="w-full md:w-4"
          />

          <Dropdown
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.value)}
            options={statusOptions}
            placeholder="Filtrar por Estado"
            className="w-full md:w-4"
          />
        </div>
      </div>
    );
  };

  const header = renderHeader();

  const itemTemplate = (user: AuthUser) => {
    return (
      <div
        className="w-full md:w-20rem border-round-lg p-5 cursor-pointer"
        key={user._id}
        onClick={() => onRowSelect(user._id)}
        style={{ backgroundColor: "#1e1e1e" }}
      >
        <div>
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">
                {user.firstname} {user.lastname}
              </div>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i
                    className={
                      user.role === "admin"
                        ? "pi pi-crown"
                        : user.role === "merchant"
                        ? "pi pi-money-bill"
                        : "pi pi-user"
                    }
                  ></i>
                  <span className="font-semibold">{user.role}</span>
                </span>
              </div>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i className={"pi pi-envelope"}></i>
                  <span className="font-semibold">{user.email}</span>
                </span>
              </div>
              <div className="flex align-items-center gap-3">
                <Tag
                  severity={user.is_verified === true ? "success" : "danger"}
                  value={
                    user.is_verified === true
                      ? "Email Verificado"
                      : "Email NO Verificado"
                  }
                ></Tag>
              </div>
              <div className="flex align-items-center gap-3">
                <Tag
                  severity={user.status === "active" ? "success" : "danger"}
                  value={user.status}
                ></Tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const listTemplate = (users: AuthUser[] | null | undefined) => {
    if (!users || users.length === 0) return null;

    let list = users.map((user) => {
      return itemTemplate(user);
    });

    return <div className="grid grid-nogutter gap-5 m-5">{list}</div>;
  };

  return users ? (
    <DataView
      className="border-round-lg overflow-hidden my-3 products-data-view"
      value={filteredUsers}
      header={header}
      listTemplate={listTemplate}
      emptyMessage={"No existen usuarios"}
      loading={isLoading}
      rows={15}
      paginator
    />
  ) : (
    <h1 className="text-center">Ocurrio un error</h1>
  );
};
