import React from 'react'


export const GlobalContext = React.createContext({})

function GlobalProvider({ children }) {
  return (
    <GlobalContext.Provider value={{}}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider