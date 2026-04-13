import { useState } from "react";
import "./App.css";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <button
                className="btn btn-primary"
                onClick={() => setCount(count + 1)}
            >
                Count: {count}{" "}
            </button>
        </>
    );
}

export default App;
