import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { userProfileStrings } from "../strings/userProfileStrings";
import { useAuth } from "../hooks/useAuth";
import { Image } from "primereact/image";
import type { AuthUser } from "../types/authTypes";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { Avatar } from "primereact/avatar";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { useUpdateData } from "../hooks/useUpdateData";
import { DialogComponent } from "../components/DialogComponent";

export const UserProfilePage = () => {
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const {
    user,
    logout,
    loading,
    updateDataUser,
    updateFilesUser,
    refreshUser,
  } = useAuth();
  const { trigger: deactivateUserTrigger, isLoading: isDeactivating } =
    useUpdateData("users/deactivate");
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editedUser, setEditedUser] = useState<AuthUser>(
    user || ({} as AuthUser)
  );
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

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
    await updateDataUser({ [dataKey]: editedUser[dataKey] });
    setEditMode({ ...editMode, [dataKey]: false });
    await refreshUser();
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
      await updateFilesUser({ data: formData });
      await refreshUser();
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!user) return;

    try {
      await deactivateUserTrigger({
        data_id: `/${user._id}`,
        dataToPatch: {},
      });
      logout();
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

  return (
    <div
      className="flex min-h-screen justify-content-center align-items-center p-3 bg-cover bg-bottom"
      style={{ backgroundImage: `url(${userProfileStrings.imageUrl})` }}
    >
      <Toast ref={toast} />
      <Card
        title={userProfileStrings.title}
        className="max-h-max text-center px-2 pt-6 pb-4"
        style={{ opacity: 0.96 }}
      >
        {user &&
          (loading ? (
            <ProgressSpinner />
          ) : (
            <div className="flex flex-column justify-content-center gap-5">
              <div className="flex flex-wrap justify-content-center align-items-center p-4 gap-5">
                <div className="relative">
                  {user.profile_picture ? (
                    <Image
                      src={user.profile_picture}
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
                    ];

                    const alwaysVisibleFields = ["email", "role"];

                    if (
                      !editableFields.includes(dataKey) &&
                      !alwaysVisibleFields.includes(dataKey)
                    ) {
                      return null;
                    }

                    if (user && user[dataKey] !== undefined) {
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
                  />
                  <Button
                    label={userProfileStrings.deactivateButton}
                    icon="pi pi-trash"
                    severity="danger"
                    onClick={() => setShowDeactivateDialog(true)}
                  />
                </div>
                <Button
                  label={userProfileStrings.primaryButton}
                  icon="pi pi-sign-out"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                />
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
