import React from 'react'
import { NavLink } from 'react-router-dom'

interface Props {
    // option: {
    //     to: string;
    //     icon: string;
    //     title: string;
    //     description: string;
    //     component: JSX.Element;
    // };
    to: string;
    icon: string;
    title: string;
    description: string;
}

export const SidebarMenuItem = ({to, icon, title, description}: Props) => {// Documentacion en https://react.dev/learn/typescript. option es una propiedad de componente SidebarMenuItem
  return (
    <NavLink
        to={to}
        className={(navLink)=>
            navLink.isActive
                ? 'flex justify-center items-center bg-gray-800 rounded-md p-2 transition-colors'
                : 'flex justify-center items-center hover:bg-gray-800 rounded-md p-2 transition-colors'
        }

    >
        <i className={`${icon} text-2xl mr-4 text-indigo-400`}></i>
        <div className="flex flex-col flex-grow">
            <span className="text-white text-lg font-semibold">
                { title }
            </span>
            <span className="text-gray-400 text-sm">
                { description }
            </span>
        </div>
    </NavLink>
  )
}
