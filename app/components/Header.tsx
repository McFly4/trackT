import { NavLink } from "@remix-run/react";
import type { LayoutProps } from "./Layout";

type HeaderProps = Pick<LayoutProps, "header" | "cart" | "isLoggedIn">;

type Viewport = "desktop" | "mobile";

export function Header({ header, isLoggedIn, cart }: HeaderProps) {
    return (
        <header className="myheader">
            <div className="nav-left">
                <div className="logo">
                    <NavLink prefetch="intent" to="/" end>
                        <img src={header?.shop?.brand?.logo?.image?.url} alt="logo" />
                    </NavLink>
                </div>
                <div className="nav-icons">
                    <div className="icon">
                        <NavLink prefetch="intent" to="/account">
                            <img src="/icons/person.svg" alt="person" />
                        </NavLink>
                    </div>
                    <div className="icon">
                        <a href="#cart-aside">
                            <img src="/icons/cart.svg" alt="cart" />
                        </a>
                    </div>
                    <div className="icon">
                        <a href="#search-aside">
                            <img src="/icons/search.svg" alt="search" />
                        </a>
                    </div>
                    <div className="icon">
                        <img src="/icons/heart.svg" alt="heart" />
                    </div>
                    {/* <HeaderMenuMobileToggle /> */}
                </div>
            </div>
            <div className="nav-right">
                <div className="nav-images">
                    <img src="/nav/dropReused.png" alt="drop" />
                </div>
                <div className="nav-images">
                    <img src="/nav/wanted.png" alt="drop" />
                </div>
                <div className="nav-images">
                    <img src="/nav/track.png" alt="drop" />
                </div>
            </div>
        </header>
    );
}

function HeaderMenuMobileToggle() {
    return (
        <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
            <h3>☰</h3>
        </a>
    );
}

const METAOBJECTS_QUERY = `#graphql
query MetaObjects {
    metaobjects(first: 10, type: "nav_images") {
      edges {
        node {
          fields {
            references(first: 10) {
              nodes {
                ... on MediaImage {
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
` as const;
