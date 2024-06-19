"use client"
import React from "react"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import classNames from "classnames"
import { CaretDownIcon } from "@radix-ui/react-icons"
import "./NavigationMenu.scss"

const NavigationMenuDemo = () => {
  return (
    <NavigationMenu.Root className="NavigationMenuRoot">
      <NavigationMenu.List className="NavigationMenuList">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="NavigationMenuTrigger">
            Features <CaretDownIcon className="CaretDown" aria-hidden />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="NavigationMenuContent">
            <ul className="List one">
              <li style={{ gridRow: "span 3" }}>
                <NavigationMenu.Link asChild>
                  <a className="Callout" href="/">
                    <svg aria-hidden width="38" height="38" viewBox="0 0 25 25" fill="white">
                      <path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"></path>
                      <path d="M12 0H4V8H12V0Z"></path>
                      <path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"></path>
                    </svg>
                    <div className="CalloutHeading">Perfect Greet </div>
                    <p className="CalloutText">Out top and latest features</p>
                  </a>
                </NavigationMenu.Link>
              </li>

              <ListItem href="/hold" title="On Hold Message">
                Keep your callers entertained with our hold music.
              </ListItem>
              <ListItem href="/" title="Voicemail Greeting">
                Beautiful, thought-out palettes with auto dark mode.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link className="NavigationMenuLink" href="/posts/">
            Blog
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link className="NavigationMenuLink" href="#contact">
            Contact
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator className="NavigationMenuIndicator">
          <div className="Arrow" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className="ViewportPosition">
        <NavigationMenu.Viewport className="NavigationMenuViewport" />
      </div>
    </NavigationMenu.Root>
  )
}

// eslint-disable-next-line react/display-name
const ListItem = React.forwardRef(({ className, children, title, ...props }: any, forwardedRef) => (
  <li>
    <NavigationMenu.Link asChild>
      <a className={classNames("ListItemLink", className)} {...props} ref={forwardedRef}>
        <div className="ListItemHeading">{title}</div>
        <p className="ListItemText">{children}</p>
      </a>
    </NavigationMenu.Link>
  </li>
))

interface ListItemProps {
  className?: string
  children: React.ReactNode
  title: string
  href: string
}

export default NavigationMenuDemo
