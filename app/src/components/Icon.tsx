import {
  forwardRef,
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
  type ReactNode,
  type SVGProps,
} from "react";

import { icons, type IconName } from "@/assets/icons/icons";

import { IconFallback } from "./IconFallback";

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

const modules = import.meta.glob<{
  default: SvgComponent;
}>("@/assets/icons/**/*.svg", { query: "?react" });

const lazyIcons = {} as Record<IconName, LazyExoticComponent<SvgComponent>>;

for (const [key, relPath] of Object.entries(icons)) {
  const fullPath = Object.keys(modules).find((p) => p.endsWith(relPath));

  if (!fullPath) {
    throw new Error(`[icons] Missing file for ${key} (${String(relPath)})`);
  }

  lazyIcons[key as IconName] = lazy(modules[fullPath]);
}

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  fallback?: ReactNode;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 24, width, height, fallback = null, ...props }, ref) => {
    const SvgIcon = lazyIcons[name];

    return (
      <Suspense fallback={fallback ?? <IconFallback size={size} />}>
        <SvgIcon
          ref={ref}
          width={width ?? size}
          height={height ?? size}
          style={{
            flexShrink: 0,
          }}
          {...props}
        />
      </Suspense>
    );
  },
);

Icon.displayName = "Icon";
