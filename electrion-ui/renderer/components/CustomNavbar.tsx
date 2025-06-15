import {
  IconHome2,
  IconPencil,
  IconPencilCog,
  IconSettings
} from '@tabler/icons-react';
import { Stack, Tooltip, UnstyledButton } from '@mantine/core';
import Link from 'next/link'

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  link?: string;
}

function NavbarLink({ icon: Icon, label, link }: NavbarLinkProps) {
  return (
    <Link href={link}>
      <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
        <UnstyledButton>
          <Icon size={20} stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    </Link>
  );
}

export function CustomNavbar() {
  return (
    <nav>
      <Stack justify="center" gap={10}>
        <NavbarLink icon={IconHome2} label="Home" link='/home'/>
        <NavbarLink icon={IconPencil} label="Post" link='/post'/>
        <NavbarLink icon={IconPencilCog} label="Edit" link='/edit'/>
      </Stack>
    </nav>
  );
}