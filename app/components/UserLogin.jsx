'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Avatar } from "@nextui-org/react";
import React from 'react'
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

const UserLogin = () => {
  const {
    user,
    handleSignInWithGoogle,
    handleLogout,
    isLoading
  } = useAuth()

  const router = useRouter()

  if (user) {
    return (
      <div>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              src={user?.photoURL}
            />
          </DropdownTrigger>
          <DropdownMenu 
            onAction={(key) => {
              if (key === 'logout') {
                handleLogout()
              }
              if (key === 'subscriptions') {
                router.push('/subscription')
              }
              if (key === 'my_courses') {
                router.push('/my-courses')
              }
            }}
            aria-label="Profile Actions" 
            variant="flat"
          >
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user?.email}</p>
            </DropdownItem>
            <DropdownItem key="subscriptions">
              Subscription
            </DropdownItem>
            <DropdownItem key="my_courses">My Courses</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }

  return (
    <div>
      <Button
        onClick={handleSignInWithGoogle}
        isLoading={isLoading}
        isDisabled={isLoading}
      >
        Sign In
      </Button>
    </div>
  )
}

export default UserLogin