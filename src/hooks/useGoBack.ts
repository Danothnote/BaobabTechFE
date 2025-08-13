import { useNavigate } from "react-router";

export const useGoBack = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return goBack;
};