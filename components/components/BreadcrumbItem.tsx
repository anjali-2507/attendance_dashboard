import React from "react";

import {
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbItem as Item,
} from "../ui/breadcrumb";

interface BreadcrumbItemProps {
    i: number;
    href: string;
    label: string;
}

function BreadcrumbItem({ i, href, label }: BreadcrumbItemProps) {
  return (
    <>
      {i === 0 ? <></> : <BreadcrumbSeparator />}
      <Item>
        <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
      </Item>
    </>
  );
}

export default BreadcrumbItem;
