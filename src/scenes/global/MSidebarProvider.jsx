import { useState, createContext, useContext } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import MSidebar from "./MSidebar";

const SidebarContext = createContext({});

export const MSidebarProvider = ({ children }) => {
    const [sidebarRTL, setSidebarRTL] = useState(false);
    const [sidebarBackgroundColor, setSidebarBackgroundColor] =
        useState(undefined);
    const [sidebarImage, setSidebarImage] = useState(undefined);
    return (
        <ProSidebarProvider>
            <SidebarContext.Provider
                value={{
                    sidebarBackgroundColor,
                    setSidebarBackgroundColor,

                    sidebarImage,
                    setSidebarImage,

                    sidebarRTL,
                    setSidebarRTL,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: sidebarRTL ? "row-reverse" : "row",
                    }}
                >
                    <MSidebar />
                    {children}
                </div>
            </SidebarContext.Provider>
        </ProSidebarProvider>
    );
};

export const useSidebarContext = () => useContext(SidebarContext);
