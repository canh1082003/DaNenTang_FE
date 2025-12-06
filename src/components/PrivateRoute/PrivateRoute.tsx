import { ReactNode, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getToken } from "../../Utils/getToken";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isLoggedIn = getToken();
  const navigate = useNavigate();
    const hasShownToast = useRef(false);
  useEffect(() => {
    if (!isLoggedIn) {
     if (!hasShownToast.current) {
      toast.error("Vui lòng đăng nhập trước khi tiếp tục!");
      hasShownToast.current = true;
    }
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // Nếu chưa login → tạm thời không render gì
  if (!isLoggedIn) return null;

  return <>{children}</>;
};

export default PrivateRoute;
