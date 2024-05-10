import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Header from "./component/HeaderFooter/Headers";
import Footer from "./component/HeaderFooter/Footers";
import Breadcrumb from "./component/Breadcrumb/Breadcrumb";
import { Provider } from "react-redux";
import { store, persistor } from "./service/store";
import { PersistGate } from "redux-persist/integration/react";
import ChatBox from "./component/ChatBox/ChatBox";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Header />
          <Breadcrumb />
          <App />
          <ChatBox />
          <Footer />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
