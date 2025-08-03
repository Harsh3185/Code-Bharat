import React from 'react'
import { Outlet } from 'react-router-dom'
import AuthNavbar from '../Components/AuthNavbar'
import Footer from '../Components/Footer'

function LoginLayout() {
    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
            <AuthNavbar />
            <Outlet />
            <Footer />
        </div>
    )
}

export default LoginLayout