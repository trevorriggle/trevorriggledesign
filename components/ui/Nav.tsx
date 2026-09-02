"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { site, nav } from "@/lib/site";
import styles from "./Nav.module.css";

export function Nav() {
  const pathname = usePathname();

  return (
    <header className={styles.nav}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.mark}>
          {site.name}
        </Link>

        <nav aria-label="Primary">
          <ul className={styles.links}>
            {nav.map((item) => {
              /* Exact match, or a descendant route — /work/<slug> keeps Work
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
