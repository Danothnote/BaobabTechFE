import { Button } from "primereact/button";
import { DialogComponent } from "../components/DialogComponent";
import { Calendar } from "primereact/calendar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { userProfileStrings } from "../strings/userProfileStrings";
import { showToast } from "../helpers/showToast";
import type { AuthUser } from "../types/authTypes";
import { useEffect, useRef, useState } from "react";
import { usePostData } from "../hooks/usePostData";
import { useUpdateData } from "../hooks/useUpdateData";
import { useNavigate, useParams } from "react-router";
import { Image } from "primereact/image";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { useGetData } from "../hooks/useGetData";
import { Dropdown } from "primereact/dropdown";

export const UserViewPage = () => {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const { user_id } = useParams<{ user_id: string }>();
  const {
    data: user,
    isLoading,
    mutate: refreshUser,
  } = useGetData<{
    message: string;
    data: AuthUser;
  }>(`users/by_id/${user_id}`);
  const { trigger: updateUserTrigger, isLoading: isUpdating } =
    useUpdateData("users/by_id/data");
  const { trigger: updateFilesUserTrigger, isLoading: isUpdatingFile } =
    useUpdateData("users/by_id/files");
  const { trigger: deactivateUserTrigger, isLoading: isDeactivating } =
    useUpdateData("users/deactivate");
  const { trigger: forgotPasswordTrigger, isLoading: isSendingEmail } =
    usePostData("auth/forgot-password");
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editedUser, setEditedUser] = useState<AuthUser>(
    user?.data || ({} as AuthUser)
  );
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (user) {
      setEditedUser(user.data);
    }
  }, [user]);

  const roleOptions = [
    { label: "Administrador", value: "admin" },
    { label: "Comerciante", value: "merchant" },
    { label: "Usuario", value: "user" },
  ];

  const handleEditClick = (dataKey: keyof AuthUser) => {
    setEditMode({ ...editMode, [dataKey]: true });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    dataKey: keyof AuthUser
  ) => {
    setEditedUser({ ...editedUser, [dataKey]: e.target.value });
  };

  const handleConfirmClick = async (dataKey: keyof AuthUser) => {
    if (!user) return;

    try {
      await updateUserTrigger({
        data_id: `/${user.data._id}`,
        dataToPatch: { [dataKey]: editedUser[dataKey] },
      });
      setEditMode({ ...editMode, [dataKey]: false });
      await refreshUser();
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Campo actualizado exitosamente.",
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar el campo.",
      });
    }
  };

  const handleProfilePictureChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("new_img_upload", file);

      if (!user) return;

      try {
        await updateFilesUserTrigger({
          data_id: `/${user.data._id}`,
          dataToPatch: formData,
        });
        await refreshUser();
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Imagen de perfil actualizada exitosamente.",
        });
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo actualizar la imagen de perfil.",
        });
      }
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!user) return;

    try {
      await deactivateUserTrigger({
        data_id: `/${user.data._id}`,
        dataToPatch: {},
      });
      navigate("/");
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Cuenta desactivada exitosamente.",
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo desactivar la cuenta.",
      });
    } finally {
      setShowDeactivateDialog(false);
    }
  };

  const handleChangePassword = async (email: string) => {
    try {
      await forgotPasswordTrigger({
        email: email,
      });
      showToast(
        toast,
        "success",
        "Restablecimiento",
        "Se ha enviado un correo de restablecimiento"
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="flex min-h-screen justify-content-center align-items-center p-3 bg-cover bg-bottom"
      style={{ backgroundImage: `url(${userProfileStrings.imageUrl})` }}
    >
      <Toast ref={toast} />
      <Card
        title={"Datos del usuario"}
        className="max-h-max text-center px-2 pt-6 pb-4"
        style={{ opacity: 0.96 }}
      >
        {user &&
          (isLoading || isUpdating || isUpdatingFile ? (
            <ProgressSpinner />
          ) : (
            <div className="flex flex-column justify-content-center gap-5">
              <div className="flex flex-wrap justify-content-center align-items-center p-4 gap-5">
                <div className="relative">
                  {user.data.profile_picture ? (
                    <Image
                      src={user.data.profile_picture}
                      alt="Profile Picture"
                      imageClassName="border-circle w-15rem h-15rem"
                      imageStyle={{ objectFit: "cover" }}
                      preview
                    />
                  ) : (
                    <Avatar
                      icon="pi pi-user"
                      size="xlarge"
                      className="w-15rem h-15rem"
                      shape="circle"
                    />
                  )}
                  <Button
                    className="absolute bottom-0"
                    style={{ right: "10px" }}
                    icon="pi pi-pencil"
                    rounded
                    onClick={handleProfilePictureChange}
                    loading={isUpdatingFile}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                </div>
                <div>
                  {Object.keys(userProfileStrings.userLabels).map((key) => {
                    const dataKey =
                      key as keyof typeof userProfileStrings.userLabels &
                        keyof AuthUser;

                    const editableFields = [
                      "firstname",
                      "lastname",
                      "birth_date",
                      "role",
                    ];

                    const alwaysVisibleFields = ["email"];

                    if (
                      !editableFields.includes(dataKey) &&
                      !alwaysVisibleFields.includes(dataKey)
                    ) {
                      return null;
                    }

                    if (user.data && user.data[dataKey] !== undefined) {
                      const isEditing =
                        editableFields.includes(dataKey) && editMode[dataKey];

                      return (
                        <div
                          key={dataKey}
                          className="flex gap-2 py-1 align-items-center"
                        >
                          <span className="font-bold text-lg">
                            {userProfileStrings.userLabels[dataKey]}
                          </span>
                          {isEditing ? (
                            <div className="flex gap-2 align-items-center">
                              {dataKey === "birth_date" ? (
                                <Calendar
                                  value={
                                    editedUser[dataKey]
                                      ? new Date(editedUser[dataKey])
                                      : null
                                  }
                                  onChange={(e) =>
                                    setEditedUser({
                                      ...editedUser,
                                      birth_date: e.value
                                        ? (e.value as Date).toISOString()
                                        : null,
                                    })
                                  }
                                  dateFormat="yy-mm-dd"
                                />
                              ) : dataKey === "role" ? (
                                <Dropdown
                                  value={
                                    editedUser[dataKey] as
                                      | "admin"
                                      | "merchant"
                                      | "user"
                                  }
                                  options={roleOptions}
                                  onChange={(e) =>
                                    setEditedUser({
                                      ...editedUser,
                                      role: e.value,
                                    })
                                  }
                                  placeholder="Seleccionar un rol"
                                />
                              ) : (
                                <InputText
                                  value={editedUser[dataKey] as string}
                                  onChange={(e) => handleChange(e, dataKey)}
                                />
                              )}
                              <Button
                                icon="pi pi-check"
                                rounded
                                severity="success"
                                onClick={() => handleConfirmClick(dataKey)}
                                loading={isUpdating}
                              />
                              <Button
                                icon="pi pi-times"
                                rounded
                                severity="danger"
                                onClick={() =>
                                  setEditMode({ ...editMode, [dataKey]: false })
                                }
                              />
                            </div>
                          ) : (
                            <div className="flex gap-2 align-items-center">
                              <span className="text-lg">
                                {dataKey === "birth_date"
                                  ? editedUser[dataKey] &&
                                    !Number.isNaN(
                                      new Date(editedUser[dataKey] as string)
                                    )
                                    ? new Date(
                                        editedUser[dataKey] as string
                                      ).toLocaleDateString()
                                    : null
                                  : editedUser[dataKey]}
                              </span>
                              {editableFields.includes(dataKey) && (
                                <Button
                                  icon="pi pi-pencil"
                                  rounded
                                  text
                                  onClick={() => handleEditClick(dataKey)}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
              <div className="flex flex-column align-items-center px-4 gap-4">
                <div className="flex flex-wrap justify-content-center gap-4">
                  <Button
                    label={userProfileStrings.secondaryButton}
                    icon="pi pi-key"
                    severity="warning"
                    loading={isSendingEmail}
                    onClick={() => handleChangePassword(user.data.email!)}
                  />
                  <Button
                    label={userProfileStrings.deactivateButton}
                    icon="pi pi-trash"
                    severity="danger"
                    onClick={() => setShowDeactivateDialog(true)}
                  />
                </div>
              </div>
            </div>
          ))}
      </Card>
      <DialogComponent
        title="Confirmar Desactivación de Cuenta"
        visible={showDeactivateDialog}
        onHide={() => setShowDeactivateDialog(false)}
        confirmButtonLabel="Desactivar"
        confirmButtonAction={handleDeactivateConfirm}
        confirmButtonLoading={isDeactivating}
        cancelButtonLabel="Cancelar"
        cancelButtonAction={() => setShowDeactivateDialog(false)}
        bodyComponent={
          <p className="text-xl px-4">
            ¿Estás seguro de que deseas desactivar tu cuenta? Esta acción se
            revocará al iniciar sesión nuevamente.
          </p>
        }
      />
    </div>
  );
};
