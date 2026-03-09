import { useState, useEffect } from "react";
import { OutletContext, useNavigate } from "react-router-dom";
import Nav from "./nav.jsx";

// this is where i put in all components
// put loaded feed here + mini profile view

function Hub() {
  return (
    <div>
      <Nav />
      {/* context is where it will load whatever is clicked from nav */}
      <OutletContext context={{}} />
    </div>
  );
}

export default Hub;
