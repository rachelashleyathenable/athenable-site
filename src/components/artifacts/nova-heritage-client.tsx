"use client";

import { installArtifactRuntime } from "@/lib/artifact-runtime";
import NovaHeritageApp from "./nova-heritage-app";

// Installe le runtime (window.storage + proxy IA) dès le chargement du module,
// donc avant le premier effet de l'artéfact.
installArtifactRuntime();

export default function NovaHeritageClient() {
  return <NovaHeritageApp />;
}
