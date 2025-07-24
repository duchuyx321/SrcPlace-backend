import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRouter from "~/AppRouter";
import { useInitUserAuth, useToastDuration } from "~/Hooks";
import ModalLayer from "~/Layouts/ModalLayer/ModalLayer";

function App() {
    useInitUserAuth();
    useToastDuration();
    return (
        <Router>
            {/* router */}
            <AppRouter />
            {/* add model toast message */}
            {/* toast */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                pauseOnHover
                // draggable = {}
            />
            {/* modal custom */}
            <ModalLayer />
        </Router>
    );
}

export default App;
