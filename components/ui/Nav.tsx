"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { site, nav } from "@/lib/site";
import logo from "@/public/trevor-riggle-design.png";
import styles from "./Nav.module.css";

export function Nav() {
  const pathname = usePathname();

  return (
    <header className={styles.nav}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.mark} aria-label={`${site.name}, home`}>
          <Image
            src={logo}
            alt=""
            className={styles.markImage}
            priority
            sizes="120px"
          />
        </Link>

        <nav aria-label="Primary">
          <ul className={styles.links}>
            {nav.map((item) => {
              /* Exact match, or a descendant route, /work/<slug> keeps Work
                 marked as current. */
              const current =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[styles.link, current && styles.current]
                      .filter(Boolean)
                      .join(" ")}
                    aria-current={current ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
