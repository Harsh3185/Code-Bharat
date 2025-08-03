import React from 'react'
import Navbar from '../Components/Navbar.jsx'
import { Outlet } from 'react-router-dom'

function ProblemLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-[#0f0f0f] text-white">
            <Navbar />

            <main className="flex-1">
                <Outlet />
            </main>

        </div>
    )
}

export default ProblemLayout