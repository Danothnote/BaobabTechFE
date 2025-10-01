import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Menu } from "primereact/menu";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import type { MenuItem } from "primereact/menuitem";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import { ProgressSpinner } from "primereact/progressspinner";
import { navbarStrings } from "../strings/navbarStrings";
import type { MenuLink } from "../types/navbarTypes";
import { Divider } from "primereact/divider";
import { Badge } from "primereact/badge";
import { useGetData } from "../hooks/useGetData";
import type { CartItem } from "../types/productTypes";

export const NavbarComponent = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [cartBadge, setCartBadge] = useState(0);
  const { isAuthenticated, user, logout, loading } = useAuth();
  const { data: cartData } = useGetData<{ message: String; data: CartItem[] }>(
    isAuthenticated ? "cart/" : null
  );
  const navigate = useNavigate();
  const menu = useRef<Menu>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (cartData) {
      setCartBadge(cartData.data.length);
    }
  }, [cartData]);

  const scrollToFooter = () => {
    const footerElement = document.getElementById(navbarStrings.pages[2].id);
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fillProfileMenuItems = () => {
    let profileMenuItems: MenuItem[] = [];
    navbarStrings.profileMenu.map((item: MenuLink) => {
      if (item.id === navbarStrings.profileMenu[4].id) {
        profileMenuItems.push({ separator: true });
      }

      if (
        (user?.role === "admin" || item.id !== "allUsersLink") &&
        (user?.role === "admin" || item.id !== "newCategoryLink") &&
        (user?.role === "merchant" || item.id !== "myProductsLink") &&
        (user?.role === "merchant" || item.id !== "newProductLink")
      ) {
        profileMenuItems.push({
          label: item.label,
          icon: item.icon,
          command:
            item.id === "logout"
              ? async () => {
                  await logout();
                  navigate(item.page);
                  toast.current!.show({
                    severity: "success",
                    summary: "Completo",
                    detail: "Cierre de sesión exitoso!",
                  });
                }
              : () => navigate(item.page),
        });
      }
    });

    return profileMenuItems;
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex align-items-center bg-primary shadow-2 text-white h-3rem px-5 custom-menubar sm: justify-content-between">
        <div className="md:hidden mr-2">
          <Button
            icon="pi pi-bars"
            className="p-button-secondary p-button-text text-white"
            onClick={() => setSidebarVisible(true)}
          />
        </div>

        <img
          alt={navbarStrings.logo.alt}
          src={navbarStrings.logo.src}
          height="30"
          className="cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="ml-3 flex align-items-center gap-2">
          <div className="hidden md:flex gap-3">
            {navbarStrings.pages.map((item: MenuLink) => (
              <Button
                key={item.id}
                label={item.label}
                link
                onClick={
                  item.id === navbarStrings.pages[2].id
                    ? scrollToFooter
                    : () => navigate(item.page)
                }
                className="p-button-text text-white"
              />
            ))}
          </div>

          {loading ? (
            <ProgressSpinner
              style={{ width: "30px", height: "30px" }}
              strokeWidth="8"
              animationDuration=".7s"
            />
          ) : isAuthenticated ? (
            <div className="flex align-items-center w-max">
              <div
                onClick={(event) => menu.current?.toggle(event)}
                className="flex align-items-center gap-3 cursor-pointer"
              >
                <span className="text-white hidden sm:inline">
                  {navbarStrings.greetings.label} {user?.firstname}
                </span>
                <Avatar
                  icon="pi pi-user"
                  image={user?.profile_picture}
                  shape="circle"
                  className="cursor-pointer custom-avatar"
                  aria-haspopup
                />
                <Menu model={fillProfileMenuItems()} popup ref={menu} />
              </div>

              <div
                className="relative cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <Button
                  icon="pi pi-shopping-cart"
                  rounded
                  aria-label="Carrito de compras"
                  className="w-2rem h-2rem ml-3"
                />
                {isAuthenticated && cartBadge > 0 && (
                  <Badge
                    className="absolute"
                    style={{ bottom: "-5px", right: "-9px" }}
                    value={cartBadge}
                    severity={"danger"}
                  />
                )}
              </div>
            </div>
          ) : (
            <Button
              label={navbarStrings.loginButton.label}
              icon="pi pi-user"
              className="p-button-primary"
              onClick={() => navigate("/login")}
            />
          )}
        </div>
      </div>
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="w-16rem"
      >
        <h2 className="pl-3">Menú</h2>
        {navbarStrings.pages.map((item: MenuLink) => (
          <Button
            key={item.id}
            label={item.label}
            icon={item.icon}
            className="p-button-text text-white pl-3 my-1 w-full text-left gap-2"
            onClick={
              item.id === navbarStrings.pages[2].id
                ? () => {
                    scrollToFooter();
                    setSidebarVisible(false);
                  }
                : () => {
                    navigate(item.page);
                    setSidebarVisible(false);
                  }
            }
          />
        ))}

        {isAuthenticated && (
          <>
            <Divider />
            <h2 className="pl-3">Perfil</h2>
            {navbarStrings.profileMenu.map((item: MenuLink) => {
              if (
                (user?.role === "admin" || item.id !== "allUsersLink") &&
                (user?.role === "merchant" || item.id !== "myProductsLink") &&
                (user?.role === "merchant" || item.id !== "newProductLink")
              ) {
                return (
                  <Button
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    className="p-button-text text-white pl-3 my-1 w-full text-left gap-2"
                    onClick={async () => {
                      if (item.id === "logout") {
                        await logout();
                        toast.current!.show({
                          severity: "success",
                          summary: "Completo",
                          detail: "Cierre de sesión exitoso!",
                          life: 3000,
                        });
                      }
                      navigate(item.page);
                      setSidebarVisible(false);
                    }}
                  />
                );
              }
              return null;
            })}
          </>
        )}
      </Sidebar>
    </>
  );
};
