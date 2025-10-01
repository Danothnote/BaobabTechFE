import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate, useParams } from "react-router";
import { loginStrings } from "../strings/loginStrings";
import { useEffect, useState } from "react";
import { usePostData } from "../hooks/usePostData";

export const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState<string>("Verificando tu cuenta...");
  const { trigger: verifyEmailTrigger } = usePostData(
    `auth/verify-email/${token}/`
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("Token de verificación no encontrado.");
      return;
    }

    const verifyAccount = async () => {
      try {
        await verifyEmailTrigger();
        setStatus(
          "Verificación exitosa, ya puede iniciar sesión con normalidad"
        );
      } catch (error) {
        console.error(error);
        setStatus("❌ Error: Fallo en la verificación.");
      }
    };

    verifyAccount();
  }, [token, navigate]);

  return (
    <div
      className="flex min-h-screen justify-content-center align-items-center p-3 bg-cover bg-bottom"
      style={{ backgroundImage: `url(${loginStrings.imageUrl})` }}
    >
      <Card
        title="Verificación de cuenta"
        className="max-w-30rem max-h-max text-center px-2 pt-6 pb-4"
        style={{ opacity: 0.96 }}
      >
        <div className="flex flex-column justify-content-center">
          <p>{status}</p>
          <Button
            className="w-full mt-5"
            icon="pi pi-user"
            label="Ir al Inicio de Sesión"
            onClick={() => navigate("/login")}
          />
        </div>
      </Card>
    </div>
  );
};
