import React from "react";

import {
  Breadcrumb,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

import BreadcrumbItem from "./BreadcrumbItem";

type BreadcrumbsProps = {
  breadcrumbs: {
    href: string;
    label: string;
  }[];
};

function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <Breadcrumb className="mt-2">
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, i) => (
          <BreadcrumbItem
            key={breadcrumb.label}
            href={breadcrumb.href}
            label={breadcrumb.label}
            i={i}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const MemoizedBreadcrumbs = React.memo(Breadcrumbs);

MemoizedBreadcrumbs.displayName = "Breadcrumbs";

export default MemoizedBreadcrumbs;
