'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Avatar, User } from "@nextui-org/react";
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

  const imageString = user?.photoURL

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
          {/* <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                src: {imageString},
              }}
              className="transition-transform"
              description="@tonyreichert"
              name="Tony Reichert"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">@tonyreichert</p>
            </DropdownItem>
            <DropdownItem key="settings">
              My Settings
            </DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">
              Analytics
            </DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">
              Help & Feedback
            </DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown> */}
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