import { createRoot } from "react-dom/client";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

import App from "./App";

const root = createRoot(document.getElementById("root")!);
root.render(
<div>
  <section className="follow">
    <div className='air air1'></div>
    <div className='air air2'></div>
    <div className='air air3'></div>
    <div className='air air4'></div>
  </section>
  <App/>
</div>
);