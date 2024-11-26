import React, {createContext, useState} from "react";

export const DestinosContext = createContext();

export const DestinosProvider = ({children}) => {
    const [destinos, setDestinos] = useState([]);

    return (
        <DestinosContext.Provider value={{destinos, setDestinos}}>
            {children}
        </DestinosContext.Provider>
    );
};
