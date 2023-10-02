import React from "react";
import UserMenu from "../components/navbar/UserMenu";
import ModalsProvider from "../providers/ModalsProvider";
import ToasterProvider from "../providers/ToasterProvider";

const App = () => {

  return (
        <div>
          <ToasterProvider />
          <ModalsProvider />
          <UserMenu />
        </div>
  )
}

export default App;
