import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import AuthButton from '@/components/AuthButton';

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: "CEL Developer",
    children: <AuthButton />,
  },
  links: [
    {
      text: "Documentation",
      url: "/docs",
      active: "nested-url",
    },
     {
      text: "Project management",
      url: "/project-management",
      active: "nested-url",
    },
    {
      text: "Report issues",
      url: "/report-issues",
      active: "nested-url",
    },
    {
      text: "Log work",
      url: "/docs",
      active: "nested-url",
    },
    {
      text: "Login",
      url: "/login",
      active: "nested-url",
    },
  ],
};
