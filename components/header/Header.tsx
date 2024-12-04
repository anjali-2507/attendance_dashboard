'use client';

import React from 'react';

import '@/app/globals.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { toggle } from '@/redux/features/toggle-slice';
import { IconProps } from '@radix-ui/react-icons/dist/types';

const Header = () => {
  const isExpanded = useAppSelector((state) => state.sidebarToggle.value);
  const dispatch = useDispatch();

  return (
    <div
      className={`max-md:flex max-md:justify-between md:my-2 md:mr-2 bg-[#052334] text-white p-3 md:rounded-sm transition-all duration-150 linear ${
        isExpanded ? 'md:ml-[167px]' : 'md:ml-9'
      }`}
    >
      <div
        className={`md:hidden cursor-pointer bg-white ${
          isExpanded ? 'absoulte z-10 max-md:ml-[130px]' : ''
        }`}
        onClick={() => dispatch(toggle())}
      >
        {isExpanded ? (
          <FontAwesomeIcon
            icon={faTimes as any}
            className="w-[25px] h-[25px]"
          />
        ) : (
          <FontAwesomeIcon icon={faBars as any} className="w-[25px] h-[25px]" />
        )}
      </div>
      Header
    </div>
  );
};

export default Header;
