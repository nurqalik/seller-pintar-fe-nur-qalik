"use client"

import HomepageComponent from "@/components/homepage/landing-component"
import { RouteProtection } from "@/components/auth/route-protection"

export default function Home() {
  return (
    <RouteProtection 
    >
      <HomepageComponent />
    </RouteProtection>
  );
}
