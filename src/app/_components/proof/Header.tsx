"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "@phosphor-icons/react";
export function Header() {
  const path = usePathname();
  return (
    <header className="lp-header">
      <Link className="lp-brand" href="/">
        <span className="lp-monogram">
          lp<span>.</span>
        </span>
        <span>
          Model Evaluator
          <span className="brand-sub">An optimisation workspace</span>
        </span>
      </Link>
      <nav className="lp-header-end" aria-label="Main navigation">
        <Link href="/" aria-current={path === "/" ? "page" : undefined}>
          Workspace
        </Link>
        <Link
          href="/evaluation"
          aria-current={path === "/evaluation" ? "page" : undefined}
        >
          Evaluation
        </Link>
        <a
          className="source-link"
          href="https://github.com/Th1f/thesis"
          target="_blank"
          rel="noreferrer"
        >
          Source <ArrowUpRight size={15} />
        </a>
      </nav>
    </header>
  );
}
