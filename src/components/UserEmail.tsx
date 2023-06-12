import { Link, } from '@chakra-ui/react';

import { ExternalLinkIcon, } from '@chakra-ui/icons'
import React from "react";


type Props = {
    user: any;
};

const UserEmail: React.FC<Props> = (props: Props) => {
  const handleEmailClick = () => {
    window.location.href = `mailto:${props.user.email}`;
  };

  return (
    <Link onClick={handleEmailClick} color='blue' isExternal>
      {props.user.email} <ExternalLinkIcon mx='2px' />
    </Link>
  );
};

export default UserEmail;