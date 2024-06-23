"use client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import {Toast, ToastMessage} from "primereact/toast";
import {createContext, useContext, useRef, useState} from "react";
import {Product} from "@/interfaces/product";
import {Messages, MessagesMessage} from "primereact/messages";
import {Category} from "@/interfaces/category";

interface ToastContextType {
    showToast: (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail?: string) => void;
    product: Product | null;
    setProduct: (product: Product) => void;
    category: Category | null;
    setCategory: (category: Category) => void;
    addErrorMessages: (messages: string[]) => void;
}

const AppContext = createContext<ToastContextType | undefined>(undefined);

export const AppContextProvider = ({ children }:Readonly<{
    children: React.ReactNode;
}>) => {

    const toastRef = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [category, setCategory] = useState<Category | null>(null);

    const showToast = (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail?: string) => {
        if (!toastRef.current) return;
        toastRef.current?.show({ severity, summary, detail });
    };

    const addErrorMessages = (messages: string[]) => {
        msgs.current?.clear()
        msgs.current?.show(messages.map(value => {
            let message: MessagesMessage =  { severity: 'error', summary: 'Error', detail: value, sticky: true, closable: true}
            return message
        }));
    };

    return (
        <AppContext.Provider value={{showToast, addErrorMessages, product, setProduct, category, setCategory}}>
            <Toast ref={toastRef} position="top-right"/>
            <div className="px-5">
                <Messages ref={msgs}/>

                {children}
            </div>
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error(
            "useToastContext have to be used within ToastContextProvider"
        );
    }

    return context;
};