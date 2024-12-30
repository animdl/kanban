import SunIcon from "./icons/SunIcon";
import MoonIcon from "./icons/MoonIcon";
import EllipsisIcon from "./icons/EllipsisIcon";

import { useState, useEffect } from "react";

function NavbarController() {

    // store dark mode in local storage
    const [darkMode, setDarkMode] = useState(() => {
        return JSON.parse(localStorage.getItem('darkMode') || 'false')
    });
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    return (
        <div>
            <div className="navbar h-16 bg-base-300">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">Kanban</a>
                </div>
                <div className="flex-none">

                    {/* theme toggle */}
                    <label className="grid cursor-pointer place-items-center">
                        <input
                            type="checkbox"
                            value="night"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                            className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1" />
                        <SunIcon />
                        <MoonIcon />
                    </label>
                    {/* menu */}
                    <button className="btn btn-square btn-ghost">
                        <EllipsisIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NavbarController;