import AuthContext from "../../../context/auth.context";

import { useContext, useState } from 'react';
import {
    Dialog,
    DialogPanel,
} from '@headlessui/react';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import { NavLink, Outlet } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { LogoComponent } from '../../../components/common/image';
import { FaGear } from 'react-icons/fa6';

const CustomerLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const auth = useContext(AuthContext);

    const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);

    return (
        <>
            <header className="bg-blue-400">
                <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <LogoComponent />
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <HiBars3 className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center space-x-4">
                        <div className="relative">
                            <button
                                type="button"
                                className="flex items-center text-white"
                                onClick={handleDropdownToggle}
                            >
                                <FaUser className="h-6 w-6" aria-hidden="true" />
                                {/* {auth.loggedInUser.name} */}
                                <span className="ms-2">{auth.loggedInUser.name}</span>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                                    <ul className="py-1">
                                        <li>
                                            <NavLink
                                                to="/customer/manage-account"
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Manage Account
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/logout"
                                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
                <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
                    <div className="fixed inset-0 z-10" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-950 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5 text-white">
                                Logo
                            </a>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <HiXMark className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {/* Mobile menu links */}
                                </div>
                                <div className="py-6">
                                    <a
                                        href="#"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-50"
                                    >
                                        Log Out
                                    </a>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>
            <div className="flex">
                <div className="flex h-screen w-16 flex-col justify-between border-e bg-blue-400">
                    <div>
                        <div className="border-t border-gray-100">
                            <div className="px-2">
                                <div className="py-4">
                                    <a
                                        href="#"
                                        className="t group relative flex justify-center rounded bg-blue-50 px-2 py-1.5 text-blue-700"
                                    >
                                        <FaGear />
                                        <span
                                            className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                                        >
                                            Setting
                                        </span>
                                    </a>
                                </div>
                                <ul className="space-y-1 border-t border-gray-100 pt-4">
                                    {/* Navigation links */}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-gray-950 p-2">
                        <form action="#">
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-5 opacity-75"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                <span
                                    className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                                >
                                    Logout
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
                <div className="flex h-screen w-full flex-col justify-between px-20 py-10">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default CustomerLayout;
